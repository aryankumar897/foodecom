import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DeliveryArea from "@/model/deliveryArea";

// ✅ PUT: Update a delivery area by ID
export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;

    const updatedArea = await DeliveryArea.findByIdAndUpdate(
      context.params.id,
      updateBody,
      { new: true }
    );

    return NextResponse.json(updatedArea);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ DELETE: Delete a delivery area by ID
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedArea = await DeliveryArea.findByIdAndDelete(context.params.id);
    return NextResponse.json(deletedArea);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ GET: Get a delivery area by ID
export async function GET(req, context) {
  await dbConnect();

  try {
    const area = await DeliveryArea.findById(context.params.id);
    if (!area) {
      return NextResponse.json({ err: "Delivery area not found" }, { status: 404 });
    }

    return NextResponse.json(area);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
