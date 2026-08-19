import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Product from '@/models/Product.model';
import Review from '@/models/Review.model';
import { requireUser } from '@/lib/api';
import { HttpError, jsonError, jsonSuccess, parseJson, sanitize } from '@/utils/http';

export async function POST(request, { params }) {
  try {
    await dbConnect(); const user = await requireUser(request); const { id } = await params; const body = sanitize(await parseJson(request)); const { rating, comment } = body;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpError(400, 'Invalid product id');
    const numericRating = Number(rating); if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) throw new HttpError(400, 'Rating must be an integer between 1 and 5');
    const product = await Product.findById(id); if (!product) throw new HttpError(404, 'Product not found');
    const existing = await Review.findOne({ product: id, user: user._id }); if (existing) throw new HttpError(409, 'You have already reviewed this product');
    const review = await Review.create({ product: id, user: user._id, rating: numericRating, comment: comment?.trim() || '' });
    const stats = await Review.aggregate([{ $match: { product: new mongoose.Types.ObjectId(id) } }, { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } }]);
    product.ratingsAverage = stats[0]?.average || 0; product.ratingsCount = stats[0]?.count || 0; await product.save();
    return jsonSuccess(201, review, 'Review added');
  } catch (error) { return jsonError(error); }
}
