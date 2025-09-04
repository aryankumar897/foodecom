import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Notification from "@/model/orderplacednotification";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});





// GET: Fetch all notifications
export async function GET(req) {
  await dbConnect();

  try {
    const notifications = await Notification.find({ seen: false })
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json(notifications);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}




// POST: Create a new notification
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  console.log("body", body);

  try {
    const notification = await Notification.create(body);

    // Trigger Pusher event to general channel
    await pusher.trigger("notifications", "new-notification", {
      notification,
    });

    return NextResponse.json(notification);
  } catch (err) {
    console.log("error,", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}



