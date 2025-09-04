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

// POST: Create a new banner
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { 
    title, 
    sub_title, 
    banner, 
    url, 
    status = true 
  } = body;

  try {
    // Validate required fields
    if (!title || !sub_title || !banner || !url) {
      return NextResponse.json(
        { err: "Title, sub title, banner image, and URL are required" }, 
        { status: 400 }
      );
    }

    const bannerSlider = await BannerSlider.create({
      title,
      sub_title,
      banner,
      url,
      status
    });

    return NextResponse.json(bannerSlider);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}