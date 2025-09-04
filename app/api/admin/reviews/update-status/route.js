import dbConnect from "@/utils/dbConnect";
import ProductRating from "@/model/productRating";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();

    const { reviewId, status } = await req.json();

    console.log("{ reviewId, status }", { reviewId, status });

    // Update the review status
    const updatedReview = await ProductRating.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Review status updated successfully",
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    return NextResponse.json(
      { error: "Failed to update review status" },
      { status: 500 }
    );
  }
}
