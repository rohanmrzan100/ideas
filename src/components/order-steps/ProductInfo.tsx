import { Product } from '@/app/data';
import { CheckCircle } from 'lucide-react';
import { CheckoutFormData } from '.';
import { UseFormSetValue } from 'react-hook-form';

type ProductInfoProps = {
  product: Product;
  formData: CheckoutFormData;
  setValue: UseFormSetValue<CheckoutFormData>;
  uniqueSizes: string[];
  uniqueColors: string[];
  originalPrice: number;
};

export default function ProductInfo({
  product,
  formData,
  setValue,
  uniqueSizes,
  uniqueColors,
  originalPrice,
}: ProductInfoProps) {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 leading-tight">{product.name}</h1>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-bold text-brand">Rs. {product.price}</span>
          <span className="text-gray-400 line-through text-lg">Rs. {originalPrice.toFixed(0)}</span>
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Select Size
          </label>
          {formData.selectedSize && (
            <span className="text-sm font-bold text-gray-900 animate-in fade-in">
              {formData.selectedSize}
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {uniqueSizes.map((size) => (
            <button
              key={size}
              onClick={() => setValue('selectedSize', size)}
              className={`h-12 rounded-button font-bold text-sm transition-all border-2 ${
                formData.selectedSize === size
                  ? 'border-brand bg-brand text-white shadow-md'
                  : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Select Color
          </label>
          {formData.selectedColor && (
            <span className="text-sm font-bold text-gray-900 animate-in fade-in">
              {formData.selectedColor}
            </span>
          )}
        </div>
        <div className="flex gap-4">
          {uniqueColors.map((color) => (
            <button
              key={color}
              onClick={() => setValue('selectedColor', color)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                formData.selectedColor === color
                  ? 'ring-2 ring-brand ring-offset-2'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
              aria-label={`Select color ${color}`}
            >
              {formData.selectedColor === color && (
                <CheckCircle className="text-white drop-shadow-md" size={18} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
          Description
        </label>
        <div className="pt-2 text-sm text-gray-600 leading-relaxed">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
