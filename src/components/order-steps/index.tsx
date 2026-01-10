'use client';

import { createOrder } from '@/api/orders';
import { Product } from '@/api/products';
import { motion, Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SectionLoader from '../SectionLoader';
import ProductCardDisplay from './ProductCard';
import Stepper from './Stepper';

const PersonalInfo = dynamic(() => import('./PersonalInfo'), {
  loading: () => <SectionLoader />,
});
const StepVerification = dynamic(() => import('./Otp'), {
  loading: () => <SectionLoader />,
});
const Payment = dynamic(() => import('./Payment'), {
  loading: () => <SectionLoader />,
});

export type OrderItem = {
  size: string;
  color: string;
  quantity: number;
};

export type CheckoutFormData = {
  items: OrderItem[];
  fullName: string;
  phoneNumber: string;
  district: string;
  cityId: number;
  zoneId: number;
  location: string;
  landmark?: string;
  otp: string;
  paymentMethod: 'COD' | 'QR';
};

const stepVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const OrderingSteps = ({ product }: { product: Product }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // State for image filtering
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, setValue, trigger } = useForm<CheckoutFormData>({
    defaultValues: {
      items: [],
      paymentMethod: 'COD',
      district: 'Kathmandu',
      cityId: 0,
      zoneId: 0,
    },
  });

  const checkoutSteps = [
    { label: 'Selection' },
    { label: 'Shipping' },
    { label: 'Verify' },
    { label: 'Payment' },
  ];
  const formData = watch();
  const uniqueColors = Array.from(new Set(product.product_variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(product.product_variants.map((v) => v.size)));
  const originalPrice = parseFloat(product.price.toString()) * 1.35;

  const totalQuantity = formData.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice = product.price * totalQuantity;

  // Filter Images based on Active Color
  const displayedImages = useMemo(() => {
    if (!activeColor) return product.productImages;
    // Find images that match the active color
    const colorImages = product.productImages.filter((img) => img.color === activeColor);
    // If no specific images for this color, fall back to all images (or maybe generic ones)
    return colorImages.length > 0 ? colorImages : product.productImages;
  }, [product.productImages, activeColor]);

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      if (!formData.items || formData.items.length === 0) {
        toast.info('Please select both size and color.');
        return;
      }
      isValid = true;
    }
    if (step === 2) {
      isValid = await trigger(['fullName', 'phoneNumber', 'district', 'location']);
      if (isValid && (!formData.cityId || !formData.zoneId)) {
        alert('Please select a valid City and Zone from the list');
        isValid = false;
      }
    }
    if (step === 3) isValid = formData.otp.length >= 4;

    if (isValid) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsSubmitting(true);
    const combinedDescription = data.items
      .map((item) => `${item.quantity}x ${item.color}/${item.size}`)
      .join(', ');

    try {
      await createOrder({
        productId: product.id,
        shopId: product.shop_id || '',
        productName: product.name,
        price: product.price,
        quantity: totalQuantity,
        variant: {
          size: data.items.length === 1 ? data.items[0].size : 'Mixed',
          color: data.items.length === 1 ? data.items[0].color : 'Mixed',
        },
        customDescription: combinedDescription,
        customer: {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          district: data.district,
          cityId: data.cityId,
          zoneId: data.zoneId,
          location: data.location,
          landmark: data.landmark,
        },
        paymentMethod: data.paymentMethod,
      });
      toast.success('Order Placed Successfully!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(product);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Stepper at top */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <Stepper step={step} steps={checkoutSteps} />
      </div>

      {/* Scrollable content area */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ProductCardDisplay
                product={product}
                formData={formData}
                setValue={setValue}
                uniqueSizes={uniqueSizes}
                uniqueColors={uniqueColors}
                originalPrice={originalPrice}
                onColorSelect={setActiveColor}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderingSteps;
