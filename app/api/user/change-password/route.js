import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await dbConnect();
  console.log("Connected to DB ✅");

  try {
    const token = await getToken({ req });
    console.log("Decoded token:", token);

    if (!token) {
      console.log("❌ No token found. User not authenticated.");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();
    console.log("Request body:", { oldPassword, newPassword });

    // Validate input
    if (!oldPassword || !newPassword) {
      console.log("❌ Validation failed: Missing fields.");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      console.log("❌ Validation failed: Password too short.");
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const user = await User.findById(token.user._id);
    console.log("Fetched user from DB:", user?.email || "User not found");

    if (!user) {
      console.log("❌ User not found in DB.");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    console.log("Old password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Current password is incorrect.");
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("New password hashed successfully");

    // Update password
    user.password = hashedPassword;
    await user.save();
    console.log("✅ Password updated in DB for user:", user.email);

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Password change error:", err);
    return NextResponse.json(
      { error: "An error occurred while changing password" },
      { status: 500 }
    );
  }
}
