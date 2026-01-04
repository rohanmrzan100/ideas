'use client';

import { fetchProductById } from '@/api/products';
import { useQuery } from '@tanstack/react-query';
import { Check, Edit, Layers, Loader2, Package, Share2, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function PreviewProductPage() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={48} />
      </div>
    );
  }

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  // --- Derived Data Calculations ---
  const images = product.productImages?.sort((a, b) => a.position - b.position) || [];
  const currentImage = images[activeImageIndex]?.url || product.open_graph_image;

  const price = Number(product.price);
  const displayPrice = Number(product.display_price);
  const hasDiscount = displayPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((displayPrice - price) / displayPrice) * 100)
    : 0;

  const totalStock = product.product_variants?.reduce((acc, v) => acc + v.stock, 0) || 0;

  // Group Variants by Color for cleaner display
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
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* --- Header Navigation --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 justify-end  w-full">
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
            {copied ? 'Copied!' : 'Share'}
          </button>

          <Link
            href={`/dashboard/product/${id}/edit`}
            className="px-4 py-2 bg-brand text-white border border-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Edit size={16} /> Edit Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT: Image Gallery --- */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm group">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                <Package size={48} className="mb-2 opacity-50" />
                <span className="text-sm font-medium">No Image Available</span>
              </div>
            )}

            {/* Discount Badge on Image */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {discountPercent}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index
                      ? 'border-brand ring-2 ring-brand/20'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT: Product Details --- */}
        <div className="lg:col-span-7 space-y-8">
          {/* Title & Price */}
          <div className="pb-6 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-4xl font-bold text-brand">Rs. {price.toLocaleString()}</span>
              {hasDiscount && (
                <div className="flex flex-col leading-none">
                  <span className="text-lg text-gray-400 line-through">
                    Rs. {displayPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-red-500">
                    Save Rs. {(displayPrice - price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Tag size={16} /> Description
            </h3>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description || 'No description provided.'}
            </div>
          </div>

          {/* Inventory & Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Layers size={16} /> Inventory Overview
              </h3>
              <span className="bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full border border-brand/20">
                Total Stock: {totalStock}
              </span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Header for Variants Table-like structure */}
              <div className="bg-gray-100/50 px-5 py-3 border-b border-gray-200 grid grid-cols-12 text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-3">Color</div>
                <div className="col-span-9">Sizes & Stock</div>
              </div>

              <div className="divide-y divide-gray-100">
                {Object.entries(variantsByColor).map(([color, variants]) => (
                  <div key={color} className="grid grid-cols-12 px-5 py-4 items-center bg-white">
                    {/* Color Column */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                      {/* FIX: Hide text if it looks like a hex code */}
                      {!color.startsWith('#') && (
                        <span className="font-semibold text-gray-900 text-sm">{color}</span>
                      )}
                    </div>

                    {/* Sizes Grid */}
                    <div className="col-span-9 grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {variants.map((v) => (
                        <div
                          key={v.id}
                          className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 bg-gray-50/50"
                        >
                          <span className="text-xs font-bold text-gray-700">Size {v.size}</span>
                          <span
                            className={`text-[10px] font-mono mt-1 ${
                              v.stock < 3 ? 'text-red-600 font-bold' : 'text-gray-500'
                            }`}
                          >
                            {v.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <details className="group text-sm">
                <summary className="cursor-pointer text-gray-500 hover:text-brand font-medium flex items-center gap-2 select-none">
                  <span className="group-open:rotate-90 transition-transform">▸</span> View SKU
                  Details
                </summary>
                <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-1">
                  {product.product_variants.map((v) => (
                    <div key={v.id} className="text-xs text-gray-500 grid grid-cols-2 max-w-md">
                      <span>{v.sku}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
