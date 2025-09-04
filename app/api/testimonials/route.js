import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Testimonial from "@/model/testimonial";

// GET: Fetch all testimonials
export async function GET() {
  await dbConnect();

  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

