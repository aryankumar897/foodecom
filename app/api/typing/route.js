


import { NextResponse } from "next/server";
import Pusher from "pusher";

export async function POST(request) {
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});



  try {
    const { userId, receiverId } = await request.json();
    await pusher.trigger('chat-channel', 'typing', {
      userId,
      receiverId
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}