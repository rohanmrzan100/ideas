'use client';

import { fetchProductById } from '@/api/products';
import { useQuery } from '@tanstack/react-query';
import {
  Check,
  Edit,
  Layers,
  Loader2,
  Package,
  Share2,
  Tag,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function PreviewProductPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showSKU, setShowSKU] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="text-gray-400 mx-auto" size={64} />
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const images = product.productImages?.sort((a, b) => a.position - b.position) || [];
  const currentImage = images[activeImageIndex]?.url || product.open_graph_image;

  const price = Number(product.price);
  const displayPrice = Number(product.display_price);
  const hasDiscount = displayPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((displayPrice - price) / displayPrice) * 100)
    : 0;

  const totalStock = product.product_variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
  const lowStockCount =
    product.product_variants?.filter((v) => v.stock > 0 && v.stock < 5).length || 0;
  const outOfStockCount = product.product_variants?.filter((v) => v.stock === 0).length || 0;

  const variantsByColor = product.product_variants?.reduce((acc, variant) => {
    if (!acc[variant.color]) acc[variant.color] = [];
    acc[variant.color].push(variant);
    return acc;
  }, {} as Record<string, typeof product.product_variants>);

  const shopName = product.shop?.name || 'shop';
  const slug = product.name.toLowerCase().replace(/ /g, '-');
  const publicLink = `${window.location.origin}/${shopName
    .toLowerCase()
    .replace(/ /g, '-')}/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Enhanced Header with Back Button */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Products</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={copyLink}
              aria-label="Copy product link"
              title={copied ? 'Link copied' : 'Copy link'}
              className="relative px-6 py-2  justify-center gap-2 hover:bg-gray-50 hover:border-gray-400 text-gray-700  rounded-full shadow-md hover:shadow-lg transition flex items-center  disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Share</span>
                </>
              )}
            </button>

            <Link
              href={`/dashboard/product/${id}/edit`}
              className="px-6 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-primary/90 rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Edit size={16} />
              Edit Product
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Enhanced Image Gallery */}
          <div className="space-y-4">
            <div
              className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-white shadow-xl group cursor-zoom-in"
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  width={500}
                  height={500}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100">
                  <Package size={64} className="mb-3 opacity-40" />
                  <span className="text-sm font-medium">No Image Available</span>
                </div>
              )}

              {hasDiscount && (
                <div className="absolute top-6 left-6 bg-linear-to-r from-red-600 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl animate-pulse">
                  {discountPercent}% OFF
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Enhanced Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === index
                        ? 'border-blue-600 ring-4 ring-blue-100 scale-105'
                        : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      width={500}
                      height={500}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Enhanced Product Details */}
          <div className="space-y-8">
            {/* Title, Price & Stock Status */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Stock Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {totalStock} Units in Stock
                  </span>
                  {lowStockCount > 0 && (
                    <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200">
                      {lowStockCount} Low Stock Variants
                    </span>
                  )}
                  {outOfStockCount > 0 && (
                    <span className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">
                      {outOfStockCount} Out of Stock
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-4 p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <span className="text-5xl font-bold text-blue-600">₹{price.toLocaleString()}</span>
                {hasDiscount && (
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-500 line-through">
                      ₹{displayPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      Save ₹{(displayPrice - price).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Tag size={18} className="text-blue-600" />
                Product Description
              </h3>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Enhanced Inventory Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Layers size={18} className="text-blue-600" />
                  Available Variants
                </h3>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="bg-linear-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200 grid grid-cols-12 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="col-span-4">Color</div>
                  <div className="col-span-8">Available Sizes</div>
                </div>

                {/* Variants */}
                <div className="divide-y divide-gray-100">
                  {Object.entries(variantsByColor).map(([color, variants], idx) => {
                    const variantImage = images.find((img) => img.color === color)?.url;
                    const colorStock = variants.reduce((sum, v) => sum + v.stock, 0);

                    return (
                      <div
                        key={color}
                        className={`grid grid-cols-12 px-6 py-5 items-center transition-colors hover:bg-gray-50 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        {/* Color Column */}
                        <div className="col-span-4 flex items-center gap-3">
                          {variantImage ? (
                            <div className="relative w-14 h-14 rounded-xl border-2 border-gray-200 overflow-hidden shrink-0 shadow-sm">
                              <Image
                                src={variantImage}
                                alt={color}
                                className="w-full h-full object-cover"
                                width={500}
                                height={500}
                              />
                            </div>
                          ) : (
                            <div
                              className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            />
                          )}

                          <div>
                            <span className="text-xs text-gray-500">{colorStock} units</span>
                          </div>
                        </div>

                        {/* Sizes Grid */}
                        <div className="col-span-8 flex flex-wrap gap-2">
                          {variants.map((v) => (
                            <div
                              key={v.id}
                              className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-lg border-2 min-w-17.5 transition-all ${
                                v.stock === 0
                                  ? 'bg-gray-100 border-gray-200 opacity-50'
                                  : v.stock < 5
                                  ? 'bg-amber-50 border-amber-300 hover:shadow-md'
                                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                              }`}
                            >
                              <span className="text-sm font-bold text-gray-900">{v.size}</span>
                              <span
                                className={`text-xs font-semibold mt-0.5 ${
                                  v.stock === 0
                                    ? 'text-gray-400'
                                    : v.stock < 5
                                    ? 'text-amber-600'
                                    : 'text-green-600'
                                }`}
                              >
                                {v.stock === 0 ? 'Out' : `${v.stock} left`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SKU Details Toggle */}
              <div className="mt-4">
                <button
                  onClick={() => setShowSKU(!showSKU)}
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors"
                >
                  <span className={`transition-transform ${showSKU ? 'rotate-90' : ''}`}>▸</span>
                  {showSKU ? 'Hide' : 'Show'} SKU Details
                </button>

                {showSKU && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {product.product_variants.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between text-sm py-2 px-3 bg-white rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {/* Color swatch */}
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: v.color }}
                            title={v.color}
                          />

                          <span className="text-gray-600">
                            {v.color} - Size {v.size}
                          </span>
                        </div>

                        <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {v.sku}
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
