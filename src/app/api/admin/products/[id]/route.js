import { NextResponse } from 'next/server';
import connectDB from '@lib/mongodb';
import Product from '@models/Product';

// ---------------- GET PRODUCT BY ID ----------------
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ⚡ fix here
    if (!id) return NextResponse.json({ message: 'Product ID missing' }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('GET PRODUCT ERROR:', error);
    return NextResponse.json({ message: 'Server error while fetching product' }, { status: 500 });
  }
}

// ---------------- PATCH: UPDATE PRODUCT ----------------
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ⚡ fix here
    const body = await req.json();
    if (!id) return NextResponse.json({ message: 'Product ID missing' }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    // Only update allowed fields
    const allowedFields = [
      'name', 'description', 'category', 'image',
      'basePrice', 'discountPrice', 'countInStock',
      'hasDiscount', 'isActive', 'showInstructions',
      'isVariable', 'optionGroups'
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        if (['basePrice', 'discountPrice', 'countInStock'].includes(field)) {
          product[field] = Number(body[field]);
        } else if (['hasDiscount', 'isActive', 'showInstructions', 'isVariable'].includes(field)) {
          product[field] = Boolean(body[field]);
        } else {
          product[field] = body[field];
        }
      }
    });

    await product.save();
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('PATCH PRODUCT ERROR:', error);
    return NextResponse.json({ message: 'Server error while updating product' }, { status: 500 });
  }
}

// ---------------- DELETE PRODUCT ----------------
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ⚡ fix here
    if (!id) return NextResponse.json({ message: 'Product ID missing' }, { status: 400 });

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error);
    return NextResponse.json({ message: 'Server error while deleting product' }, { status: 500 });
  }
}
