import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";

import nodemailer from "nodemailer";

// Email template function
function createResetEmail(resetCode, resetLink) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 15px;">Password Reset Request</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          You requested a password reset. Here's your verification code:
        </p>
        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
          ${resetCode}
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Or click the button below to reset your password (valid for 10 minutes):
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #777; font-size: 14px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">
          If you didn't request this, please ignore this email or contact support if you have questions.
        </p>
      </div>
    </div>
  `;
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "akumar07092000@gmail.com",
    pass: "mwwxeaohmhmjkboz",
  },
});

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { email } = body;
  console.log({ email });

  try {
    const resetCode = generateVerificationCode();

    // Save verification code to user document in MongoDB
    const user = await User.findOne({ email });

 console.log("user",user)

    if (!user) {
      // Return success message even if user doesn't exist to prevent email enumeration
      return NextResponse.json(
        { message: "If this email exists,xxx a reset link has been sent" },
        { status: 200 }
      );
    }

       if (!user.password) {
      return NextResponse.json(
        { error: "This account uses social login. Please sign in with that method." },
        { status: 400 }
      );
    }
    // Save reset code in the user db
    user.resetCode = {
      data: resetCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes in
    };
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?email=${email}&code=${resetCode}`;

    const mailOptions = {
      to: email, // mail receiver email
      from: "akumar07092000@gmail.com", // mail sending service provider

      subject: "Password Reset Request",

      html: createResetEmail(resetCode, resetLink),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Password reset link sent successfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
