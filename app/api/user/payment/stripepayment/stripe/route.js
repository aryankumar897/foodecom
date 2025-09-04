// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import dbConnect from "@/utils/dbConnect";
// import Orders from "@/model/orders";
// import User from "@/model/user";

// import { getServerSession } from "next-auth/next"; // Import function to get the current server session (user data)
// import { authOptions } from "@/utils/authOptions"; // Import authentication options for session management
// import Cart from "@/model/cart";
// import Product from "@/model/product";
// import ProductSize from "@/model/productsize";
// import ProductOption from "@/model/productoption";

// import OrderItem from "@/model/orderItem"

// const stripeInstance = new Stripe(
//   "sk_test_51K5nvYSGgs9C5RdZpIIhINkUXAcMb46wbwGbJiGGWlt2VXjXhjP6wQerucW9lc3AUDCoMZ3ArV3zLIMxCQRSI24100pNDDDSew"
// );

// // Utility to generate invoice ID
// const generateInvoiceId = () => {
//   return "INV-" + Date.now();
// };

// export async function POST(req, context) {
//   await dbConnect();

//   const body = await req.json();
//   console.log("body", body);

//   // Retrieve the current session (user data)
//   // const usersession = await getServerSession(authOptions);

//   // if (!usersession || !usersession.user || !usersession.user._id) {
//   //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   //   }

//   return;
//   try {
//     const session = req.session;
//     const user = usersession?.user?._id;

//     const cartItems = session.cart || [];
//     const product_qty = cartItems.length;

//     const subtotal = cartItems.reduce(
//       (acc, item) => acc + item.price * item.qty,
//       0
//     );
//     const delivery_fee = session.delivery_fee || 0;
//     const discount = session?.coupon?.discount || 0;
//     const grand_total = subtotal + delivery_fee - discount;

//     const newOrder = new Orders({
//       invoice_id: generateInvoiceId(),
//       user_id: user._id,
//       address: session.address,
//       discount,
//       delivery_charge: delivery_fee,
//       subtotal,
//       grand_total,
//       product_qty,
//       payment_method: null,
//       payment_status: "pending",
//       payment_approve_date: null,
//       transaction_id: null,
//       coupon_info: session.coupon || {},
//       currency_name: null,
//       order_status: "pending",
//     });

//     await newOrder.save();

//      for (const product of cartItems) {
//       const orderItem = new OrderItem({
//         order_id: newOrder?._id,
//         product_name: product.name,
//         product_id: product._id,
//         unit_price: product.price,
//         qty: product.qty,
//         product_size: JSON.stringify(product.options?.product_size || null),
//         product_option: JSON.stringify(product.options?.product_options || null),
//       });

//       await orderItem.save();
//     }

//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }

//https://docs.stripe.com/testing#international-cards

const stripeInstance = new Stripe(
  "sk_test_51K5nvYSGgs9C5RdZpIIhINkUXAcMb46wbwGbJiGGWlt2VXjXhjP6wQerucW9lc3AUDCoMZ3ArV3zLIMxCQRSI24100pNDDDSew"
);

import { NextResponse } from "next/server";
import Stripe from "stripe";
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

import Notification from "@/model/orderplacednotification";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

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
      payment_method: "stripe",
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

    // 8. Create Stripe session
    const stripeSession = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: `Order #${newOrder.invoice_id}`,
              description: `${cartItems.length} items ($${(
                serverTotal / 100
              ).toFixed(2)})`,
            },
            unit_amount: Math.round(serverTotal * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/dashboard/user/stripe/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/dashboard/user/stripe/order/canceled`,

      metadata: {
        order_id: newOrder._id.toString(),
        amount: serverTotal.toString(),
        user_id: userId.toString(), // <-- Added user ID
        coupon_id: couponData?.id.toString() || "", // <-- Added coupon ID
      },

      customer_email: session.user.email,
    });

    const notidata = {
      message: "New order placed!",
      userId: userId,
      redirectUrl: `/dashboard/admin/orders/${newOrder?._id}`, // Add redirect URL
      order_id: newOrder?._id,
    };

    const notification = await Notification.create(notidata);

    // Trigger Pusher event to general channel
    await pusher.trigger("notifications", "new-notification", {
      notification,
    });

    // 9. Update order with Stripe ID
    newOrder.transaction_id = stripeSession.id;
    await newOrder.save();

    console.log("stripeSession****", stripeSession);
    // Empty the user's cart after successful order creation
    await Cart.deleteMany({ userId: userId });
    return NextResponse.json({
      url: stripeSession.url,
    });
  } catch (error) {
    console.error("[ERROR] Payment failed:", error.message);
    return NextResponse.json(
      { error: error.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}
