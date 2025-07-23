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
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";




export async function POST(req) {
  await dbConnect();
  console.log("Database connected ✅");

  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { sessionid } = body;
    const session = await getServerSession(authOptions);
    console.log("User session:", session);

    if (!session?.user?._id) {
      console.log("Unauthorized access attempt ❌");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripesession = await stripeInstance.checkout.sessions.retrieve(sessionid, {
      expand: ['payment_intent']
    });
    console.log("Stripe session:", stripesession);

    if (stripesession.payment_status !== 'paid') {
      console.log("Payment not completed ❌");
      return NextResponse.json(
        { error: "Payment not completed" }, 
        { status: 400 }
      );
    }

    const { order_id, user_id, coupon_id, amount, currency } = stripesession.metadata;
    console.log("Metadata extracted:", { order_id, user_id, coupon_id, amount, currency });

    if (user_id !== session.user._id.toString()) {
      console.log("User ID mismatch ❌");
      return NextResponse.json(
        { error: "Order does not belong to this user" },
        { status: 403 }
      );
    }

    const updateData = {
      payment_method: stripesession.payment_method_types[0] || 'card',
      payment_status: 'paid',
      transaction_id: stripesession.payment_intent?.id || stripesession.id,
      payment_approve_date: new Date(stripesession.created * 1000),
      currency_name: currency || stripesession.currency || 'USD'
    };
    console.log("Update data prepared:", updateData);

    let couponInfo = {};
    if (coupon_id) {
      console.log("Coupon ID found, updating coupon usage...");
     
     
      const coupon = await Coupon.findByIdAndUpdate(
        coupon_id,
        { $inc: { used_count: 1 } },
        { new: true }
      );



      if (coupon) {
        couponInfo = {
          coupon_id: coupon._id,
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount,
          name: coupon.name
        };
        console.log("Coupon info:", couponInfo);
      } else {
        console.log("Coupon not found ❌");
      }
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      order_id,
      {
        ...updateData,
      ...(coupon_id && { coupon_info: couponInfo })
      },
      { new: true }
    );
    console.log("Order update result:", updatedOrder);

    if (!updatedOrder) {
      console.log("Order not found ❌");
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    console.log("Order updated successfully ✅");
    return NextResponse.json({ 
      success: true,
      order: updatedOrder,
      paymentDetails: {
        amount: amount,
        currency: currency,
        payment_method: updateData.payment_method,
        transaction_id: updateData.transaction_id
      }
    });

  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { error: err.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}





