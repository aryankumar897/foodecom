// app/api/admin/product-sizes/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ProductSize from "@/model/productsize";

// GET all sizes for a product
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");

  try {
    const sizes = await ProductSize.find({ product_id }).sort({ createdAt: -1 });
    return NextResponse.json(sizes);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST - Add new size
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const newSize = await ProductSize.create(body);
    return NextResponse.json(newSize);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

