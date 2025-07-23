// File: app/api/related-product/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/model/product";
import ProductGallery from "@/model/productgallery";
import ProductOption from "@/model/productoption";
import ProductSize from "@/model/productsize";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { currentProductId, categoryId } = body;

    if (!categoryId || !currentProductId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Get related products
    const relatedProducts = await Product.find({
      category_id: categoryId,
      _id: { $ne: currentProductId },
    })
      .limit(4)
      .lean();

    // Enrich each product with gallery, options, and sizes
    const enrichedProducts = await Promise.all(
      relatedProducts.map(async (product) => {
        const [gallery, options, sizes] = await Promise.all([
          ProductGallery.find({ product_id: product._id }).lean(),
          ProductOption.find({ product_id: product._id }).lean(),
          ProductSize.find({ product_id: product._id }).lean(),
        ]);

        return {
          ...product,
          gallery,
          options,
          sizes,
        };
      })
    );

    console.log("enrichedProducts====================================================================== ", enrichedProducts);

    return NextResponse.json({
      success: true,
      relatedProducts: enrichedProducts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
