// app/api/admin/products/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";
import slugify from "slugify";

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

// POST: Create a new product with all fields
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const {
    name,
    category_id,
    price,
    thumb_image,
    short_description,
    long_description,
    offer_price,
    sku,
    seo_title,
    seo_description,
    show_at_home = false,
    status = true,
  } = body;

  try {
    // Basic validation
    if (!name || !category_id || !price || !thumb_image) {
      return NextResponse.json(
        { err: "Required fields are missing" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true }),
      category_id,
      price,
      thumb_image,
      short_description,
      long_description,
      offer_price,
      sku: sku || generateSKU(), // You might want a SKU generator function
      seo_title: seo_title || name,
      seo_description: seo_description || short_description,
      show_at_home,
      status,
    });

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// Helper function to generate a SKU
function generateSKU(prefix = "PROD", length = 8) {
  const randomPart = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  const timestampPart = Date.now().toString(36).toUpperCase().slice(-4); // adds uniqueness
  return `${prefix}-${randomPart}${timestampPart}`;
}
