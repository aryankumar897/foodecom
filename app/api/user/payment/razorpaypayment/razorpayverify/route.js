import Razorpay from "razorpay"; // Import Razorpay SDK to integrate Razorpay payment gateway

// Initialize Razorpay instance with the secret and key from environment variables
var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Set the Razorpay key ID from the environment variables
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Set the Razorpay key secret from the environment variables
});

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders";
import Coupon from "@/model/coupon";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function POST(req) {
  await dbConnect();
  console.log("Database connected ✅");

  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { razorpay_payment_id } = body;
    const session = await getServerSession(authOptions);
    console.log("User session:", session);

    if (!session?.user?._id) {
      console.log("Unauthorized access attempt ❌");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log("Razorpay payment details:", payment);

    if (payment.status !== "captured") {
      console.log("Payment not captured ❌");
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // 4. Extract metadata from Razorpay order notes
    const { order_id, user_id, coupon_id, amount } = payment.notes;

    console.log("Metadata extracted:", {
      order_id,
      user_id,
      coupon_id,
      amount,
    });

    // 5. Validate user ownership
    if (user_id !== session.user._id.toString()) {
      console.log("User ID mismatch ❌");
      return NextResponse.json(
        { error: "Order does not belong to this user" },
        { status: 403 }
      );
    }

    // 6. Prepare update data
    const updateData = {
      payment_method: "razorpay",
      payment_status: "paid",
      transaction_id: razorpay_payment_id,
      payment_approve_date: new Date(payment.created_at * 1000),
      currency_name: payment.currency || "INR",
    };
    console.log("Update data prepared:", updateData);

    // 7. Handle coupon if exists
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
          name: coupon.name,
        };
        console.log("Coupon info:", couponInfo);
      } else {
        console.log("Coupon not found ❌");
      }
    }

    // 8. Update the order in database
    const updatedOrder = await Orders.findByIdAndUpdate(
      order_id,
      {
        ...updateData,
        ...(coupon_id && { coupon_info: couponInfo }),
      },
      { new: true }
    );
    console.log("Order update result:", updatedOrder);

    if (!updatedOrder) {
      console.log("Order not found ❌");
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 9. Return success response
    console.log("Order updated successfully ✅");
    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      {
        error: err.message || "Payment verification failed",
      },
      { status: 500 }
    );
  }
}
