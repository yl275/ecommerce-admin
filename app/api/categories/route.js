import Category from "../../models/Category";
import { connectToDatabase } from "../../lib/mongoose";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await isAdmin();
    await connectToDatabase();
    const { categoryName, parentCategory, properties } = await req.json();
    const categoryDoc = await Category.create({
      name: categoryName,
      parentCategory: parentCategory || null,
      properties: Array.isArray(properties) ? properties : [],
    });
    return Response.json({ categoryDoc }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await isAdmin();
    await connectToDatabase();
    const categories = await Category.find()
      .populate("parentCategory")
      .sort({ updatedAt: -1 });
    return Response.json({ categories }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await isAdmin();
    await connectToDatabase();
    const { categoryName, parentCategory, properties, _id } = await req.json();
    const categoryDoc = await Category.findByIdAndUpdate(
      _id,
      {
        name: categoryName,
        parentCategory: parentCategory || null,
        properties: Array.isArray(properties) ? properties : [],
      },
      { new: true, runValidators: true },
    );
    return Response.json({ categoryDoc }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await isAdmin();
    await connectToDatabase();
    const { _id } = await req.json();
    await Category.findByIdAndDelete(_id);
    return Response.json({ message: "Category deleted" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error", error }, { status: 500 });
  }
}
