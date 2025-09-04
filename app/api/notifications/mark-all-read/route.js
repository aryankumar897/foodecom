// PUT: Mark all notifications as read
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Notification from "@/model/orderplacednotification";
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true
});



export async function PUT(req) {
  await dbConnect();

  try {
    const result = await Notification.updateMany(
      { seen: false },
      { $set: { seen: true } }
    );


     console.log("result" , result)

    await pusher.trigger('notifications', 'notifications-read', {});

    return NextResponse.json(result);
  } catch (err) {

     console.log("error" , err)
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}