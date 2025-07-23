import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DeliveryArea from "@/model/deliveryArea";

// GET: Fetch all delivery areas
export async function GET() {
  await dbConnect();

  try {
    const areas = await DeliveryArea.find({}).sort({ createdAt: -1 });
    return NextResponse.json(areas);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST: Create a new delivery area
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const {
    area_name,
    min_delivery_time,
    max_delivery_time,
    delivery_fee,
    status = true,
  } = body;

  try {
    const area = await DeliveryArea.create({
      area_name,
      min_delivery_time,
      max_delivery_time,
      delivery_fee,
      status,
    });

    return NextResponse.json(area);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
