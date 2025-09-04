import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chef from "@/model/chefs";

// GET: Fetch all chefs
export async function GET() {
  await dbConnect();

  try {
    // Corrected query - removed .list(5) and added .limit(5) instead
    const chefs = await Chef.find({ show_at_home: true })
      .limit(5) // Limits to 5 results
      .exec(); // Executes the query
    
    return NextResponse.json(chefs);
  } catch (err) {
    console.log("chef error", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}