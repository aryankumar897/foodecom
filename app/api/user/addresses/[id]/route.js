import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Address from "@/model/addresses";

// ✅ PUT: Update address by ID
export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;

    const updatedAddress = await Address.findByIdAndUpdate(
      context.params.id,
      updateBody,
      { new: true }
    );

    return NextResponse.json(updatedAddress);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ DELETE: Delete address by ID
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedAddress = await Address.findByIdAndDelete(context.params.id);

    return NextResponse.json(deletedAddress);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ GET: Fetch single address by ID
export async function GET(req, context) {
  await dbConnect();

  try {
    const address = await Address.findById(context.params.id)
      .populate("user_id", "name email")
      .populate("delivery_area_id", "name");

    if (!address) {
      return NextResponse.json(
        { err: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(address);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
