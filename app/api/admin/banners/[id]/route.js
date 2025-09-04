// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the BannerSlider model to interact with the "BannerSlider" collection
import BannerSlider from "@/model/bannerSlider";

// PUT method for updating an existing banner
export async function PUT(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  // Parsing the incoming request body as JSON
  const body = await req.json();

  try {
    // Destructuring the _id field from the body to separate it from the fields to be updated
    const { _id, ...updateBody } = body;

    // Finding the banner by its ID and updating it with the new data
    const updatedBanner = await BannerSlider.findByIdAndUpdate(
      context.params.id, // The banner ID to update
      updateBody, // The fields to update
      { new: true } // Return the updated document
    );

    // If banner not found, return 404 error
    if (!updatedBanner) {
      return NextResponse.json(
        { err: "Banner not found" },
        { status: 404 }
      );
    }

    // Returning the updated banner as a JSON response
    return NextResponse.json(updatedBanner);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE method for deleting a banner
export async function DELETE(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the banner by its ID and deleting it
    const deletedBanner = await BannerSlider.findByIdAndDelete(
      context.params.id // The banner ID to delete
    );

    // If banner not found, return 404 error
    if (!deletedBanner) {
      return NextResponse.json(
        { err: "Banner not found" },
        { status: 404 }
      );
    }

    // Returning the deleted banner as a JSON response
    return NextResponse.json(deletedBanner);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// GET method for fetching a single banner by ID
export async function GET(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the banner by its ID
    const banner = await BannerSlider.findById(context.params.id);

    // If banner not found, return 404 error
    if (!banner) {
      return NextResponse.json(
        { err: "Banner not found" },
        { status: 404 }
      );
    }

    // Returning the found banner as a JSON response
    return NextResponse.json(banner);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
