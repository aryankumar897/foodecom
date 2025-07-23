import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Coupon from "@/model/coupon";

export async function POST(req) {
  try {
    await dbConnect();

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), status: true });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found or inactive" }, { status: 404 });
    }

    if (coupon.expire_date < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 410 });
    }

    if (coupon.quantity <= coupon.used_count) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 403 });
    }


 console.log({
      success: true,
      discount: coupon.discount,
      discount_type: coupon.discount_type,
      min_purchase_amount: coupon.min_purchase_amount,
    })

    return NextResponse.json({
      success: true,
      discount: coupon.discount,
      discount_type: coupon.discount_type,
      min_purchase_amount: coupon.min_purchase_amount,
    });



  } catch (err) {
    console.log("Coupon apply error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
