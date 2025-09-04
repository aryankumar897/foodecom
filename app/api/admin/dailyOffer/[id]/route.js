// app/api/admin/product-sizes/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DailyOffer from "@/model/dailyOffer";

// DELETE - Remove size
export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();

  try {
    await DailyOffer.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE - Remove size
export async function PUT(req) {
  await dbConnect();
  const { id, status } = await req.json();

 console.log( " id, status ",  { id, status })

  try {
    const offer = await DailyOffer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
