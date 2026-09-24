const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }, // Cloudinary public_id, for deletion later
  },
  { _id: false }
);

const specSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value == null || value < this.price;
        },
        message: 'Discount price must be lower than the regular price',
      },
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: [imageSchema],
      validate: [(arr) => arr.length > 0, 'At least one product image is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    brand: { type: String, trim: true },
    specs: [specSchema],
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('save', async function generateSlug(next) {
  if (!this.isModified('name')) return next();

  const base = this.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let slug = base;
  let counter = 1;
  const Product = this.constructor;

  while (await Product.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  this.slug = slug;
  next();
});

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);