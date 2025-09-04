import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ReservationTime from "@/model/reservationTime";

// GET: Fetch all reservation times
export async function GET() {
  await dbConnect();

  try {
    const times = await ReservationTime.find({}).sort({ createdAt: -1 });
    return NextResponse.json(times);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST: Create a new reservation time slot



export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { start_time, end_time, status = true } = body;

  try {
    // Validate time inputs
    if (!start_time || !end_time) {
      return NextResponse.json(
        { err: "Both start and end times are required" },
        { status: 400 }
      );
    }

    // Convert AM/PM times to Date objects for proper comparison
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      
      hours = parseInt(hours);
      minutes = parseInt(minutes);
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
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

    const timeSlot = await ReservationTime.create({
      start_time,
      end_time,
      status,
    });

    return NextResponse.json(timeSlot);
  } catch (err) {
     console.log("err" ,err)
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}