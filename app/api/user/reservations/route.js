import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Reservation from "@/model/reservation";
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // adjust path as needed

export async function POST(req) {
  await dbConnect();
   const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user._id;
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = ['name', 'phone', 'date', 'time', 'persons'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { err: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

   

    // Validate persons count
    if (body.persons < 1 || body.persons > 20) {
      return NextResponse.json(
        { err: "Number of persons must be between 1 and 20" },
        { status: 400 }
      );
    }

    // Prepare reservation data
    const reservationData = {
      reservation_id: `RES-${uuidv4()}`,
      user_id:userId || null,
      name: body.name.trim(),
      phone: body.phone.trim(),
      date: new Date(body.date),
      time: body.time,
      persons: Number(body.persons),
      status: 'pending' // or 'pending' based on your workflow
    };

    // Check for existing reservations at same time
    const existingReservation = await Reservation.findOne({
      date: reservationData.date,
      time: reservationData.time,
      status: { $ne: 'cancelled' }
    });

    if (existingReservation) {
      return NextResponse.json(
        { err: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Create reservation
    const reservation = await Reservation.create(reservationData);

    return NextResponse.json({
      success: true,
      data: reservation,
      message: "Reservation created successfully"
    }, { status: 201 });

  } catch (err) {
    console.error("Reservation creation error:", err);
    return NextResponse.json(
      { 
        err: err.message || "Server error occurred",
      
      }, 
      { status: 500 }
    );
  }
}