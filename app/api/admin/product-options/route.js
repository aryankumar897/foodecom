// app/api/admin/product-options/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ProductOption from "@/model/productoption";

// GET all options for a product
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");

  try {
    const options = await ProductOption.find({ product_id }).sort({ createdAt: -1 });
    return NextResponse.json(options);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST - Add new option
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const newOption = await ProductOption.create(body);
    return NextResponse.json(newOption);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}