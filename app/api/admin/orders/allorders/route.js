import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders"

// GET: Fetch all orders
export async function GET() {
  await dbConnect();

  try {
    const orders = await Orders.find({})
    .populate("user_id")
    .sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
