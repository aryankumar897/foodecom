// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Category model to interact with the "Category" collection
import Category from "@/model/category";


// GET method for fetching a single category by ID
export async function GET(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the category by its ID
    const category = await Category.findById(context.params.id);

    // If category not found, return 404 error
    if (!category) {
      return NextResponse.json(
        { err: "Category not found" },
        { status: 404 }
      );
    }

    // Returning the found category as a JSON response
    return NextResponse.json(category);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}