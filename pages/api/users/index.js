import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const db = await connectToDatabase();

  if (req.method === 'GET') {
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const { name, email, password, isAdmin, isVerified } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      isVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json(result);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
