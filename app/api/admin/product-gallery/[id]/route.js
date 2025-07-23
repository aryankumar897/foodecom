// app/api/admin/product-gallery/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import ProductGallery from "@/model/productgallery"


export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    await ProductGallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}