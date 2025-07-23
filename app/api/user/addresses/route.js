import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Address from "@/model/addresses";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

// GET: Fetch all addresses
export async function GET() {
  await dbConnect();

  try {
    const addresses = await Address.find({})
      .populate("user_id", "name email") // Optional: customize fields
      .populate("delivery_area_id") // Optional: include delivery area name
      .sort({ createdAt: -1 });


       console.log("addresses=====" ,addresses)
    return NextResponse.json(addresses);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST: Create a new address
export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      delivery_area_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      type,
    } = body;

    console.log("body", body);

    const newAddress = await Address.create({
      user_id: session?.user?._id,
      delivery_area_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      type,
    });

    console.log("newAddress ", newAddress);

    return NextResponse.json(newAddress);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
