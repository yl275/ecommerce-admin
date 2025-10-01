import { connectToDatabase } from "../../lib/mongoose";
import Order from "../../models/Orders";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function GET(request) {
  await isAdmin();
  await connectToDatabase();
  const orders = await Order.find();
  return Response.json({ orders }, { status: 200 });
}
