import connectDB from "../src/lib/mongodb"; // path from pages/api/test.js

export default async function handler(req, res) {
  await connectDB();
  // Use Mongoose model if you’re using Mongoose
  res.status(200).json({ message: "MongoDB connected" });
}
