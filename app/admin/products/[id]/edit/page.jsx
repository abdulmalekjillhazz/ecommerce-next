'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productApi } from '@/api/productApi';
import Spinner from '@/components/common/Spinner';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '0',
  category: '',
  brand: '',
  isFeatured: false,
  images: [''],
  specs: [{ key: '', value: '' }],
};

function normalizeProduct(product) {
  return {
    name: product.name || '',
    description: product.description || '',
    price: product.price ?? '',
    discountPrice: product.discountPrice ?? '',
    stock: product.stock ?? 0,
    category: product.category || '',
    brand: product.brand || '',
    isFeatured: Boolean(product.isFeatured),
    images: product.images?.length ? product.images.map((image) => image.url) : [''],
    specs: product.specs?.length ? product.specs.map((spec) => ({ key: spec.key, value: spec.value })) : [{ key: '', value: '' }],
  };
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getProductById(id);
        setForm(normalizeProduct(response.data));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load product.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, isEdit]);

  const sellingPrice = useMemo(() => {
    const price = Number(form.price);
    const discount = Number(form.discountPrice);
    if (Number.isFinite(discount) && form.discountPrice !== '' && discount > 0 && discount < price) return discount;
    return price;
  }, [form.price, form.discountPrice]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const updateImage = (index, value) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => imageIndex === index ? value : image),
    }));
  };

  const addImage = () => setForm((current) => ({ ...current, images: [...current.images, ''] }));

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.length === 1 ? [''] : current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const updateSpec = (index, field, value) => {
    setForm((current) => ({
      ...current,
      specs: current.specs.map((spec, specIndex) => specIndex === index ? { ...spec, [field]: value } : spec),
    }));
  };

  const addSpec = () => setForm((current) => ({ ...current, specs: [...current.specs, { key: '', value: '' }] }));

  const removeSpec = (index) => {
    setForm((current) => ({
      ...current,
      specs: current.specs.length === 1 ? [{ key: '', value: '' }] : current.specs.filter((_, specIndex) => specIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const images = form.images.map((url) => url.trim()).filter(Boolean);
    const specs = form.specs
      .map((spec) => ({ key: spec.key.trim(), value: spec.value.trim() }))
      .filter((spec) => spec.key && spec.value);

    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      setError('Name, description and category are required.');
      return;
    }
    if (images.length === 0) {
      setError('Add at least one product image URL.');
      return;
    }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      setError('Enter a valid product price.');
      return;
    }
    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      setError('Stock must be a whole number greater than or equal to 0.');
      return;
    }
    if (form.discountPrice !== '' && (Number(form.discountPrice) < 0 || Number(form.discountPrice) >= Number(form.price))) {
      setError('Discount price must be lower than the regular price.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category.trim(),
      brand: form.brand.trim() || undefined,
      isFeatured: form.isFeatured,
      images: images.map((url) => ({ url })),
      specs,
    };

    if (form.discountPrice !== '') payload.discountPrice = Number(form.discountPrice);

    setIsSaving(true);
    try {
      if (isEdit) {
        await productApi.updateProduct(id, payload);
        setSuccess('Product updated successfully.');
      } else {
        await productApi.createProduct(payload);
        setSuccess('Product created successfully.');
        setForm(EMPTY_FORM);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Unable to save product.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Spinner size="lg" />;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="mt-1 text-sm text-gray-500">Enter the product information that customers will see.</p>
        </div>
        <Link href="/admin/products" className="text-sm font-semibold text-indigo-600 hover:underline">← Back to Products</Link>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Basic information</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Product name *</span>
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} maxLength={150} required className="admin-input" placeholder="e.g. Wireless Headphones" />
            </label>
            <label className="md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Description *</span>
              <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} required rows={5} className="admin-input" placeholder="Describe the product, benefits and important details..." />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Category *</span>
              <input value={form.category} onChange={(e) => updateField('category', e.target.value)} required className="admin-input" placeholder="Electronics" />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Brand</span>
              <input value={form.brand} onChange={(e) => updateField('brand', e.target.value)} className="admin-input" placeholder="Sony" />
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Pricing & inventory</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <label>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Regular price *</span>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} required className="admin-input" placeholder="99.99" />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Discount price</span>
              <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} className="admin-input" placeholder="79.99" />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Stock *</span>
              <input type="number" min="0" step="1" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} required className="admin-input" placeholder="25" />
            </label>
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            Current selling price: <strong className="text-gray-900">{Number.isFinite(sellingPrice) ? `$${sellingPrice.toFixed(2)}` : '—'}</strong>
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm font-medium text-gray-700">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField('isFeatured', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            Show this product as featured
          </label>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Product images</h2>
              <p className="mt-1 text-sm text-gray-500">Paste public image URLs. The first image becomes the main product image.</p>
            </div>
            <button type="button" onClick={addImage} className="rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">+ Add image</button>
          </div>
          <div className="mt-5 space-y-3">
            {form.images.map((url, index) => (
              <div key={`image-${index}`} className="flex gap-2">
                <input value={url} onChange={(e) => updateImage(index, e.target.value)} type="url" className="admin-input flex-1" placeholder="https://example.com/product-image.jpg" />
                <button type="button" onClick={() => removeImage(index)} className="rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
              <p className="mt-1 text-sm text-gray-500">Optional details such as Color, Material, Size, Weight, etc.</p>
            </div>
            <button type="button" onClick={addSpec} className="rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">+ Add spec</button>
          </div>
          <div className="mt-5 space-y-3">
            {form.specs.map((spec, index) => (
              <div key={`spec-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
                <input value={spec.key} onChange={(e) => updateSpec(index, 'key', e.target.value)} className="admin-input" placeholder="Key (e.g. Color)" />
                <input value={spec.value} onChange={(e) => updateSpec(index, 'value', e.target.value)} className="admin-input" placeholder="Value (e.g. Black)" />
                <button type="button" onClick={() => removeSpec(index)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/admin/products" className="rounded-lg border px-5 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</Link>
          <button disabled={isSaving} type="submit" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </section>
  );
}
