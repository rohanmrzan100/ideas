'use client';

import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData, OrderItem } from '.';
import { cn, findImageForColor } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Product } from '@/api/products';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Separator } from '../ui/separator';

type ProductInfoProps = {
  product: Product;
  formData: CheckoutFormData;
  setValue: UseFormSetValue<CheckoutFormData>;
  uniqueSizes: string[];
  uniqueColors: string[];
  originalPrice: number;
  onColorSelect: (color: string) => void;
  activeImage?: string;
};

export default function ProductInfo({
  product,
  formData,
  setValue,
  uniqueSizes,
  uniqueColors,
  originalPrice,
  onColorSelect,
  activeImage,
}: ProductInfoProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentSelection, setCurrentSelection] = useState<OrderItem>({
    color: uniqueColors.length === 1 ? uniqueColors[0] : '',
    size: '',
    quantity: 1,
  });

  const items = formData.items || [];

  const handleAddParams = (key: keyof OrderItem, value: unknown) => {
    setCurrentSelection((prev) => ({ ...prev, [key]: value }));
    if (key === 'color') onColorSelect(value as string);
  };

  // Sync slider with color selection
  useEffect(() => {
    if (currentSelection.color && mainSwiper) {
      const colorImage = findImageForColor(currentSelection.color, product);
      const imageIndex = product.productImages.findIndex((img) => img.url === colorImage);

      if (imageIndex !== -1) {
        mainSwiper.slideTo(imageIndex);
      }
    }
  }, [currentSelection.color, mainSwiper, product]);

  const isSelectionComplete = Boolean(currentSelection.color) && Boolean(currentSelection.size);

  const totalPrice = product.price * currentSelection.quantity;

  const addItemToOrder = () => {
    if (!isSelectionComplete) return;

    // Check if item with same color and size already exists
    const existingItemIndex = items.findIndex(
      (item) => item.color === currentSelection.color && item.size === currentSelection.size,
    );

    if (existingItemIndex !== -1) {
      // Merge: add quantity to existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + currentSelection.quantity,
      };
      setValue('items', updatedItems);
    } else {
      // Add as new item
      setValue('items', [...items, currentSelection]);
    }

    // Reset selection for next item
    setCurrentSelection({
      color: uniqueColors.length === 1 ? uniqueColors[0] : '',
      size: '',
      quantity: 1,
    });
  };

  const removeItem = (color: string, size: string) => {
    setValue(
      'items',
      items.filter((item) => !(item.color === color && item.size === size)),
    );
  };

  const updateItemQuantity = (color: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedItems = items.map((item) =>
      item.color === color && item.size === size ? { ...item, quantity: newQuantity } : item,
    );
    setValue('items', updatedItems);
  };

  // Consolidate items with same color and size
  const consolidatedItems = Object.values(
    items.reduce((acc, item) => {
      const key = `${item.color}-${item.size}`;
      if (acc[key]) {
        acc[key].quantity += item.quantity;
      } else {
        acc[key] = { ...item };
      }
      return acc;
    }, {} as Record<string, OrderItem>),
  );

  const hasDiscount = product.display_price ?? 0 > product.price;

  return (
    <div className="w-full space-y-8 text-left">
      <div className="block md:hidden w-full mb-6 space-y-2">
        <Swiper
          onSwiper={setMainSwiper}
          modules={[Pagination, Thumbs]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="rounded-l"
        >
          {product.productImages.map((img) => (
            <SwiperSlide key={img.id || img.url}>
              <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                <Image
                  src={img.url}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover rounded-xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={6}
          slidesPerView={7}
          watchSlidesProgress
          className="thumbs-swiper"
        >
          {product.productImages.map((img) => (
            <SwiperSlide key={`thumb-${img.id || img.url}`} className="cursor-pointer">
              <div className="relative w-full aspect-square border border-gray-200 rounded-md overflow-hidden hover:border-brand transition-colors">
                <Image src={img.url} alt={product.name} fill className="object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Accordion type="single" collapsible className="mb-0">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-bold  justify-start items-center ">
            {product.name}
          </AccordionTrigger>
          <AccordionContent>
            This approach works well until you need to customize a component to fit your design
            system or require one that isn&apos;t included in the library. Often, you end up
            wrapping library components, writing workarounds to override styles, or mixing
            components from different libraries with incompatible APIs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-start items-center gap-2">
        <span className="text-3xl font-bold text-blue-600 ">
          Rs {parseInt(product.price.toLocaleString())}
        </span>
        {hasDiscount && product.display_price && (
          <span className="text-xl text-red-500 line-through">
            Rs {parseInt(product.display_price.toLocaleString())}
          </span>
        )}
      </div>
      {/* Variants */}
      <div className="space-y-6">
        {/* Colors */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-900">
            Select Color
          </span>

          <div className="flex flex-wrap gap-4 py-2">
            {uniqueColors.map((color) => {
              const isSelected = currentSelection.color === color;
              return (
                <button
                  key={color}
                  onClick={() => handleAddParams('color', color)}
                  aria-label={`Select color ${color}`}
                  className={cn(
                    'w-8 h-8 rounded-full ring-1 ring-gray-200 flex items-center justify-center transition-all',
                    isSelected
                      ? 'scale-110 ring-2 ring-brand shadow-lg'
                      : 'hover:scale-105 opacity-80',
                  )}
                >
                  <span
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-900">
            Select Size
          </span>
          <div className="flex flex-wrap gap-3">
            {uniqueSizes.map((size) => {
              const isSelected = currentSelection.size === size;
              return (
                <button
                  key={size}
                  onClick={() => handleAddParams('size', size)}
                  className={cn(
                    'min-w-14 h-12 px-4 rounded-xl border-2 text-sm font-bold transition-all',
                    isSelected
                      ? 'border-brand bg-brand text-white shadow-lg scale-105'
                      : 'border-gray-200 text-gray-600 hover:border-brand/50',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Price + Quantity */}
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-6">
        {!isSelectionComplete && (
          <p className="text-xs text-gray-400">Please select both color and size to continue</p>
        )}

        <button
          onClick={addItemToOrder}
          disabled={!isSelectionComplete}
          className={cn(
            'w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform',
            isSelectionComplete
              ? 'bg-brand text-white shadow-lg hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          <ShoppingCart size={20} /> Add to Order
        </button>
      </div>

      {/* Bag */}
      <AnimatePresence>
        {consolidatedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 rounded-2xl p-4 space-y-3 border"
          >
            <div className="flex justify-between items-center text-xs uppercase font-bold">
              <span className="text-gray-400">Your Bag ({consolidatedItems.length})</span>
              <div className="text-brand text-right">
                <div>Ready for checkout</div>
                <div className="text-lg font-black normal-case">
                  Rs.{' '}
                  {consolidatedItems.reduce((sum, item) => sum + item.quantity * product.price, 0)}
                </div>
                <div className="text-[10px] font-normal normal-case text-gray-500">
                  {consolidatedItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </div>
              </div>
            </div>

            {consolidatedItems.map((item) => (
              <motion.div
                key={`${item.color}-${item.size}`}
                layout
                className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={findImageForColor(item.color, product)}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-sm">Size: {item.size}</p>
                    <p className="text-xs text-gray-400">Rs. {item.quantity * product.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-50 rounded-lg border">
                    <button
                      onClick={() => updateItemQuantity(item.color, item.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.color, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeItem(item.color, item.size)}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
