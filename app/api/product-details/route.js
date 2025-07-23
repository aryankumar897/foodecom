import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ProductSize from "@/model/productsize";
import ProductOption from "@/model/productoption";

export async function GET(req) {
  await dbConnect();
  console.log("Connection to DB established"); // Debug log

  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");
  console.log("Incoming request for product_id:", product_id); // Debug log

  if (!product_id) {
    console.log("Missing product_id parameter"); // Debug log
    return NextResponse.json(
      { err: "product_id parameter is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Fetching data for product:", product_id); // Debug log
    const [sizes, options] = await Promise.all([
      ProductSize.find({ product_id }).sort({ createdAt: 1 }),
      ProductOption.find({ product_id }).sort({ createdAt: 1 })
    ]);

    console.log("Fetched data:", { 
      sizesCount: sizes.length, 
      optionsCount: options.length 
    }); // Debug log

    return NextResponse.json({
      success: true,
      sizes,
      options
    });
  } catch (err) {
    console.error("Database error:", err); // Debug log
    return NextResponse.json(
      { err: "Failed to fetch product details", details: err.message },
      { status: 500 }
    );
  }
}