import { Product } from '@/app/types';
import { Check, Info } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData } from '.';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <div className="p-6 md:p-10 space-y-8">
      {/* Title & Price Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-brand">Rs. {product.price}</span>
          {originalPrice > product.price && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-md">
              SAVE {Math.round(((originalPrice - product.price) / originalPrice) * 100)}%
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 line-through">Rs. {originalPrice.toFixed(0)}</p>
      </div>

      <div className="w-full h-px bg-gray-100" />

      {/* Selectors Container */}
      <div className="space-y-6">
        {/* Color Selector */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Color</span>
            <span className="text-sm text-gray-500 capitalize">
              {formData.selectedColor || 'Select one'}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color) => {
              const isSelected = formData.selectedColor === color;
              return (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setValue('selectedColor', color)}
                  className={cn(
                    'group relative w-12 h-12 rounded-full border-2 transition-colors flex items-center justify-center',
                    isSelected ? 'border-brand shadow-md' : 'border-transparent',
                  )}
                >
                  <span
                    className="absolute inset-0.5 rounded-full border border-black/5"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check
                        size={16}
                        className="relative z-10 text-white drop-shadow-md"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Size</span>
            <span className="text-sm text-brand font-medium underline cursor-pointer flex items-center gap-1">
              Size Guide <Info size={12} />
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {uniqueSizes.map((size) => {
              const isSelected = formData.selectedSize === size;
              return (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setValue('selectedSize', size)}
                  className={cn(
                    'py-3 px-2 rounded-xl text-sm font-bold border-2 transition-colors duration-200',
                    isSelected
                      ? 'border-brand bg-brand text-white shadow-lg shadow-brand/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                  )}
                >
                  {size}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description Snippet */}
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <h3 className="text-xs font-bold text-blue-800 uppercase mb-2">Details</h3>
        <p className="text-sm text-blue-900/80 leading-relaxed line-clamp-4">
          {product.description}
        </p>
      </div>
    </div>
  );
}
