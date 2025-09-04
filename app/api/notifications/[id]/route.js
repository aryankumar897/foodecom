// PUT: Mark single notification as read


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



export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  console.log("id", id);
  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { seen: true } },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Trigger Pusher event to update UI
    await pusher.trigger("notifications", "notification-read", {
      notificationId: id,
    });

    return NextResponse.json(notification);
  } catch (err) {
    console.log("find by id and update", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
