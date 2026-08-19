const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

const sanitizeQuantity = (value) => {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(400, 'Cart quantity must be a positive integer');
  }
  return quantity;
};

const normalizeItems = async (items = []) => {
  if (!Array.isArray(items)) throw new ApiError(400, 'items must be an array');

  const unique = new Map();
  for (const item of items) {
    if (!item?.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
      throw new ApiError(400, 'Each cart item must contain a valid productId');
    }

    const productId = item.productId.toString();
    const quantity = sanitizeQuantity(item.quantity);
    unique.set(productId, Math.max(unique.get(productId) || 0, quantity));
  }

  if (unique.size === 0) return [];

  const products = await Product.find({
    _id: { $in: [...unique.keys()] },
    isActive: true,
  });
  const byId = new Map(products.map((product) => [product._id.toString(), product]));

  return [...unique.entries()]
    .map(([productId, requestedQuantity]) => {
      const product = byId.get(productId);
      if (!product || product.stock < 1) return null;

      return {
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.discountPrice ?? product.price,
        quantity: Math.min(requestedQuantity, product.stock),
        stock: product.stock,
      };
    })
    .filter(Boolean);
};

const getOrCreateCart = async (userId) =>
  Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { new: true, upsert: true }
  );

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.status(200).json(new ApiResponse(200, cart));
});

const syncCart = asyncHandler(async (req, res) => {
  const items = await normalizeItems(req.body.items);
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, cart, 'Cart synced'));
});

const mergeGuestCart = asyncHandler(async (req, res) => {
  const guestItems = await normalizeItems(req.body.guestCartItems || []);
  const cart = await getOrCreateCart(req.user._id);

  const merged = new Map(cart.items.map((item) => [item.product.toString(), item.quantity]));
  for (const item of guestItems) {
    const id = item.product.toString();
    merged.set(id, (merged.get(id) || 0) + item.quantity);
  }

  const mergedPayload = [...merged.entries()].map(([productId, quantity]) => ({ productId, quantity }));
  const items = await normalizeItems(mergedPayload);

  cart.items = items;
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, 'Guest cart merged'));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, 'Cart cleared'));
});

module.exports = { getCart, syncCart, mergeGuestCart, clearCart };
