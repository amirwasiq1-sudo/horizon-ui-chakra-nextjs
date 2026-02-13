import mongoose from "mongoose";

// ---------------- REVIEW SCHEMA ----------------
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// ---------------- OPTION ITEM ----------------
const optionItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // optional
  },
  { _id: false }
);

// ---------------- OPTION GROUP ----------------
const optionGroupSchema = new mongoose.Schema(
  {
    title: { type: String },
    required: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["single", "multiple"],
      default: "single",
    },
    options: [optionItemSchema],
  },
  { _id: false }
);

// ---------------- PRODUCT SCHEMA ----------------
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    category: { type: String },

    basePrice: { type: Number, required: true },
    hasDiscount: { type: Boolean, default: false },
    discountPrice: { type: Number },

    isVariable: { type: Boolean, default: false },
    optionGroups: [optionGroupSchema],

    showInstructions: { type: Boolean, default: false },

    countInStock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite in Next.js
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
