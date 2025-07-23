import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Slider from "@/model/slider";

// Utility function to clean string inputs
const cleanStringInput = (str) => {
  if (!str) return str;
  return str.replace(/\n/g, '').trim();
};

export async function GET() {
  await dbConnect();

  try {
    const sliders = await Slider.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sliders);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  // Clean the input data
  const cleanedData = {
    image: body.image,
    offer: cleanStringInput(body.offer),
    title: cleanStringInput(body.title),
    sub_title: cleanStringInput(body.sub_title),
    short_description: cleanStringInput(body.short_description),
    button_link: body.button_link,
    status: body.status || true
  };

  try {
    const slider = await Slider.create(cleanedData);
    
    return NextResponse.json({
      success: true,
      data: slider,
      message: "Slider created successfully"
    });
    
  } catch (err) {
    return NextResponse.json(
      { 
        success: false,
        error: err.message,
        message: "Failed to create slider",
        receivedData: cleanedData // For debugging
      }, 
      { status: 500 }
    );
  }
}