import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chef from "@/model/chefs";

// GET: Fetch all chefs
export async function GET() {
  await dbConnect();

  try {
    const chefs = await Chef.find({}).sort({ createdAt: -1 });
    return NextResponse.json(chefs);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST: Create a new chef with all fields
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const {
    image,
    name,
    title,
    fb = null,
    in: linkedIn = null, // Renamed to avoid keyword conflict
    x = null,
    web = null,
    show_at_home = false,
    status = true
  } = body;

  try {
    const chef = await Chef.create({
      image,
      name,
      title,
      fb,
      in: linkedIn,
      x,
      web,
      show_at_home,
      status
    });

    return NextResponse.json(chef);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}