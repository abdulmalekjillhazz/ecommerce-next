import dbConnect from '@/lib/db';
import Product from '@/models/Product.model';
import { requireUser, requireRole } from '@/lib/api';
import { HttpError, getSearchParams, jsonError, jsonSuccess, parseJson, sanitize } from '@/utils/http';

export async function GET(request) {
  try {
    await dbConnect();
    const query = getSearchParams(request);
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(query.limit, 10) || 12, 100);
    const { search, category, minPrice, maxPrice, sort, featured } = query;
    const filter = { isActive: true };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (minPrice || maxPrice) {
      const min = Number(minPrice); const max = Number(maxPrice);
      if (minPrice && !Number.isFinite(min)) throw new HttpError(400, 'minPrice must be a number');
      if (maxPrice && !Number.isFinite(max)) throw new HttpError(400, 'maxPrice must be a number');
      filter.$or = [
        { discountPrice: { $exists: true, ...(minPrice ? { $gte: min } : {}), ...(maxPrice ? { $lte: max } : {}) } },
        { discountPrice: { $exists: false }, price: { ...(minPrice ? { $gte: min } : {}), ...(maxPrice ? { $lte: max } : {}) } },
      ];
    }
    const sortMap = { newest: { createdAt: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, rating: { ratingsAverage: -1 } };
    const sortOption = sortMap[sort] || sortMap.newest;
    const [products, totalCount] = await Promise.all([Product.find(filter).sort(sortOption).skip((page - 1) * limit).limit(limit), Product.countDocuments(filter)]);
    return jsonSuccess(200, { products, page, totalPages: Math.ceil(totalCount / limit), totalCount });
  } catch (error) { return jsonError(error); }
}

export async function POST(request) {
  try {
    await dbConnect(); const user = await requireUser(request); requireRole(user, 'admin');
    const body = sanitize(await parseJson(request));
    const { name, description, price, discountPrice, stock, images, category, brand, specs, isFeatured } = body;
    if (!name || !description || price === undefined || stock === undefined || !category) throw new HttpError(400, 'Name, description, price, stock and category are required');
    if (!Array.isArray(images) || images.length === 0 || images.some((image) => !image?.url)) throw new HttpError(400, 'At least one valid product image is required');
    const numericPrice = Number(price); const numericStock = Number(stock); const numericDiscount = discountPrice === '' || discountPrice == null ? undefined : Number(discountPrice);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) throw new HttpError(400, 'Price must be a valid non-negative number');
    if (!Number.isInteger(numericStock) || numericStock < 0) throw new HttpError(400, 'Stock must be a non-negative whole number');
    if (numericDiscount !== undefined && (!Number.isFinite(numericDiscount) || numericDiscount < 0 || numericDiscount >= numericPrice)) throw new HttpError(400, 'Discount price must be lower than the regular price');
    const product = await Product.create({ name: name.trim(), description: description.trim(), price: numericPrice, ...(numericDiscount !== undefined ? { discountPrice: numericDiscount } : {}), stock: numericStock, images: images.map((image) => ({ url: String(image.url).trim(), publicId: image.publicId })), category: category.trim(), brand: brand?.trim() || undefined, specs: Array.isArray(specs) ? specs.filter((spec) => spec?.key && spec?.value).map((spec) => ({ key: String(spec.key).trim(), value: String(spec.value).trim() })) : [], isFeatured: Boolean(isFeatured) });
    return jsonSuccess(201, product, 'Product created');
  } catch (error) { return jsonError(error); }
}
