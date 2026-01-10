import { Product } from '@/api/products';
import { useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData } from '.';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

type ProductInfoProps = {
  product: Product;
  formData: CheckoutFormData;
  setValue: UseFormSetValue<CheckoutFormData>;
  uniqueSizes: string[];
  uniqueColors: string[];
  originalPrice: number;
  onColorSelect: (color: string) => void; // <--- New prop
};

const ProductCardDisplay = ({ product }: ProductInfoProps) => {
  const sortedImages = useMemo(() => {
    return [...product.productImages].sort((a, b) => a.position - b.position);
  }, [product.productImages]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Image Carousel - Remove fixed height constraint */}
      <Carousel className="w-full">
        <CarouselContent>
          {sortedImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={image.url}
                  alt={`${product.name} - ${image.color}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {sortedImages.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Product Info */}
      <div className="space-y-4 px-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
          {product.description && (
            <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
          )}
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Select Size</h3>
          <div className="flex flex-wrap gap-2">{/* Your size buttons here */}</div>
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Select Color</h3>
          <div className="flex flex-wrap gap-2">{/* Your color buttons here */}</div>
        </div>

        {/* Price */}
        <div className="pt-4 border-t">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">Rs. {product.price}</span>
            <span className="text-lg text-gray-500 line-through">
              Rs. 1000
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 pb-8">
          <button
            
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Shipping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDisplay;
