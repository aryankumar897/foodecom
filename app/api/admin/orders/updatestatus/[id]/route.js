import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders";


export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const { payment_status, order_status } = await req.json();

    const updatedOrder = await Orders.findByIdAndUpdate(
     id,
      {
        payment_status,
        order_status,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (err) {
    console.error("Error updatedOrder order:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
