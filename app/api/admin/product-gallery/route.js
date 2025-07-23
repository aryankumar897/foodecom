// app/api/admin/product-gallery/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ProductGallery from "@/model/productgallery"

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");

  try {
    const gallery = await ProductGallery.find({ product_id })
      .sort({ createdAt: -1 });
    return NextResponse.json(gallery);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const newImage = await ProductGallery.create(body);
    return NextResponse.json(newImage);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}