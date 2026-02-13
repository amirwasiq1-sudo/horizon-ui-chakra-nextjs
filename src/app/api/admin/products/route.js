import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import Product from '@models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET Products Error:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST Product Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE Product Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
