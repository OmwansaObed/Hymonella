import connectDB from "@/lib/connectDB";
import Hymn from "@/models/hymn.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const hymns = await Hymn.find({}).populate({
      path: "category",
      select: "name",
    });

    if (!hymns || hymns.length === 0) {
      return NextResponse.json(
        { message: "No hymns have been added yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(hymns, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const {
      title,
      lyrics,
      author,
      category,
      audioUrl,
      hymnNumber,
      tags,
      duration,
      language,
      history,
      imageUrl,
    } = await request.json();
    console.log("Request body:", request.body);

    const existingHymn = await Hymn.findOne({ title });

    if (existingHymn)
      return NextResponse.json(
        { message: "Hymn already exists" },
        { status: 400 }
      );

    const newHymn = await Hymn.create({
      title,
      lyrics,
      author,
      category,
      imageUrl,
      audioUrl,
      hymnNumber,
      tags,
      duration,
      language,
      history,
    });
    return NextResponse.json(newHymn, { status: 201 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    console.log("Received ID:", id);

    if (!id) {
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }

    const hymn = await Hymn.findByIdAndDelete(id);

    if (!hymn) {
      return NextResponse.json({ message: "Hymn not found" }, { status: 404 });
    }

    return NextResponse.json(hymn, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
