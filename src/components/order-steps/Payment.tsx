'use client';

import { cn } from '@/lib/utils';
import { Banknote, CheckCircle2, LucideIcon, ShieldCheck } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData } from '.';
import { motion } from 'framer-motion';
import { Product } from '@/api/products';
import Image from 'next/image';

type StepPaymentProps = {
  product: Product;
  formData: CheckoutFormData;
  setValue: UseFormSetValue<CheckoutFormData>;
};

export default function Payment({ product, formData, setValue }: StepPaymentProps) {
  const method = formData.paymentMethod;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Payment Method</h2>
        <p className="text-gray-500">Choose how you want to pay.</p>
      </div>

      <div className="grid gap-4">
        {/* Cash on Delivery - Uses Icon */}
        <PaymentOption
          id="COD"
          label="Cash on Delivery"
          icon={Banknote}
          description="Pay in cash when the order arrives."
          isSelected={method === 'COD'}
          onSelect={() => setValue('paymentMethod', 'COD')}
        />

        {/* eSewa - Uses Image */}
        <PaymentOption
          id="ESEWA"
          label="eSewa"
          imageSrc="/esewa.jpg" // Ensure this image exists in your public folder
          description="Pay securely using your eSewa wallet."
          isSelected={method === 'ESEWA'}
          onSelect={() => setValue('paymentMethod', 'ESEWA')}
        />

        {/* Khalti - Uses Image */}
        <PaymentOption
          id="KHALTI"
          label="Khalti"
          imageSrc="/khalti.jpg" // Ensure this image exists in your public folder
          description="Pay securely using your Khalti wallet."
          isSelected={method === 'KHALTI'}
          onSelect={() => setValue('paymentMethod', 'KHALTI')}
        />
      </div>

      <div className="bg-emerald-50/50 p-5 rounded-2xl flex gap-4 items-center border border-emerald-100/50">
        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="text-sm">
          <p className="font-bold text-gray-900">Buyer Protection</p>
          <p className="text-gray-500 leading-tight mt-0.5">
            Your order is eligible for full refund if not delivered as described.
          </p>
        </div>
      </div>
    </div>
  );
}

type PaymentOptionProps = {
  id: 'COD' | 'ESEWA' | 'KHALTI';
  label: string;
  icon?: LucideIcon;
  imageSrc?: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  badge?: string;
};

const PaymentOption = ({
  label,
  icon: Icon,
  imageSrc,
  description,
  isSelected,
  onSelect,
  badge,
}: PaymentOptionProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      'relative w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-4 group focus:outline-none',
      isSelected
        ? 'border-brand bg-brand/5 shadow-md'
        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50',
    )}
  >
    {badge && (
      <span className="absolute -top-3 right-4 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
        {badge}
      </span>
    )}

    <div
      className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 overflow-hidden',
        isSelected
          ? 'bg-brand text-white shadow-brand/20 shadow-lg'
          : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm',
        imageSrc && 'bg-white p-1',
      )}
    >
      {imageSrc ? (
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        Icon && <Icon size={24} />
      )}
    </div>

    <div className="flex-1 pt-0.5">
      <div className="flex justify-between items-center mb-1">
        <h3 className={cn('font-bold text-base', isSelected ? 'text-brand' : 'text-gray-900')}>
          {label}
        </h3>
        {isSelected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-brand">
            <CheckCircle2 size={20} strokeWidth={3} />
          </motion.div>
        )}
      </div>
      <p
        className={cn(
          'text-xs leading-relaxed transition-colors',
          isSelected ? 'text-brand/80' : 'text-gray-500',
        )}
      >
        {description}
      </p>
    </div>
  </button>
);
