import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders";

// GET: Fetch all orders
export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context.params;
  try {
    // Finding the Orders by its ID and deleting it
    const deletedOrders = await Orders.findByIdAndDelete(id);

    return NextResponse.json(deletedOrders);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
