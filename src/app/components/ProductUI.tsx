'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '../data';
import Image from 'next/image';

export default function ProductUI({ product }: { product: Product }) {
  // 1. Determine unique options from variants
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));

  // 2. State for selections
  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(uniqueSizes[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 3. Find the specific variant matching current selection
  const activeVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );

  // 4. Handle "Add to Cart" validation
  const isOutOfStock = !activeVariant || activeVariant.stock === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.images[currentImageIndex].url}
            alt={product.name}
            fill
            className="object-cover object-center"
            priority // Important for LCP (Largest Contentful Paint)
          />
        </div>
        <div className="flex gap-4 overflow-auto pb-2">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                currentImageIndex === idx ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image src={img.url} alt={`View ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        {/* Price Section */}
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-gray-900">Rs {product.price}</span>
        </div>

        <div className="mt-6 border-t pt-6">
          <p className="text-gray-600">{product.description}</p>
        </div>

        {/* Variant Selectors */}
        <div className="mt-8 space-y-6">
          {/* Colors */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Color</h3>
            <div className="mt-2 flex gap-3">
              {uniqueColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    // Optional: Switch image to match variant color if variant has specific image
                    const variantImg = product.variants.find((v) => v.color === color)?.image;
                    if (variantImg) {
                      // Logic to find index of this image in main images array could go here
                    }
                  }}
                  className={`px-4 py-2 text-sm border rounded-md ${
                    selectedColor === color
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="mt-2 flex gap-3">
              {uniqueSizes.map((size) => {
                // Check if this size is available for the selected color
                const isAvailable = product.variants.some(
                  (v) => v.color === selectedColor && v.size === size && v.stock > 0,
                );

                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-md ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : !isAvailable
                        ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed decoration-slice'
                        : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            type="button"
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center rounded-md px-8 py-3 text-base font-medium text-white ${
              isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {activeVariant && (
            <p className="mt-2 text-xs text-gray-500 text-center">
              SKU: {activeVariant.sku} | Stock: {activeVariant.stock}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
