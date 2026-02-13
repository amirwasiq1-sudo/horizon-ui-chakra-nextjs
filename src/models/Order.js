// src/models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    orderItems: [
      {
        name: String,
        qty: Number,
        price: Number,
        variations: [
          {
            group: String,
            options: [String],
          },
        ],
      },
    ],
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isShipped: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    shippingAddress: { address: String },
    notes: { type: String, default: '' },
    isNew: { type: Boolean, default: true }, // ✅ NEW FLAG
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
