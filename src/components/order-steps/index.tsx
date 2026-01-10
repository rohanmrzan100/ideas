'use client';

import { createOrder } from '@/api/orders';
import { Product } from '@/api/products';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ChevronDown, ChevronUp, Loader2, ShoppingBag } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Carousel from '../Carousel';
import CheckoutFooter from './Footer';
import ProductInfo from './ProductInfo';
import Stepper from './Stepper';

const PersonalInfo = dynamic(() => import('./PersonalInfo'), {
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand" />
    </div>
  ),
});
const StepVerification = dynamic(() => import('./Otp'), {
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand" />
    </div>
  ),
});
const Payment = dynamic(() => import('./Payment'), {
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand" />
    </div>
  ),
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
        // UX IMPROVEMENT: Clearer message
        toast.error('Please add at least one item to your order.');
        return;
      }
      isValid = true;
    }
    if (step === 2) {
      isValid = await trigger(['fullName', 'phoneNumber', 'district', 'location']);
      if (isValid && (!formData.cityId || !formData.zoneId)) {
        // UX IMPROVEMENT: Toast instead of alert
        toast.error('Please select a valid City and Zone from the list');
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
    // Generate a human-readable description for the legacy field
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
        items: data.items, // Pass the array of variants directly
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

  return (
    <div className="flex flex-col h-dvh bg-gray-50 md:bg-white font-sans overflow-hidden">
      <div className="md:hidden bg-white z-30 shadow-sm relative transition-all duration-300">
        <Stepper step={step} steps={checkoutSteps} />
        {step > 1 && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              className="w-full px-6 py-3 flex items-center justify-between bg-gray-50/50"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ShoppingBag size={16} />
                <span>{isMobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
                {isMobileSummaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
              <span className="font-bold text-brand">Rs. {totalPrice}</span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isMobileSummaryOpen ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 flex gap-4">
                <div className="w-16 h-16 rounded-md bg-white border border-gray-200 overflow-hidden relative shrink-0">
                  {product.productImages[0] && (
                    <Image
                      src={product.productImages[0].url}
                      alt="Product"
                      className="object-cover w-full h-full"
                      width={500}
                      height={500}
                    />
                  )}
                  <span className="absolute bottom-0 right-0 bg-brand text-white text-[10px] px-1.5 py-0.5 rounded-tl-md font-bold">
                    {totalQuantity}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                  <div className="text-xs text-gray-500 mt-1 space-y-1">
                    {formData.items?.map((item, idx) => (
                      <p key={idx}>
                        {item.quantity}x {item.color}/{item.size}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="h-full flex flex-col md:grid md:grid-cols-2">
          {/* Left Side: Carousel */}
          <motion.div
            className={`transition-all duration-500 ease-in-out relative bg-gray-100 ${
              step === 1
                ? 'h-[45vh] md:h-full opacity-100'
                : 'h-0 md:h-full md:opacity-100 opacity-0 overflow-hidden'
            }`}
          >
            <Carousel productImages={displayedImages} />
            <div className="md:hidden absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-gray-50 to-transparent pointer-events-none" />
          </motion.div>

          {/* Right Side: Form Content + NEW Stepper Location */}
          <div className="flex-1 overflow-y-auto h-full bg-gray-50 md:bg-white relative">
            <div className="hidden md:block">
              <Stepper step={step} steps={checkoutSteps} />
            </div>

            <div className="min-h-full pb-32 md:pb-24">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <ProductInfo
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
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <PersonalInfo register={register} control={control} setValue={setValue} />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <StepVerification register={register} phoneNumber={formData.phoneNumber} />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Payment product={product} formData={formData} setValue={setValue} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <CheckoutFooter
        step={step}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onNext={step < 4 ? handleNext : handleSubmit(onSubmit)}
        price={totalPrice}
      />
    </div>
  );
};

export default OrderingSteps;
