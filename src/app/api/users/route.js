import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // <-- correct path
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const users = await db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email, password, isAdmin, isVerified } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, password required' }, { status: 400 });
    }

    const db = await connectToDatabase();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      isAdmin: !!isAdmin,
      isVerified: !!isVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'User created', id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
  }
}
