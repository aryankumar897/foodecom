


import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders";
import Product from "@/model/product";
import ProductSize from "@/model/productsize";
import ProductOption from "@/model/productoption";
import OrderItem from "@/model/orderItem";
import DeliveryArea from "@/model/deliveryArea";
import Coupon from "@/model/coupon";
import Cart from "@/model/cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";



import paypal from '@paypal/checkout-server-sdk'; // Import PayPal SDK for handling PayPal transactions

// Set up PayPal environment with client ID and secret (sandbox mode for testing)
let environment = new paypal.core.SandboxEnvironment(
  "AceW9nJb3-RlOq1F9qpl40eCvABcWpTtxCO5rTu47RpdFOoAiQGJSRRKqAPVodkMWTUbVCAyNpBRaZDL", // PayPal client ID (Sandbox)
  "EHGdvjb7JZ2dnhivVEyI_LAJPEWLxOzkxcFkcivqc_HH4nnqUbcYscfqVsOLwxbqiFY7OqHMJkluJoT0" // PayPal client secret (Sandbox)
);

// Create PayPal client to interact with the PayPal API
let client = new paypal.core.PayPalHttpClient(environment);






const generateInvoiceId = () => {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Enhanced cart item validation
async function validateCartItems(cartItems) {
  console.log("[VALIDATION] Starting cart item validation...");
  const validatedItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    try {
      console.log(`[ITEM] Processing: ${item._id}`);

      // Validate product
      const productId = item.productId._id || item.productId;
      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product not found: ${productId}`);
      console.log(`[PRODUCT] ${product.name} ($${product.price})`);

      // Validate size
      let size = null;
      let sizePrice = 0;
      if (item.sizeId) {
        const sizeId = item.sizeId._id || item.sizeId;
        size = await ProductSize.findOne({
          _id: sizeId,
          product_id: productId,
        });
        if (!size)
          throw new Error(`Size not found for this product: ${sizeId}`);
        sizePrice = size.price;
        console.log(`[SIZE] ${size.name} (+$${sizePrice})`);
      }

      // Validate options
      const options = [];
      let optionsPrice = 0;
      if (item.optionIds?.length > 0) {
        for (const option of item.optionIds) {
          const optionId = option._id || option;
          const optionDoc = await ProductOption.findOne({
            _id: optionId,
            product_id: productId,
          });
          if (!optionDoc) throw new Error(`Option not found: ${optionId}`);
          options.push(optionDoc);
          optionsPrice += optionDoc.price;
          console.log(`[OPTION] ${optionDoc.name} (+$${optionDoc.price})`);
        }
      }

      // Calculate item total
      const itemPrice = product.price + sizePrice + optionsPrice;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      console.log(`[CALCULATION] 
        Base: $${product.price} 
        + Size: $${sizePrice} 
        + Options: $${optionsPrice} 
        = $${itemPrice} x ${item.quantity} 
        = $${itemTotal}`);

      validatedItems.push({
        product,
        size,
        options,
        quantity: item.quantity,
        unitPrice: itemPrice,
        totalPrice: itemTotal,
      });
    } catch (error) {
      console.error(`[ERROR] Item validation failed: ${error.message}`);
      throw error;
    }
  }

  console.log(`[SUBTOTAL] Final calculated: $${subtotal}`);
  return { validatedItems, subtotal };
}

// Delivery fee validation
async function validateDeliveryFee(areaId, clientFee) {
  console.log(`[DELIVERY] Validating area: ${areaId}`);
  const area = await DeliveryArea.findById(areaId);
  if (!area) throw new Error("Delivery area not found");

  console.log(`[DELIVERY] ${area.area_name} fee: $${area.delivery_fee}`);

  if (area.delivery_fee !== clientFee) {
    throw new Error(
      `Delivery fee mismatch (Client: $${clientFee} vs DB: $${area.delivery_fee})`
    );
  }

  return area.delivery_fee;
}

// Coupon validation with enhanced checks
async function validateCoupon(code, clientDiscount, subtotal) {
  if (!code) {
    console.log("[COUPON] No coupon applied");
    return { discount: 0 };
  }

  console.log(`[COUPON] Validating: ${code}`);
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    status: true,
    expire_date: { $gt: new Date() },
    $expr: { $lt: ["$used_count", "$quantity"] },
  });

  if (!coupon) throw new Error("Invalid, expired, or fully redeemed coupon");
  console.log(
    `[COUPON] Valid: ${coupon.name} (${coupon.discount_type} ${coupon.discount})`
  );

  // Check minimum purchase
  if (subtotal < coupon.min_purchase_amount) {
    throw new Error(
      `Minimum purchase of $${coupon.min_purchase_amount} required`
    );
  }

  // Calculate discount
  const calculatedDiscount =
    coupon.discount_type === "percentage"
      ? (subtotal * coupon.discount) / 100
      : coupon.discount;

  console.log(`[COUPON] Calculated discount: $${calculatedDiscount}`);

  if (Math.abs(calculatedDiscount - clientDiscount) > 0.01) {
    throw new Error(
      `Discount mismatch (Client: $${clientDiscount} vs DB: $${calculatedDiscount})`
    );
  }

  return {
    discount: calculatedDiscount,
    couponData: {
      id: coupon._id, // <-- Add this line
      name: coupon.name,
      code: coupon.code,
      type: coupon.discount_type,
      value: coupon.discount,
      min_purchase: coupon.min_purchase_amount,
    },
  };
}

export async function POST(req) {
  await dbConnect();
  console.log("[API] Stripe payment endpoint hit");

  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      console.error("[AUTH] Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request
    const body = await req.json();
    const userId = session.user?._id;
    console.log("[REQUEST] Received order data");

    // Destructure with defaults
    const {
      cartItems = [],
      subtotal: clientSubtotal = 0,
      totalDiscount: clientDiscount = 0,
      deliveryFee: clientDeliveryFee = 0,
      total: clientTotal = 0,
      address = {},
      couponCode = "",
    } = body;

    // 1. Validate cart items
    const { validatedItems, subtotal: serverSubtotal } =
      await validateCartItems(cartItems);

    // 2. Validate delivery fee
    const deliveryFee = await validateDeliveryFee(
      address.delivery_area_id?._id || address.delivery_area_id,
      clientDeliveryFee
    );

    // 3. Validate coupon
    const { discount: serverDiscount, couponData } = await validateCoupon(
      couponCode,
      clientDiscount,
      serverSubtotal
    );

    // 4. Calculate final total
    const serverTotal = serverSubtotal - serverDiscount + deliveryFee;
    console.log(`[TOTAL] 
      Subtotal: $${serverSubtotal}
      - Discount: $${serverDiscount}
      + Delivery: $${deliveryFee}
      = $${serverTotal}`);

    // 5. Verify all calculations
    if (Math.abs(clientSubtotal - serverSubtotal) > 0.01) {
      throw new Error(
        `Subtotal mismatch (Client: $${clientSubtotal} vs Server: $${serverSubtotal})`
      );
    }

    if (Math.abs(clientTotal - serverTotal) > 0.01) {
      throw new Error(
        `Total mismatch (Client: $${clientTotal} vs Server: $${serverTotal})`
      );
    }

   
 
   


     // 6. Create order record
    const newOrder = new Orders({
      invoice_id: generateInvoiceId(),
      user_id: userId,
      address: address,
      discount: serverDiscount,
      delivery_charge: deliveryFee,
      subtotal: serverSubtotal,
      grand_total: serverTotal,
      product_qty: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      payment_method: "paypal",
      payment_status: "pending",
      transaction_id: null,
      payment_approve_date: null,
      coupon_info: couponData || {},
      currency_name: "USD",
      order_status: "pending",
    });

    await newOrder.save();
    console.log(`[ORDER] Created: ${newOrder._id}`);

    // 7. Create order items
    await Promise.all(
      validatedItems.map((item) =>
        new OrderItem({
          order_id: newOrder._id,
          product_id: item.product._id,
          product_name: item.product.name,
          unit_price: item.unitPrice,
          qty: item.quantity,
          product_size: item.size || null,
          product_option: item.options.length > 0 ? item.options : null,
        }).save()
      )
    );

    // 8. Create PayPal order with metadata
    const metadata = {
      order_id: newOrder._id.toString(),
      user_id: userId.toString(),
      coupon_id: couponData?.id.toString() || "",
      amount: serverTotal.toString(),
      invoice_id: newOrder.invoice_id
    };

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: metadata.order_id,
        custom_id: JSON.stringify(metadata),
        invoice_id: metadata.invoice_id,
        description: `Order ${newOrder.invoice_id} (${cartItems.length} items)`,
        amount: {
          currency_code: "USD",
          value: metadata.amount,
          breakdown: {
            item_total: { currency_code: "USD", value: serverSubtotal.toFixed(2) },
            discount: { currency_code: "USD", value: serverDiscount.toFixed(2) },
            shipping: { currency_code: "USD", value: deliveryFee.toFixed(2) }
          }
        },
        items: validatedItems.map(item => ({
          name: item.product.name,
          unit_amount: { currency_code: "USD", value: item.unitPrice.toFixed(2) },
          quantity: item.quantity.toString(),
         
          description: [
            item.size?.name,
            ...item.options.map(o => o.name)
          ].filter(Boolean).join(', ') || undefined
        }))
      }],
      application_context: {
     
        return_url: `http://localhost:3000/dashboard/user/paypal/order/success`,
        cancel_url: `http://localhost:3000/dashboard/user/paypal/order/canceled`,
      
      }
    });

    // 9. Execute PayPal request
    const paypalOrder =  await client.execute(request);
    console.log("PayPal order created:", paypalOrder.result.id);

    //** */ 10. Update order with PayPal ID
    newOrder.transaction_id = paypalOrder.result.id;
    await newOrder.save();

    // 11. Find approval URL
    const approvalLink = paypalOrder.result.links.find(
      link => link.rel === "approve"
    );

    if (!approvalLink) {
      throw new Error("No approval link found in PayPal response");
    }


     console.log("paypalOrder ",paypalOrder )
    // 12. Empty the user's cart after successful order creation
    await Cart.deleteMany({ userId: userId });

    return NextResponse.json({
      url: approvalLink.href,
     
    });
  } catch (error) {
    console.error("[ERROR] Payment failed:", error.message);
    return NextResponse.json(
      { error: error.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}


















































// //sb-drhne26200129@personal.example.com