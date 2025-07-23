import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DeliveryArea from "@/model/deliveryArea";

// GET: Fetch all delivery areas
export async function GET() {
  await dbConnect();

  try {
    const areas = await DeliveryArea.find({}).sort({ createdAt: -1 });

    console.log("area", areas);

    return NextResponse.json(areas);
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
