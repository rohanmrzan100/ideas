import { Product } from '@/app/data';
import { Truck, Banknote, QrCode } from 'lucide-react';
import { CheckoutFormData } from '.';
import { UseFormSetValue } from 'react-hook-form';
import Image from 'next/image';

type StepPaymentProps = {
  product: Product;
  formData: CheckoutFormData;
  setValue: UseFormSetValue<CheckoutFormData>;
};

export default function Payment({ product, formData, setValue }: StepPaymentProps) {
  return (
    <div className="p-6 md:p-10 space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-900">Summary & Pay</h2>

      <div className="bg-white border border-gray-200 shadow-sm rounded-card p-4 flex gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
          <Image
            height="300"
            width="300"
            src={product.productImages[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {formData.selectedSize} • {formData.selectedColor}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="font-bold text-brand">Rs. {product.price}</span>
            <div className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full">
              <Truck size={12} /> FREE
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setValue('paymentMethod', 'COD')}
          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
            formData.paymentMethod === 'COD'
              ? 'border-brand bg-brand/5 text-brand'
              : 'border-gray-100 text-gray-400 hover:border-gray-200'
          }`}
        >
          <Banknote size={24} />
          <span className="font-bold text-sm">Cash on Delivery</span>
        </button>
        <button
          type="button"
          onClick={() => setValue('paymentMethod', 'QR')}
          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
            formData.paymentMethod === 'QR'
              ? 'border-brand bg-brand/5 text-brand'
              : 'border-gray-100 text-gray-400 hover:border-gray-200'
          }`}
        >
          <QrCode size={24} />
          <span className="font-bold text-sm">Pay with QR</span>
        </button>
      </div>
    </div>
  );
}
