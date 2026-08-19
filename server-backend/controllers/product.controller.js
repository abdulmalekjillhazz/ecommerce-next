const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Product = require('../models/Product.model');
const Review = require('../models/Review.model');
const mongoose = require('mongoose');

// GET /api/v1/products?page=&limit=&search=&category=&minPrice=&maxPrice=&sort=
const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 12, 100);
  const { search, category, minPrice, maxPrice, sort, featured } = req.query;

  const filter = { isActive: true };

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (minPrice || maxPrice) {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice && !Number.isFinite(min)) throw new ApiError(400, 'minPrice must be a number');
    if (maxPrice && !Number.isFinite(max)) throw new ApiError(400, 'maxPrice must be a number');
    filter.$or = [
      { discountPrice: { $exists: true, ...(minPrice ? { $gte: min } : {}), ...(maxPrice ? { $lte: max } : {}) } },
      { discountPrice: { $exists: false }, price: { ...(minPrice ? { $gte: min } : {}), ...(maxPrice ? { $lte: max } : {}) } },
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { ratingsAverage: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      products,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    })
  );
});

// GET /api/v1/products/:idOrSlug
const getProductById = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);

  const product = await Product.findOne({
    isActive: true,
    ...(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }),
  });

  if (!product) throw new ApiError(404, 'Product not found');

  res.status(200).json(new ApiResponse(200, product));
});

// POST /api/v1/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    stock,
    images,
    category,
    brand,
    specs,
    isFeatured,
  } = req.body;

  if (!name || !description || price === undefined || stock === undefined || !category) {
    throw new ApiError(400, 'Name, description, price, stock and category are required');
  }

  if (!Array.isArray(images) || images.length === 0 || images.some((image) => !image?.url)) {
    throw new ApiError(400, 'At least one valid product image is required');
  }

  const numericPrice = Number(price);
  const numericStock = Number(stock);
  const numericDiscount = discountPrice === '' || discountPrice == null ? undefined : Number(discountPrice);

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, 'Price must be a valid non-negative number');
  }
  if (!Number.isInteger(numericStock) || numericStock < 0) {
    throw new ApiError(400, 'Stock must be a non-negative whole number');
  }
  if (numericDiscount !== undefined && (!Number.isFinite(numericDiscount) || numericDiscount < 0 || numericDiscount >= numericPrice)) {
    throw new ApiError(400, 'Discount price must be lower than the regular price');
  }

  const product = await Product.create({
    name: name.trim(),
    description: description.trim(),
    price: numericPrice,
    ...(numericDiscount !== undefined ? { discountPrice: numericDiscount } : {}),
    stock: numericStock,
    images: images.map((image) => ({ url: String(image.url).trim(), publicId: image.publicId })),
    category: category.trim(),
    brand: brand?.trim() || undefined,
    specs: Array.isArray(specs)
      ? specs.filter((spec) => spec?.key && spec?.value).map((spec) => ({ key: String(spec.key).trim(), value: String(spec.value).trim() }))
      : [],
    isFeatured: Boolean(isFeatured),
  });

  res.status(201).json(new ApiResponse(201, product, 'Product created'));
});

// PUT /api/v1/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const allowed = ['name', 'description', 'price', 'discountPrice', 'stock', 'images', 'category', 'brand', 'specs', 'isFeatured', 'isActive'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) product[key] = req.body[key];
  }

  if (product.discountPrice != null && product.discountPrice >= product.price) {
    throw new ApiError(400, 'Discount price must be lower than the regular price');
  }
  if (!Array.isArray(product.images) || product.images.length === 0) {
    throw new ApiError(400, 'At least one product image is required');
  }
  if (!Number.isInteger(product.stock) || product.stock < 0) {
    throw new ApiError(400, 'Stock must be a non-negative whole number');
  }

  await product.save();
  res.status(200).json(new ApiResponse(200, product, 'Product updated'));
});

// DELETE /api/v1/products/:id (admin) — soft delete
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');
  res.status(200).json(new ApiResponse(200, null, 'Product deleted'));
});

// POST /api/v1/products/:id/reviews
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
  if (alreadyReviewed) {
    throw new ApiError(409, 'You have already reviewed this product');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  res.status(201).json(new ApiResponse(201, review, 'Review added'));
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
};
