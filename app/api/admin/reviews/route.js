import dbConnect from "@/utils/dbConnect";
import ProductRating from "@/model/productRating";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";





export async function GET(req) {
  try {
   
    await dbConnect();
    
    // Fetch all reviews with user and product details
    const reviews = await ProductRating.find({})
      .populate('user_id', 'name email')
      .populate('product_id', 'name')
      .sort({ createdAt: -1 });


       console.log("reviews" ,reviews)
    
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" }, 
      { status: 500 }
    );
  }
}