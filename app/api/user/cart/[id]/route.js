import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Cart from "@/model/cart"; // ← import the new model
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // adjust path as needed

export async function DELETE(req, context) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: cartId } = await context?.params;

  console.log("id", cartId);
  
  if (!cartId) {
    return NextResponse.json({ error: "Missing cartId" }, { status: 400 });
  }

  try {
    const cart = await Cart.deleteOne({
      _id: cartId,
      userId: session.user._id,
    });

    console.log("cart", cart);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
