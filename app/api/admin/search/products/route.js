// app/api/admin/products/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product"

// GET: Fetch all products with optional search
export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit")) || 10;
    
    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { short_description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query)
      .select("name description price images") // Select only necessary fields
      .populate("category_id", "name") // Populate category info
      .limit(limit)
      .sort({ createdAt: -1 });
      
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}