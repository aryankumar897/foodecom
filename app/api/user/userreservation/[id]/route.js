import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Reservation from "@/model/reservation";

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
 
   console.log("id" , id)
  try {
    const reservations = await Reservation.find({ user_id: id }).populate("time")
      .sort({ createdAt: -1 });

    return NextResponse.json(reservations);
  } catch (err) {
     console.log("error user  recertion"  , err)
    return NextResponse.json(
      { err: err.message || "Failed to fetch user reservations" },
      { status: 500 }
    );
  }
}