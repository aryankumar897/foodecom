// app/api/admin/products/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";


// GET: Fetch all products
export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find({})
      .populate("category_id", "name slug") // Populate category info
      .sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

