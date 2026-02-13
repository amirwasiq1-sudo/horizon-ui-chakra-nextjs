// src/app/api/admin/orders/[id]/route.js
import connectDB from '@lib/mongodb';
import Order from '@models/Order';

export async function GET(req, { params }) {
  const { id } = params;
  try {
    await connectDB();
    const order = await Order.findById(id);

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching single order:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    await connectDB();
    const body = await req.json();

    // ✅ Use $set to update any field including isNew
    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: body }, { new: true });

    if (!updatedOrder) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error updating order:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to update order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
