
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

import paypal from "@paypal/checkout-server-sdk"; // Import PayPal SDK for handling PayPal transactions

// Create PayPal environment for Sandbox (test environment)
let environment = new paypal.core.SandboxEnvironment(
  "AceW9nJb3-RlOq1F9qpl40eCvABcWpTtxCO5rTu47RpdFOoAiQGJSRRKqAPVodkMWTUbVCAyNpBRaZDL", // PayPal client ID (Sandbox)
  "EHGdvjb7JZ2dnhivVEyI_LAJPEWLxOzkxcFkcivqc_HH4nnqUbcYscfqVsOLwxbqiFY7OqHMJkluJoT0" // PayPal client secret (Sandbox)
);

// Create a PayPal HTTP client to execute requests
let client = new paypal.core.PayPalHttpClient(environment);


export async function POST(req) {
  await dbConnect();
  console.log("Database connected ✅");

  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { token } = body; // PayPal order ID from client
    const session = await getServerSession(authOptions);
    console.log("User session:", session);

    if (!session?.user?._id) {
      console.log("Unauthorized access attempt ❌");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Capture the PayPal payment
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});
    const captureResponse = await client.execute(captureRequest);
    console.log("PayPal capture response:", JSON.stringify(captureResponse, null, 2));

    // 2. Check if capture was successful
    if (captureResponse.result.status !== 'COMPLETED') {
      console.log("Payment capture not completed ❌");
      return NextResponse.json(
        { error: "Payment capture not completed" }, 
        { status: 400 }
      );
    }

    // 3. Get full order details
    const orderRequest = new paypal.orders.OrdersGetRequest(token);
    const orderResponse = await client.execute(orderRequest);
    console.log("PayPal order details:", JSON.stringify(orderResponse, null, 2));

    // 4. Extract necessary data
    const purchaseUnit = orderResponse.result.purchase_units[0];
    const capture = purchaseUnit.payments.captures[0];
    const customData = JSON.parse(purchaseUnit.custom_id || capture.custom_id || '{}');
    
    const { 
      order_id, 
      user_id, 
      coupon_id, 
      amount,
      invoice_id 
    } = customData;

    console.log("Metadata extracted:", { 
      order_id, 
      user_id, 
      coupon_id, 
      amount,
      invoice_id 
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
      payment_method: 'paypal',
      payment_status: 'paid',
      transaction_id: capture.id,
      payment_approve_date: new Date(capture.create_time),
      currency_name: capture.amount.currency_code || 'USD',
     
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
          name: coupon.name
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