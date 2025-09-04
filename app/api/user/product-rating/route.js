// pages/api/review.js
import dbConnect from "@/utils/dbConnect";
import Orders from "@/model/orders";
import OrderItem from "@/model/orderItem";
import ProductRating from "@/model/productRating";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function POST(req, res) {
  console.log("=== REVIEW API ENDPOINT CALLED ===");

  try {
    await dbConnect();
    console.log("Database connected successfully");

    // Parse request body
    const requestBody = await req.json();
    console.log("Request body:", requestBody);

    const { rating, review, product_id } = requestBody;

    // Validate required fields
    if (!rating || !review || !product_id) {
      console.error("Missing required fields:", { rating, review, product_id });
      return NextResponse.json(
        { error: "Rating, review, and product ID are required" },
        { status: 400 }
      );
    }

    console.log("Received data:", { rating, review, product_id });

    // Check authentication
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);

    if (!session || !session.user) {
      console.error("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;
    console.log("User ID from session:", userId);

    // Input validation
    if (!product_id) {
      console.error("Product ID validation failed");
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      console.error("Invalid rating value:", rating);
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!review || review.length > 500) {
      console.error("Review validation failed - length:", review?.length);
      return NextResponse.json(
        { error: "Review is required and must be less than 500 chars" },
        { status: 400 }
      );
    }

    // Step 1: Ensure user purchased product
    console.log("Checking if user purchased the product...");
    const deliveredOrders = await Orders.find({
      user_id: userId,
      order_status: "delivered",
    }).select("_id");

    console.log("Delivered orders found:", deliveredOrders.length);

    if (deliveredOrders.length === 0) {
      console.error("User has no delivered orders");
      return NextResponse.json(
        { error: "Please buy the product before submitting a review!" },
        { status: 403 }
      );
    }

    const orderIds = deliveredOrders.map((o) => o._id);
    console.log("Checking order items for order IDs:", orderIds);

    const hasPurchased = await OrderItem.findOne({
      order_id: { $in: orderIds },
      product_id,
    });

    console.log(
      "Purchase verification result:",
      hasPurchased ? "Purchased" : "Not purchased"
    );

    if (!hasPurchased) {
      console.error("User hasn't purchased this product");
      return NextResponse.json(
        { error: "Please buy the product before submitting a review!" },
        { status: 403 }
      );
    }

    // Step 2: Check for existing review
    console.log("Checking for existing reviews...");
    const existingReview = await ProductRating.findOne({
      user_id: userId,
      product_id,
    });

    let result;
    if (existingReview) {
      console.log("Existing review found, updating...");
      // Update existing review
      result = await ProductRating.findByIdAndUpdate(
        existingReview._id,
        {
          rating,
          review,
          status: 0, // reset to pending on update
        },
        { new: true } // return the updated document
      );
      console.log("Review updated successfully:", result);
    } else {
      console.log("No existing review, creating new one...");
      // Create new review
      result = await ProductRating.create({
        user_id: userId,
        product_id,
        rating,
        review,
        status: 0, // pending approval
      });
      console.log("New review created successfully:", result);
    }

    return NextResponse.json(
      {
        success: true,
        message: existingReview
          ? "Review updated successfully and waiting for approval"
          : "Review added successfully and waiting for approval",
        review: result,
      },
      { status: existingReview ? 200 : 201 }
    );
  } catch (error) {
    console.error("Unexpected error in review API:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  // Check authentication
  const session = await getServerSession(authOptions);
  console.log("Session data:", session);

  if (!session || !session.user) {
    console.error("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user._id;
  console.log("User ID from session:", userId);

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch all reviews for this product
    const reviews = await ProductRating.find({
      product_id,
      user_id: userId,
    })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    console.log("reviews ", reviews);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
