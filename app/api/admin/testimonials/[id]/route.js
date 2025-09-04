import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Testimonial from "@/model/testimonial";

// PUT: Update a testimonial
export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      context.params.id,
      updateBody,
      { new: true }
    );

    return NextResponse.json(updatedTestimonial);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}



// DELETE: Delete a testimonial
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(
      context.params.id
    );

    return NextResponse.json(deletedTestimonial);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}



// GET: Fetch a single testimonial by ID
export async function GET(req, context) {
  await dbConnect();

  try {
    const testimonial = await Testimonial.findById(context.params.id);

    if (!testimonial) {
      return NextResponse.json(
        { err: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}


