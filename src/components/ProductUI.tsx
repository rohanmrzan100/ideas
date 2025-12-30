'use client';
import { Product } from '@/app/data';
import Carousel from './Carousel';

const ProductInformation = ({ product }: { product: Product }) => {
  const uniqueColors = Array.from(new Set(product.product_variants.map((v) => v.color)));

  const uniqueSizes = Array.from(new Set(product.product_variants.map((v) => v.size)));

  return (
    <div className="flex flex-col gap-4  w-100 border border-gray-200 p-4 rounded-md bg-white shadow-sm">
      <div>
        <Carousel productImages={product.productImages} />
      </div>

      <div className="mt-2">
        <p className=" font-medium text-lg">{product.name}</p>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>

      <h1 className="text-lg font-semibold">Rs. {product.price}</h1>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-700">Sizes</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {uniqueSizes.map((size) => (
              <span key={size} className="px-3 py-1 text-sm border rounded-md">
                {size}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Colors</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {uniqueColors.map((color) => (
              <span key={color} className="px-3 py-1 text-sm border rounded-md">
                {color}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
