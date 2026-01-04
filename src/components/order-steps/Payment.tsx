'use client';

import { Product } from '@/app/types';
import { cn } from '@/lib/utils';
import { Banknote, CheckCircle2, LucideIcon, QrCode, ShieldCheck } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData } from '.';
import { motion } from 'framer-motion';

type StepPaymentProps = {
  product: Product;
  formData: CheckoutFormData;
  setValue: UseFormSetValue<CheckoutFormData>;
};

export default function Payment({ product, formData, setValue }: StepPaymentProps) {
  const method = formData.paymentMethod;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Payment Method</h2>
        <p className="text-gray-500">Choose how you want to pay for your order.</p>
      </div>

      <div className="space-y-4">
        <PaymentOption
          id="COD"
          label="Cash on Delivery"
          icon={Banknote}
          description="Pay in cash when the order arrives at your doorstep."
          isSelected={method === 'COD'}
          onSelect={() => setValue('paymentMethod', 'COD')}
        />
        <PaymentOption
          id="QR"
          label="Pay with QR"
          icon={QrCode}
          description="Scan and pay instantly using your favorite banking app."
          isSelected={method === 'QR'}
          onSelect={() => setValue('paymentMethod', 'QR')}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-xl flex gap-3 items-start border border-gray-100">
        <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={20} />
        <div className="text-sm">
          <p className="font-bold text-gray-900">Payment Protection</p>
          <p className="text-gray-500 mt-0.5">
            Your payment information is handled securely. We do not store your card details.
          </p>
        </div>
      </div>
    </div>
  );
}

type PaymentOptionProps = {
  id: 'COD' | 'QR';
  label: string;
  icon: LucideIcon;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
};

const PaymentOption = ({
  id,
  label,
  icon: Icon,
  description,
  isSelected,
  onSelect,
}: PaymentOptionProps) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className={cn(
      'relative w-full p-5 rounded-2xl border-2 text-left transition-colors duration-200 flex items-start gap-4 group',
      isSelected
        ? 'border-brand bg-brand/5 shadow-md'
        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50',
    )}
  >
    <div
      className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
        isSelected ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200',
      )}
    >
      <Icon size={24} />
    </div>

    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h3 className={cn('font-bold text-base', isSelected ? 'text-brand' : 'text-gray-900')}>
          {label}
        </h3>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <CheckCircle2 size={20} className="text-brand" />
          </motion.div>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </motion.button>
);
