import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chef from "@/model/chefs";

// PUT: Update an existing chef
export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  try {
    // Separate _id from other fields to update
    const { _id, ...updateBody } = body;

    const updatedChef = await Chef.findByIdAndUpdate(
      context.params.id, // Chef ID from URL params
      updateBody,       // Fields to update
      { new: true }     // Return the updated document
    );

    if (!updatedChef) {
      return NextResponse.json(
        { err: "Chef not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedChef);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE: Remove a chef
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedChef = await Chef.findByIdAndDelete(
      context.params.id // Chef ID from URL params
    );

    if (!deletedChef) {
      return NextResponse.json(
        { err: "Chef not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedChef);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// GET: Fetch a single chef by ID
export async function GET(req, context) {
  await dbConnect();

  try {
    const chef = await Chef.findById(context.params.id);

    if (!chef) {
      return NextResponse.json(
        { err: "Chef not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chef);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}