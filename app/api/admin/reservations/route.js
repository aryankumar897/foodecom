import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Reservation from "@/model/reservation";

export async function GET() {
  await dbConnect();
  
  try {
    const reservations = await Reservation.find({})
    .populate("time")
    .sort({ createdAt: -1 });

     console.log("time" ,reservations )
    return NextResponse.json(reservations);
  } catch (err) {
      console.log("reservation error" , err)
    return NextResponse.json(
      { err: err.message || "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}