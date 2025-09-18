import mongoose from "mongoose";

let isConnected = false; // global flag

export async function connectToDatabase() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
  });

  isConnected = true;
}
