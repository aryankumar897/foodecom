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

// PUT: Update product
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();

  try {
    if (body.name) {
      body.slug = slugify(body.name, { lower: true });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    }).populate("category_id", "name slug");

    if (!updatedProduct) {
      return NextResponse.json({ err: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE: Remove product
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ err: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(deletedProduct);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
