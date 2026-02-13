import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().select('-password');

    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, isAdmin, isVerified } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, password required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: !!isAdmin,
      isVerified: !!isVerified,
    });

    return NextResponse.json(
      { message: 'User created', id: newUser._id },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
