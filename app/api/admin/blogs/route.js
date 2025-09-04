// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Blog model to interact with the "Blog" collection
import Blog from "@/model/blog";

// Importing slugify to generate SEO-friendly slugs
import slugify from "slugify";

// ------------------- GET: Fetch all blogs -------------------
export async function GET() {
  await dbConnect();

  try {
    // Fetch all blogs and populate categories (with category name)
    const blogs = await Blog.find({})
      .populate("category_id", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ------------------- POST: Create a new blog -------------------
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const {
    title,
    category_id,
    thumb_image,
    short_description,
    content,

    status,
  } = body;

  try {
    const blog = await Blog.create({
      title,
      slug: slugify(title, { lower: true }),
      category_id,
      thumb_image,
      short_description,
      content,

      status,
    });

      console.log("blog created",  blog)
    return NextResponse.json(blog);
  } catch (err) {


    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
