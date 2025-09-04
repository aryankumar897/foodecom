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

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { product_id, status } =body

 console.log({ product_id, status })

  try {
    // Check if product already exists in daily offers
    const existingOffer = await DailyOffer.findOne({ product_id });
    if (existingOffer) {
      return NextResponse.json({
        success: false,
        message: "Product already in daily offers",
      });
    }
    const dailyOffer = await DailyOffer.create({ product_id, status });

     console.log("daily offer" , dailyOffer)
    return NextResponse.json(dailyOffer);
  } catch (err) {
 console.log("err" , err)

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
