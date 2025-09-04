import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import BannerSlider from "@/model/bannerSlider";

// GET: Fetch all banners
export async function GET() {
  await dbConnect();

  try {
    const banners = await BannerSlider.find({}).sort({ createdAt: -1 });
    return NextResponse.json(banners);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
