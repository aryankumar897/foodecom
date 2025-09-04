// import { NextResponse } from 'next/server';

// import dbConnect from "@/utils/dbConnect";
// import Chat from '@/model/chats';
// import { pusherServer } from '@/lib/pusher';

import Pusher from "pusher";

// const pusher = new Pusher({
//   appId: process.env.APP_ID,
//   key: process.env.KEY,
//   secret: process.env.SECRET,
//   cluster: process.env.CLUSTER,
//   useTLS: true,
// });

// export async function GET() {
//   await dbConnect();

//   try {
//     const messages = await Chat.find().sort({ createdAt: 1 });
//     return NextResponse.json(messages);
//   } catch (err) {
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();

//   try {
//     const body = await req.json();
//     const newMessage = await Chat.create(body);

//     // Trigger Pusher event
//     await pusher.trigger('chat-channel', 'new-message', {
//       message: newMessage
//     });

//     return NextResponse.json(newMessage);
//   } catch (err) {
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }

// export async function PUT(req, context) {
//   await dbConnect();

//   try {
//     const { id } = context.params;
//     const body = await req.json();
//     const updatedMessage = await Chat.findByIdAndUpdate(id, body, { new: true });

//     // Trigger update event
//     await pusher.trigger('chat-channel', 'update-message', {
//       message: updatedMessage
//     });

//     return NextResponse.json(updatedMessage);
//   } catch (err) {
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, context) {
//   await dbConnect();

//   try {
//     const { id } = context.params;
//     const deletedMessage = await Chat.findByIdAndDelete(id);

//     // Trigger delete event
//     await pusher.trigger('chat-channel', 'delete-message', {
//       messageId: id
//     });

//     return NextResponse.json(deletedMessage);
//   } catch (err) {
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chats";

// export async function GET(request) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(request.url);
//     const receiver_id = searchParams.get("receiver_id");

//     const messages = await Chat.find({
//       $or: [{ sender_id: receiver_id }, { receiver_id: receiver_id }],
//     }).sort({ createdAt: 1 });

//     return NextResponse.json(messages);
//   } catch (err) {
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }

// export async function GET(request) {
//   await dbConnect();

//   try {
//     const { searchParams } = new URL(request.url);

//      console.log("searchParams " ,searchParams )
//     const user_id = searchParams.get("user_id");
//     const admin_id = searchParams.get("admin_id");

//     console.log("user_id", user_id);
//     console.log("admin_id", admin_id);

//     if (!user_id || !admin_id) {
//       return NextResponse.json(
//         { error: "Both user_id and admin_id are required" },
//         { status: 400 }
//       );
//     }

//     const messages = await Chat.find({
//       $or: [
//         // User sent to admin
//         { sender_id: user_id, receiver_id: admin_id },
//         // Admin sent to user
//         { sender_id: admin_id, receiver_id: user_id },
//       ],
//     }).sort({ createdAt: 1 });

//     return NextResponse.json(messages);
//   } catch (err) {
//     return NextResponse.json({ err: err.message }, { status: 500 });
//   }
// }




export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    
    // Check if this is an admin request (has receiver_id)
    const receiver_id = searchParams.get("receiver_id");
    
    // Check if this is a user request (has user_id and admin_id)
    const user_id = searchParams.get("user_id");
    const admin_id = searchParams.get("admin_id");

    let query = {};

    if (receiver_id) {
      // Admin dashboard request - get all messages with this receiver_id
      query = {
        $or: [
          { sender_id: receiver_id },
          { receiver_id: receiver_id }
        ]
      };
    } else if (user_id && admin_id) {
      // User dashboard request - get conversation between user and admin
      query = {
        $or: [
          { sender_id: user_id, receiver_id: admin_id },
          { sender_id: admin_id, receiver_id: user_id }
        ]
      };
    } else {
      return NextResponse.json(
        { error: "Invalid parameters. Either receiver_id or both user_id and admin_id are required" },
        { status: 400 }
      );
    }

    const messages = await Chat.find(query).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const newMessage = await Chat.create(body);

    // Trigger Pusher event
    const pusher = new Pusher({
      appId: process.env.APP_ID,
      key: process.env.KEY,
      secret: process.env.SECRET,
      cluster: process.env.CLUSTER,
      useTLS: true,
    });

    await pusher.trigger("chat-channel", "new-message", {
      message: newMessage,
    });

    return NextResponse.json(newMessage);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
