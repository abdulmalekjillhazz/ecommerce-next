import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Product from '@/models/Product.model';
import { requireUser, requireRole } from '@/lib/api';
import { HttpError, jsonError, jsonSuccess, parseJson, sanitize } from '@/utils/http';

export async function GET(request, { params }) {
  try {
    await dbConnect(); const { id } = await params; const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const product = await Product.findOne({ isActive: true, ...(isObjectId ? { _id: id } : { slug: id }) });
    if (!product) throw new HttpError(404, 'Product not found'); return jsonSuccess(200, product);
  } catch (error) { return jsonError(error); }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect(); const user = await requireUser(request); requireRole(user, 'admin'); const { id } = await params;
    const product = await Product.findById(id); if (!product) throw new HttpError(404, 'Product not found');
    const body = sanitize(await parseJson(request)); const allowed = ['name','description','price','discountPrice','stock','images','category','brand','specs','isFeatured','isActive'];
    for (const key of allowed) if (Object.prototype.hasOwnProperty.call(body, key)) product[key] = body[key];
    if (product.discountPrice != null && product.discountPrice >= product.price) throw new HttpError(400, 'Discount price must be lower than the regular price');
    if (!Array.isArray(product.images) || product.images.length === 0) throw new HttpError(400, 'At least one product image is required');
    if (!Number.isInteger(product.stock) || product.stock < 0) throw new HttpError(400, 'Stock must be a non-negative whole number');
    await product.save(); return jsonSuccess(200, product, 'Product updated');
  } catch (error) { return jsonError(error); }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect(); const user = await requireUser(request); requireRole(user, 'admin'); const { id } = await params;
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true }); if (!product) throw new HttpError(404, 'Product not found'); return jsonSuccess(200, null, 'Product deleted');
  } catch (error) { return jsonError(error); }
}
