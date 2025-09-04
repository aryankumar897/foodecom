// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Blog model to interact with the "Blog" collection
import Blog from "@/model/blog";

// Importing slugify to generate SEO-friendly slugs
import slugify from "slugify";


// ------------------- PUT: Update a blog by ID -------------------
export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;

    // Update slug if title is changed
    if (updateBody.title) {
      updateBody.slug = slugify(updateBody.title, { lower: true });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      context.params.id, // blog ID
      updateBody,
      { new: true }
    );

    return NextResponse.json(updatedBlog);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ------------------- DELETE: Remove a blog by ID -------------------
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedBlog = await Blog.findByIdAndDelete(context.params.id);

    return NextResponse.json(deletedBlog);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ------------------- GET: Fetch a single blog by ID -------------------
export async function GET(req, context) {
  await dbConnect();

  try {
    const blog = await Blog.findById(context.params.id).populate(
      "category_id",
      "name slug"
    );

    if (!blog) {
      return NextResponse.json({ err: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
