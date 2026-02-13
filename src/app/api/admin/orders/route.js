// src/app/api/admin/orders/route.js
import connectDB from '@lib/mongodb';
import Order from '@models/Order';

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Fetch all orders, no fallback needed for isNew
    const orders = await Order.find().sort({ createdAt: -1 }); // optional: newest first

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch orders' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
