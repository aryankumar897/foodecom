// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Blog model to interact with the "Blog" collection
import Blog from "@/model/blog";

// ------------------- GET: Fetch all blogs -------------------
export async function GET() {
  await dbConnect();

  try {
    // Fetch all blogs and populate categories (with category name)
    const blogs = await Blog.find({})
      .populate("category_id", "name slug")
      .sort({ createdAt: -1 });

       console.log("all blogs" , blogs) 
    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
