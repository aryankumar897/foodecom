import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/model/chats";
import User from "@/model/user";
import mongoose from "mongoose";

 const ADMIN_USER_ID="6887364b0a4afbb20086f045"
export async function GET() {
  await dbConnect();

  try {
    // Convert admin ID string to ObjectId
    const adminId = new mongoose.Types.ObjectId(ADMIN_USER_ID);

    // Find all unique users who have sent messages to admin
    const chats = await Chat.aggregate([
      {
        $match: {
          receiver_id: adminId
        }
      },
      {
        $lookup: {
          from: "users", // The collection name in MongoDB
          localField: "sender_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user" // Convert the user array to an object
      },
      {
        $group: {
          _id: "$sender_id",
          user: { $first: "$user" }, // Get the user details
          lastMessage: { $last: "$$ROOT" }, // Get the last message
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ["$seen", false] }, 1, 0]
            }
          }
        }
      },
      { 
        $sort: { "lastMessage.createdAt": -1 } // Sort by most recent message
      },
      {
        $project: {
          _id: "$user._id",
          name: "$user.name",
        image: "$user.image",
          lastMessage: {
            message: "$lastMessage.message",
            createdAt: "$lastMessage.createdAt"
          },
          unreadCount: 1
        }
      }
    ]);

    // Create users array and unread counts object
    const users = chats.map(chat => ({
      _id: chat._id,
      name: chat.name,
    image: chat.image,
      lastMessage: chat.lastMessage
    }));

    const unreadCounts = chats.reduce((acc, chat) => {
      acc[chat._id.toString()] = chat.unreadCount;
      return acc;
    }, {});


     console.log("{ users, unreadCounts }" ,{ users, unreadCounts })
    return NextResponse.json({ users, unreadCounts });
  } catch (err) {
    console.error("Error in users-with-messages:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}