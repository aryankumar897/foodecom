import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/model/category";
import slugify from "slugify";

// GET: Fetch all categories
export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// POST: Create a new category with additional fields
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { name, status = true, show_at_home = false } = body;

  try {
    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      status,
      show_at_home,
    });

    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}



























































