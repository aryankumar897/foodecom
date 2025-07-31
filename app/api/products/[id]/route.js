// app/api/admin/products/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";
import slugify from "slugify";

// GET: Fetch single product
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const product = await Product.findById(id).populate(
      "category_id",
      "name slug"
    );
    if (!product) {
      return NextResponse.json({ err: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

