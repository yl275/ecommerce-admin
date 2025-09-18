import Product from "../../../models/Product";
import { connectToDatabase } from "../../../lib/mongoose";
import { isAdmin } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {

    try {
        await isAdmin();
        await connectToDatabase();
        const { id } = await params
        const product = await Product.findById(id); 
        return Response.json({ product }, { status: 200 });  
    } catch (error) {
        return Response.json({ message: 'Error', error }, { status: 500 });
    }
}

export async function PUT(req) {

    // update
    try {
        await isAdmin();
        const { title, description, price, _id, images, category, productProperties } = await req.json();
        await connectToDatabase();
        await Product.findByIdAndUpdate(_id, { title, description, price, images, category, productProperties });
        return Response.json({ message: 'Product updated' }, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Error', error }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await isAdmin();
        const { id } = await params;
        await connectToDatabase();
        await Product.findByIdAndDelete(id);
        return Response.json({ message: 'Product deleted' }, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Error', error }, { status: 500 });
    }
}