// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Slider model to interact with the "Slider" collection
import Slider from "@/model/slider";

// PUT method for updating an existing slider
export async function PUT(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  // Parsing the incoming request body as JSON
  const body = await req.json();

  try {
    // Destructuring the _id field from the body to separate it from the fields to be updated
    const { _id, ...updateBody } = body; // Excluding _id from the update body, since the _id is used in the query

    // Finding the slider by its ID (from context.params.id) and updating it with the new data (updateBody)
    const updatingSlider = await Slider.findByIdAndUpdate(
      context.params.id, // The slider ID to update, coming from the URL parameters
      updateBody, // The fields to update (without _id)
      { new: true } // Returning the updated document instead of the original one
    );

    // Returning the updated slider as a JSON response
    return NextResponse.json(updatingSlider);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE method for deleting a slider
export async function DELETE(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  console.log("hitting", context.params.id);
  try {
    // Finding the slider by its ID (from context.params.id) and deleting it
    const deletingSlider = await Slider.findByIdAndDelete(
      context.params.id // The slider ID to delete, coming from the URL parameters
    );

    // Returning the deleted slider as a JSON response
    return NextResponse.json(deletingSlider);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}








// GET method for fetching a single slider by ID
export async function GET(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the slider by its ID (from context.params.id)
    const slider = await Slider.findById(
      context.params.id // The slider ID to fetch, coming from the URL parameters
    );

  console.log("gete slider", slider)

    // If slider not found, return 404 error
    if (!slider) {
      return NextResponse.json(
        { err: "Slider not found" },
        { status: 404 }
      );
    }

    // Returning the found slider as a JSON response
    return NextResponse.json(slider);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}