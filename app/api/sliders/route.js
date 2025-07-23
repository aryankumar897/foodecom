import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Slider from "@/model/slider";

export async function GET() {
  await dbConnect();

  try {
    const sliders = await Slider.find({ status: true }).sort({ createdAt: -1 });
    return NextResponse.json(sliders);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
