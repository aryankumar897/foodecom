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




// POST: Create a new testimonial
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { 
    image, 
    name, 
    title, 
    review, 
    rating, 
    show_at_home = false, 
    status = true 
  } = body;

  try {
    const testimonial = await Testimonial.create({
      image,
      name,
      title,
      review,
      rating,
      show_at_home,
      status
    });

    return NextResponse.json(testimonial);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
