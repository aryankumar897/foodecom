import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/model/blog";
import Category from "@/model/category";

export async function GET(req, context) {
  await dbConnect();
  const { id } = context.params; // slug passed as id

  try {
    // Get the main blog post with category populated
    const post = await Blog.findOne({ slug: id })
      .populate("category_id") // populate category
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get similar posts (from the same category)
    let similarPosts = [];
    if (post.category_id) {
      similarPosts = await Blog.find({
        _id: { $ne: post._id }, // exclude current post
        category_id: post.category_id._id, // match same category
        status: true, // optional: only active posts
      })
        .limit(4)
        .select("title slug thumb_image createdAt") // only required fields
        .lean();
    }

    // Get all categories with counts
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "category_id",
          as: "posts",
        },
      },
      {
        $project: {
          name: 1,
          count: { $size: "$posts" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json(
      {
        post: {
          ...post,
          categories: post.category_id ? [post.category_id] : [],
        },
        similarPosts,
        categories,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
