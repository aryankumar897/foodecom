import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import User from "@/model/user";
import bcrypt from "bcrypt";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function PUT(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // Parse the incoming request body
  const body = await req.json();

  console.log(" body", body);

  const { name, image } = body;

  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    // Find the user by ID and update their record
    let updatedUser = await User.findByIdAndUpdate(
      session.user._id,
      {
        name,

        image,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    console.log(updatedUser);
    return NextResponse.json(
      { msg: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
