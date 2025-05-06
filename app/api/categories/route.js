import connectDB from "@/lib/connectDB";
import Category from "@/models/category.model";
import { tryLoadManifestWithRetries } from "next/dist/server/load-components";
import { NextResponse } from "next/server";

export async function GET(requst) {
  try {
    await connectDB();
    const categories = await Category.find({});

    if (!categories || categories.length === 0)
      return NextResponse.json(
        { message: "No categories found" },
        { status: 404 }
      );

    return NextResponse.json(categories, { status: 201 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name } = await request.json();
    console.log("name", name);

    if (!name)
      return NextResponse.json({ message: "Add a category" }, { status: 400 });
    const existingCategory = await Category.findOne({ name });
    if (existingCategory)
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    const newCategory = await Category.create({ name });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
