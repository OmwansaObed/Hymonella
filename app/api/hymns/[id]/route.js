import connectDB from "@/lib/connectDB";
import Hymn from "@/models/hymn.model";
import { NextResponse } from "next/server";

// get by id
export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const hymn = await Hymn.findById(id).populate({
      path: "category",
      select: "name",
    });
    if (!hymn || hymn.length === 0)
      return NextResponse.json({ message: "Hymn not found" }, { status: 404 });
    return NextResponse.json(hymn, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// delete by id
export async function DELETE(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const hymn = await Hymn.findByIdAndDelete(id);
    if (!hymn || hymn.length === 0)
      return NextResponse.json({ message: "Hymn not found" }, { status: 404 });
    return NextResponse.json(hymn, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// update hymn
export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    console.log("Request body:", request.body);
    const hymn = await Hymn.findByIdAndUpdate(id, await request.json());
    if (!hymn || hymn.length === 0)
      return NextResponse.json({ message: "Hymn not found" }, { status: 404 });
    return NextResponse.json(hymn, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
