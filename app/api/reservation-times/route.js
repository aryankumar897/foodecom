import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ReservationTime from "@/model/reservationTime";

// GET: Fetch all reservation times
export async function GET() {
  await dbConnect();

  try {
    const times = await ReservationTime.find({ status: true }).sort({ createdAt: -1 });
    return NextResponse.json(times);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
