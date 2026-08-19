const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

// POST /api/v1/orders
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, shippingPrice = 0, taxPrice = 0 } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }
  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zip || !shippingAddress.country || !shippingAddress.phone) {
    throw new ApiError(400, 'A complete shipping address is required');
  }

  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      let itemsPrice = 0;
      const verifiedItems = [];

      for (const item of orderItems) {
        if (!item?.product || !mongoose.Types.ObjectId.isValid(item.product)) {
          throw new ApiError(400, 'Each order item must contain a valid product');
        }
        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new ApiError(400, 'Order quantity must be a positive integer');
        }

        // Atomic stock decrement prevents two concurrent orders from overselling.
        const product = await Product.findOneAndUpdate(
          { _id: item.product, isActive: true, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true, session }
        );

        if (!product) {
          const exists = await Product.findById(item.product).session(session);
          if (!exists || !exists.isActive) throw new ApiError(404, `Product not found: ${item.product}`);
          throw new ApiError(400, `Insufficient stock for ${exists.name}`);
        }

        const price = product.discountPrice ?? product.price;
        itemsPrice += price * quantity;
        verifiedItems.push({
          product: product._id,
          name: product.name,
          image: product.images[0]?.url || '',
          price,
          quantity,
        });
      }

      const totalAmount = itemsPrice + Number(shippingPrice || 0) + Number(taxPrice || 0);
      [shippingPrice, taxPrice].forEach((value) => {
        if (Number(value) < 0) throw new ApiError(400, 'Shipping and tax prices cannot be negative');
      });

      [createdOrder] = await Order.create(
        [
          {
            user: req.user._id,
            orderItems: verifiedItems,
            shippingAddress,
            itemsPrice,
            shippingPrice: Number(shippingPrice || 0),
            taxPrice: Number(taxPrice || 0),
            totalAmount,
          },
        ],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  res.status(201).json(new ApiResponse(201, createdOrder, 'Order created'));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const [orders, totalCount] = await Promise.all([
    Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);
  res.status(200).json(new ApiResponse(200, { orders, page, totalPages: Math.ceil(totalCount / limit), totalCount }));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'You do not have access to this order');
  res.status(200).json(new ApiResponse(200, order));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  order.status = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  await order.save();
  res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  res.status(200).json(new ApiResponse(200, null, 'Order deleted'));
});

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, deleteOrder };
