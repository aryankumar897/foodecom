// app/api/admin/coupons/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Coupon from "@/model/coupon";

// GET: Fetch single coupon by ID
export async function GET(req, context) {
  await dbConnect();

  try {
    const coupon = await Coupon.findById(context.params.id);

    if (!coupon) {
      return NextResponse.json(
        { err: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// PUT: Update existing coupon
export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  try {
    // Validate discount values if they're being updated
    if (body.discount_type && body.discount) {
      if (body.discount_type === "percentage" && (body.discount < 0 || body.discount > 100)) {
        return NextResponse.json(
          { err: "Percentage discount must be between 0-100" },
          { status: 400 }
        );
      } else if (body.discount_type === "fixed" && body.discount < 0) {
        return NextResponse.json(
          { err: "Fixed discount must be a positive number" },
          { status: 400 }
        );
      }
    }

    // Validate expiration date if it's being updated
    if (body.expire_date && new Date(body.expire_date) <= new Date()) {
      return NextResponse.json(
        { err: "Expiration date must be in the future" },
        { status: 400 }
      );
    }

    // Standardize coupon code format if it's being updated
    if (body.code) {
      body.code = body.code.toUpperCase().trim();
      
      // Check for duplicate code (excluding current coupon)
      const existingCoupon = await Coupon.findOne({ 
        code: body.code,
        _id: { $ne: context.params.id }
      });
      
      if (existingCoupon) {
        return NextResponse.json(
          { err: "Coupon code already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      context.params.id,
      body,
      { new: true }
    );

    if (!updatedCoupon) {
      return NextResponse.json(
        { err: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCoupon);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE: Remove coupon
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(context.params.id);

    if (!deletedCoupon) {
      return NextResponse.json(
        { err: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      deletedCoupon
   );
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}