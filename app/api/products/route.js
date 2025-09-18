import Product from "../../models/Product";
import { connectToDatabase } from "../../lib/mongoose";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function POST(req) {

    try {
        await isAdmin();
        const data = await req.json();
        await connectToDatabase();
        const productDoc = await Product.create(data);
        return Response.json({ message: 'Product created', productDoc }, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Error', error }, { status: 500 });
    }
    
} 

export async function GET(req) {
    try {
        await isAdmin();
        await connectToDatabase();
        const products = await Product.find(); 
        return Response.json({ products }, { status: 200 });  
    } catch (error) {
        return Response.json({ message: 'Error', error }, { status: 500 });
    }
}