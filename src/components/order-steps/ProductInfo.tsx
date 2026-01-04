import { Check, Info, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData, OrderItem } from '.';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Product } from '@/api/products';
import { useState } from 'react';

type ProductInfoProps = {
  product: Product;
  formData: CheckoutFormData;
  setValue: UseFormSetValue<CheckoutFormData>;
  uniqueSizes: string[];
  uniqueColors: string[];
  originalPrice: number;
  onColorSelect: (color: string) => void; // <--- New prop
};

export default function ProductInfo({
  product,
  formData,
  setValue,
  uniqueSizes,
  uniqueColors,
  originalPrice,
  onColorSelect,
}: ProductInfoProps) {
  const [currentSelection, setCurrentSelection] = useState<OrderItem>({
    color: '',
    size: '',
    quantity: 1,
  });

  const items = formData.items || [];

  const handleAddParams = (key: keyof OrderItem, value: unknown) => {
    setCurrentSelection((prev) => ({ ...prev, [key]: value }));

    // Trigger image switch if color changes
    if (key === 'color') {
      onColorSelect(value as string);
    }
  };

  const addItemToOrder = () => {
    if (!currentSelection.color || !currentSelection.size) return;

    const newItems = [...items, currentSelection];
    setValue('items', newItems);

    setCurrentSelection({ color: '', size: '', quantity: 1 });
    // Optional: Reset image filter? Usually better to keep showing last selection
    // onColorSelect('');
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setValue('items', newItems);
  };

  const isSelectionComplete = currentSelection.color && currentSelection.size;

  return (
    <div className="p-6 md:p-10 space-y-8">
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

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Color</span>
            <span className="text-sm text-gray-500 capitalize">
              {currentSelection.color || 'Select one'}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color) => {
              const isSelected = currentSelection.color === color;
              return (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAddParams('color', color)}
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

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Size</span>
            <span className="text-sm text-brand font-medium underline cursor-pointer flex items-center gap-1">
              Size Guide <Info size={12} />
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {uniqueSizes.map((size) => {
              const isSelected = currentSelection.size === size;
              return (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddParams('size', size)}
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

        <div className="space-y-3">
          <span className="text-sm font-bold text-gray-900">Quantity</span>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const current = currentSelection.quantity;
                  if (current > 1) handleAddParams('quantity', current - 1);
                }}
                className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Minus size={18} />
              </button>
              <div className="w-12 text-center font-bold text-xl text-gray-900">
                {currentSelection.quantity}
              </div>
              <button
                onClick={() => handleAddParams('quantity', currentSelection.quantity + 1)}
                className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              onClick={addItemToOrder}
              disabled={!isSelectionComplete}
              className={cn(
                'flex-1 h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm',
                isSelectionComplete
                  ? 'bg-gray-900 text-white hover:bg-black shadow-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed',
              )}
            >
              <Plus size={16} /> Add to Order
            </button>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart size={14} /> Your Selection ({items.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  key={`${item.color}-${item.size}-${index}`}
                  className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-inner"
                      style={{ backgroundColor: item.color.toLowerCase() }}
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900 capitalize">
                        {item.color} <span className="text-gray-400">/</span> {item.size}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} x Rs. {product.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">Rs. {item.quantity * product.price}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <h3 className="text-xs font-bold text-blue-800 uppercase mb-2">Details</h3>
        <p className="text-sm text-blue-900/80 leading-relaxed line-clamp-4">
          {product.description}
        </p>
      </div>
    </div>
  );
}
