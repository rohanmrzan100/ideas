'use client';

import { createOrder } from '@/api/orders';
import { Product } from '@/api/products';
import { findImageForColor } from '@/lib/utils';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ChevronDown, ChevronUp, Loader2, ShoppingBag } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Carousel from '../Carousel';
import CheckoutFooter from './Footer';
import ProductInfo from './ProductInfo';
import Stepper from './Stepper';

const PersonalInfo = dynamic(() => import('./PersonalInfo'), {
  loading: () => <StepLoader />,
});
const StepVerification = dynamic(() => import('./Otp'), {
  loading: () => <StepLoader />,
});
const Payment = dynamic(() => import('./Payment'), {
  loading: () => <StepLoader />,
});

const StepLoader = () => (
  <div className="h-64 flex items-center justify-center">
    <Loader2 className="animate-spin text-brand" aria-label="Loading step" />
  </div>
);

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
  paymentMethod: 'COD' | 'ESEWA' | 'KHALTI';
};

const stepVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const OrderingSteps = ({ product }: { product: Product }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      items: [],
      paymentMethod: 'COD',
      district: 'Kathmandu',
      cityId: 0,
      zoneId: 0,
    },
    mode: 'onChange',
  });

  const checkoutSteps = [
    { label: 'Select' },
    { label: 'Ship' },
    { label: 'Verify' },
    { label: 'Pay' },
  ];

  const formData = watch();
  const uniqueColors = Array.from(new Set(product.product_variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(product.product_variants.map((v) => v.size)));
  const originalPrice = parseFloat(product.price.toString()) * 1.35;

  const totalQuantity = formData.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice = product.price * totalQuantity;

  const displayedImages = useMemo(() => {
    if (!activeColor) return product.productImages;
    const colorImages = product.productImages.filter((img) => img.color === activeColor);
    return colorImages.length > 0 ? colorImages : product.productImages;
  }, [product.productImages, activeColor]);

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      if (!formData.items || formData.items.length === 0) {
        toast.error('Please add at least one item to your order.');
        return;
      }
      isValid = true;
    }
    if (step === 2) {
      isValid = await trigger(['fullName', 'phoneNumber', 'district', 'location']);
      if (isValid && (!formData.cityId || !formData.zoneId)) {
        toast.error('Please select a valid City and Zone.');
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
        items: data.items,
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
      router.push('/order-success');
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to place order. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mobileCardClass =
    'bg-white w-full rounded-t-[2rem] md:rounded-none shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-none pt-8 px-6 md:p-0 min-h-[60vh] focus:outline-none';

  return (
    <div
      className="flex flex-col h-dvh bg-gray-50 md:bg-white font-sans overflow-hidden"
      role="main"
      aria-label="Checkout Process"
    >
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white/90 backdrop-blur-md z-30 sticky top-0 border-b border-gray-100">
        <Stepper step={step} steps={checkoutSteps} />

        {step > 1 && totalQuantity > 0 && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              className="w-full px-6 py-3 flex items-center justify-between text-xs font-medium text-gray-600 active:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20"
              aria-expanded={isMobileSummaryOpen}
              aria-controls="mobile-summary"
            >
              <div className="flex items-center gap-2">
                <div className="bg-brand/10 p-1.5 rounded-full text-brand">
                  <ShoppingBag size={14} />
                </div>
                <span>
                  {isMobileSummaryOpen ? 'Hide' : 'Show'} Order Summary ({totalQuantity} items)
                </span>
                {isMobileSummaryOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </div>
              <span className="font-bold text-gray-900">Rs. {totalPrice}</span>
            </button>

            <AnimatePresence>
              {isMobileSummaryOpen && (
                <motion.div
                  id="mobile-summary"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50"
                >
                  <div className="p-4 flex flex-col gap-4">
                    {formData.items.map((item, idx) => (
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
                            <p className="text-xs text-gray-400">
                              Rs. {item.quantity * product.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-gray-50 rounded-lg border">
                            <span className="w-8 text-center font-bold text-sm">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative flex">
        {/* Desktop Carousel */}
        <motion.div
          className={`transition-all duration-500 ease-in-out relative bg-gray-50 ${
            step === 1 ? 'block h-auto md:h-full md:w-1/2' : 'hidden md:block md:w-1/2'
          }`}
        >
          <Carousel productImages={displayedImages} />
        </motion.div>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto h-full bg-transparent md:bg-white relative scroll-smooth w-full md:w-1/2">
          <div className="hidden md:block">
            <Stepper step={step} steps={checkoutSteps} />
          </div>

          <div className="pb-32 md:pb-24 pt-4 md:pt-10 w-full max-w-xl mx-auto md:max-w-none">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="px-4 md:px-10"
                >
                  <ProductInfo
                    product={product}
                    formData={formData}
                    setValue={setValue}
                    uniqueSizes={uniqueSizes}
                    uniqueColors={uniqueColors}
                    originalPrice={originalPrice}
                    onColorSelect={setActiveColor}
                    activeImage={displayedImages[0]?.url}
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
                  className={mobileCardClass}
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
                  className={mobileCardClass}
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
                  className={mobileCardClass}
                >
                  <Payment product={product} formData={formData} setValue={setValue} />
                </motion.div>
              )}
            </AnimatePresence>
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
