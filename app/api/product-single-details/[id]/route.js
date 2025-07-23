// app/api/admin/products/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";
import ProductGallery from "@/model/productgallery";
import ProductOption from "@/model/productoption";
import ProductSize from "@/model/productsize";

// GET: Fetch single product by slug with all related data
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  console.log(id);


  try {
    const product = await Product.findOne({ slug: id })
      .populate("category_id", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ err: "Product not found" }, { status: 404 });
    }

    // Fetch all related data in parallel
    const [gallery, options, sizes] = await Promise.all([
      ProductGallery.find({ product_id: product._id }).lean(),
      ProductOption.find({ product_id: product._id }).lean(),
      ProductSize.find({ product_id: product._id }).lean(),
    ]);

    // Combine all data into a single response
    const response = {
      ...product,
      gallery,
      options,
      sizes,
    };

    console.log("response", response);

    return NextResponse.json(response);
  } catch (err) {
    console.log("err", err);
    return NextResponse.json(
      { err: err.message || "Server error" },
      { status: 500 }
    );
  }
}
