// app/api/admin/product-gallery/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DailyOffer from "@/model/dailyOffer";

export async function GET(req) {
  await dbConnect();

  try {
    const dailyOffer = await DailyOffer.find({})
      .populate("product_id")
      .sort({ createdAt: -1 });
    return NextResponse.json(dailyOffer);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
