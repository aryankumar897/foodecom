import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // adjust path as needed

import Wishlist from "@/model/wishlist";

export async function GET(req) {
  await  dbConnect();

  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get wishlist items for the authenticated user with populated product details
    const wishlistItems = await Wishlist.find({
      user_id: session.user._id,
    })
      .populate("product_id")
      .sort({ createdAt: -1 });

    return NextResponse.json(wishlistItems, { status: 200 });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ err: "Product ID is required" });
    }

    // Check if product already exists in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      user_id: session.user._id,
      product_id: productId,
    });

    if (existingWishlistItem) {
      return NextResponse.json({ err: "Product already in wishlist" });
    }

    // Create new wishlist item
    const wishlistItem = new Wishlist({
      user_id: session.user._id,
      product_id: productId,
    });

    await wishlistItem.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cart Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}





export async function DELETE(req) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { product_id } = await req.json();

    if (!product_id) {
      return NextResponse.json(
        { error: "Product ID is required" }, 
        { status: 400 }
      );
    }

    const result = await Wishlist.findOneAndDelete({
      user_id: session.user._id,
      product_id: product_id,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Item not found in wishlist" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product removed from wishlist" }, 
      { status: 200 }
    );
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}