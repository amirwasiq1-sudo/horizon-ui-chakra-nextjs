import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
