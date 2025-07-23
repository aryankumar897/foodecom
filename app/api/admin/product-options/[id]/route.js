// app/api/admin/product-sizes/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ProductOption from "@/model/productoption";

// DELETE - Remove size
export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();

  try {
    await ProductOption.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
