import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const users = await db.collection("users").find().toArray();
  res.status(200).json(users);
}
