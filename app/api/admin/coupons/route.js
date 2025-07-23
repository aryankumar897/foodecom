// app/api/admin/coupons/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Coupon from "@/model/coupon";

// GET: Fetch all coupons
export async function GET() {
  await dbConnect();

  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST: Create a new coupon
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const {
    name,
    code,
    quantity,
    min_purchase_amount = 0,
    expire_date,
    discount_type,
    discount,
    status = true,
  } = body;

  console.log("body coupon", body);

  try {
    // Validate required fields
    if (
      !name ||
      !code ||
      !quantity ||
      !expire_date ||
      !discount_type ||
      !discount
    ) {
      return NextResponse.json(
        { err: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return NextResponse.json(
        { err: "Coupon code already exists" },
        { status: 400 }
      );
    }

    // Validate discount values
    if (discount_type === "percentage" && (discount < 0 || discount > 100)) {
      return NextResponse.json(
        { err: "Percentage discount must be between 0-100" },
        { status: 400 }
      );
    } else if (discount_type === "fixed" && discount < 0) {
      return NextResponse.json(
        { err: "Fixed discount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate expiration date
    if (new Date(expire_date) <= new Date()) {
      return NextResponse.json(
        { err: "Expiration date must be in the future" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      name,
      code: code.toUpperCase().trim(), // Standardize code format
      quantity,
      min_purchase_amount,
      expire_date: new Date(expire_date),
      discount_type,
      discount,
      status,
    });
    console.log("coupon coupon", coupon);
    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
