// app/api/hymns/related/[id]/route.js

import connectDB from "@/lib/connectDB";
import Hymn from "@/models/hymn.model";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id } = await context.params;

  await connectDB();

  try {
    const hymn = await Hymn.findById(id);
    if (!hymn) {
      return NextResponse.json({ message: "Hymn not found" }, { status: 404 });
    }

    const related = await Hymn.find({
      _id: { $ne: id },
      $or: [{ category: hymn.category }, { tags: { $in: hymn.tags } }],
    })
      .limit(10)
      .lean();

    return NextResponse.json(related, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
