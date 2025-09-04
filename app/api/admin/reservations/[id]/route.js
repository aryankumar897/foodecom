import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Reservation from "@/model/reservation";

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();

   console.log("put body" ,body)
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );
    
    return NextResponse.json(updatedReservation);
  } catch (err) {
    return NextResponse.json(
      { err: err.message || "Failed to update reservation" },
      { status: 500 }
    );
  }
}



export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    await Reservation.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { err: err.message || "Failed to delete reservation" },
      { status: 500 }
    );
  }
}