import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chats";

export async function POST(req) {
  await dbConnect();

  try {
    const { sender_id, receiver_id } = await req.json();
    
    await Chat.updateMany(
      {
        sender_id,
        receiver_id,
        seen: false
      },
      {
        $set: { seen: true }
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}