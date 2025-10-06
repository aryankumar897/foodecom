
import Razorpay from "razorpay"; // Import Razorpay SDK for payment gateway integration

// Initialize Razorpay instance using the key and secret from environment variables
var razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Set the Razorpay key ID from environment variables
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Set the Razorpay key secret from environment variables
});


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
  console.log("[API] razorpay payment endpoint hit");

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
      payment_method: "razorpay",
      payment_status: "pending",
      transaction_id: null,
      payment_approve_date: new Date(),
      coupon_info: couponData || {},
      currency_name: "INR",
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

   


      // 8. Create Razorpay order
    const razorpayOptions = {
      amount: Math.round(serverTotal * 100), // Amount in paise
      currency: "INR",
      receipt: newOrder.invoice_id,
      notes: {
        order_id: newOrder._id.toString(),
        user_id: userId.toString(),
        coupon_id: couponData?.id.toString() || "",
        amount: serverTotal.toString()
      },
      payment_capture: 1 // Auto-capture payment
    };

    const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
    newOrder.transaction_id = razorpayOrder.id;
   
    await newOrder.save();

    console.log("razorpayOrder****", razorpayOrder);
    // Empty the user's cart after successful order creation
    await Cart.deleteMany({ userId: userId });
    return NextResponse.json(razorpayOrder);
  } catch (error) {
    console.error("[ERROR] Payment failed:", error.message);
    return NextResponse.json(
      { error: error.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}































// import { NextResponse } from "next/server";

// import dbConnect from "@/utils/dbConnect";

// import CurriculumCourse from "@/models/CurriculumCourse";

// import Razorpay from "razorpay";
// var razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export async function GET(req,context) {
//   await dbConnect();
  
//   try {
    
//       const course = await CurriculumCourse.findOne({
//           slug: context.params.id,
//         }).sort({
//           createdAt: -1,
//         });


//     const options = {
//       amount: course.price * 100, //amount in smallest currency unit
//       currency: "INR",
//       receipt: "course_receipt",
//       notes: {
//         course_id: course?._id,
//       },
//     };

//     const order = await razorpay.orders.create(options);

//     console.log("order RAZORPAY", order);

//     return NextResponse.json(order);
//   } catch (err) {

//      console.log("ERROR", err)
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }