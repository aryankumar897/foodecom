import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ReservationTime from "@/model/reservationTime";

// PUT: Update an existing reservation time slot
export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  console.log("  update body", body);

  try {
    const { _id, start_time, end_time, ...updateBody } = body;

    // Convert AM/PM times to Date objects for proper comparison
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);
      minutes = parseInt(minutes);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return new Date(2000, 0, 1, hours, minutes);
    };

    const startDate = parseTime(start_time);
    const endDate = parseTime(end_time);

    // Check if start time is before end time
    if (startDate >= endDate) {
      return NextResponse.json(
        { err: "End time must be after start time" },
        { status: 400 }
      );
    }

    const updatedTime = await ReservationTime.findByIdAndUpdate(
      context.params.id,
      { start_time, end_time, ...updateBody },
      { new: true }
    );


     console.log("updatedTime " ,updatedTime )
    return NextResponse.json(updatedTime);
  } catch (err) {
    console.log("eeror updating", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE: Remove a reservation time slot
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedTime = await ReservationTime.findByIdAndDelete(
      context.params.id
    );

    if (!deletedTime) {
      return NextResponse.json(
        { err: "Reservation time not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedTime);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// GET: Fetch a single reservation time by ID
export async function GET(req, context) {
  await dbConnect();

  try {
    const timeSlot = await ReservationTime.findById(context.params.id);

    if (!timeSlot) {
      return NextResponse.json(
        { err: "Reservation time not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(timeSlot);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
