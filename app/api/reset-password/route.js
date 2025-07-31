// app/api/reset-password/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();
  
  try {
    const { email, code, newPassword } = await req.json();
    
    // Validate input
    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid reset link" },
        { status: 400 }
      );
    }

    // Debug logging
    console.log("Database resetCode:", user.resetCode);
    console.log("Incoming code:", code);
    console.log("Current time:", new Date());
    console.log("Expires at:", user.resetCode?.expiresAt);

    // Validate reset code
    if (!user.resetCode) {
      return NextResponse.json(
        { error: "No reset code found. Please request a new one." },
        { status: 400 }
      );
    }

    // Compare as strings instead of parsing to number
    if (user.resetCode.data !== code) {
      return NextResponse.json(
        { error: "Invalid reset code. Please check the code and try again." },
        { status: 400 }
      );
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(user.resetCode.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: "Reset code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.resetCode = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "An error occurred while resetting password" },
      { status: 500 }
    );
  }
}