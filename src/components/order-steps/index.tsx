'use client';

import { Product } from '@/app/data';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Carousel from '../Carousel';
import CheckoutFooter from './Footer';
import StepVerification from './Otp';
import Payment from './Payment';
import PersonalInfo from './PersonalInfo';
import ProductInfo from './ProductInfo';
import Stepper from './Stepper';
import { createOrder } from '@/api/order';

export type CheckoutFormData = {
  selectedSize: string;
  selectedColor: string;
  fullName: string;
  phoneNumber: string;
  district: string;
  location: string;
  landmark?: string;
  otp: string;
  paymentMethod: 'COD' | 'QR';
};

const OrderingSteps = ({ product }: { product: Product }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch, setValue, trigger } = useForm<CheckoutFormData>({
    defaultValues: {
      selectedSize: '',
      selectedColor: '',
      paymentMethod: 'COD',
      district: 'Kathmandu',
    },
  });

  const formData = watch();
  const uniqueColors = Array.from(new Set(product.product_variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(product.product_variants.map((v) => v.size)));
  const originalPrice = parseFloat(product.price.toString()) * 1.35; // Fixed type safety

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      if (!formData.selectedSize || !formData.selectedColor) {
        alert('Please select both size and color.');
        return;
      }
      isValid = true;
    }
    if (step === 2) isValid = await trigger(['fullName', 'phoneNumber', 'district', 'location']);
    if (step === 3) isValid = formData.otp.length >= 4; // Simplified OTP check

    if (isValid) {
      setStep((prev) => prev + 1);
      if (window.innerWidth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await createOrder({
        productId: product.id,
        shopId: product.shop_id || '',
        variant: {
          size: data.selectedSize,
          color: data.selectedColor,
        },
        customer: {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          district: data.district,
          location: data.location,
          landmark: data.landmark,
        },
        paymentMethod: data.paymentMethod,
      });

      alert('Order Placed Successfully!');
      // Redirect or show success state
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      <Stepper step={step} />

      {/* --- CONTENT AREA (Split View on Desktop) --- */}
      <div className="flex-1 overflow-hidden relative">
        <div className={`h-full flex flex-col md:grid md:grid-cols-2 transition-all duration-300`}>
          {/* LEFT SIDE: Visuals */}
          <div
            className={`${
              step === 1 ? 'block' : 'hidden md:block'
            } w-full h-[50vh] md:h-full bg-gray-50 relative md:border-r border-gray-100`}
          >
            <Carousel productImages={product.productImages} />
          </div>

          {/* RIGHT SIDE: Interactions / Forms */}
          <div className="flex-1 overflow-y-auto h-full bg-white relative">
            {step === 1 && (
              <ProductInfo
                product={product}
                formData={formData}
                setValue={setValue}
                uniqueSizes={uniqueSizes}
                uniqueColors={uniqueColors}
                originalPrice={originalPrice}
              />
            )}
            {step === 2 && <PersonalInfo register={register} control={control} />}
            {step === 3 && (
              <StepVerification register={register} phoneNumber={formData.phoneNumber} />
            )}
            {step === 4 && <Payment product={product} formData={formData} setValue={setValue} />}
            <div className="h-24"></div>
          </div>
        </div>
      </div>
      <CheckoutFooter
        step={step}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onNext={step < 4 ? handleNext : handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default OrderingSteps;
