import connectDB from "@/lib/connectDB";
import Category from "@/models/category.model";
import { NextResponse } from "next/server";

// delete cat
export async function DELETE(request, context) {
  try {
    await connectDB();
    const id = await context.params.id;
    const category = await Category.findByIdAndDelete(id);
    if (!category || category.length === 0)
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// get cat
export async function GET(request, context) {
  try {
    await connectDB();
    const id = await context.params.id;
    const category = await Category.findById(id);
    if (!category || category.length === 0)
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// update cat
export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { name } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { message: "Both ID and name are required" },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}
