// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Category model to interact with the "Category" collection
import Category from "@/model/category";

// PUT method for updating an existing category
export async function PUT(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  // Parsing the incoming request body as JSON
  const body = await req.json();

  try {
    // Destructuring the _id field from the body to separate it from the fields to be updated
    const { _id, ...updateBody } = body;

    // Finding the category by its ID and updating it with the new data
    const updatedCategory = await Category.findByIdAndUpdate(
      context.params.id, // The category ID to update
      updateBody, // The fields to update
      { new: true } // Return the updated document
    );

    // Returning the updated category as a JSON response
    return NextResponse.json(updatedCategory);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE method for deleting a category
export async function DELETE(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the category by its ID and deleting it
    const deletedCategory = await Category.findByIdAndDelete(
      context.params.id // The category ID to delete
    );

    // Returning the deleted category as a JSON response
    return NextResponse.json(deletedCategory);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

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