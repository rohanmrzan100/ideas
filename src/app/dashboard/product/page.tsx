'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '@/store/hooks';
import { BACKEND_URL } from '@/lib/constants';
import { CheckCircle2, AlertCircle, Info, Lightbulb, Sparkles } from 'lucide-react';

import BasicDetails from '@/components/seller/product-form/BasicDetails';
import InventoryVariants from '@/components/seller/product-form/InventoryVariants';
import ProductHeader from '@/components/seller/product-form/ProductHeader';
import ProductMedia, { ProductImageState } from '@/components/seller/product-form/ProductMedia';

import { toast } from 'sonner';

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type ProductVariant = {
  size: string;
  color: string;
  stock: number;
};

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  display_price: number;
  category: string;
  product_variants: ProductVariant[];
};

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeShopId = useAppSelector((s) => s.app.activeShopId);
  const [productImages, setProductImages] = useState<ProductImageState[]>([]);

  // Dialog State
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ open: false, type: 'success', title: '', message: '' });

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      display_price: 0,
      product_variants: [{ size: 'Free Size', color: 'Standard', stock: 10 }],
    },
  });

  // Derived state for color suggestions
  const variants = watch('product_variants');
  const variantColors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  const imageColors = Array.from(
    new Set(productImages.map((img) => img.color).filter((c): c is string => !!c)),
  );

  // --- Image Handling Helpers ---
  const uploadFileToBackend = async (file: File, tempId: string) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(BACKEND_URL + '/api/v1/product/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();

      setProductImages((prev) =>
        prev.map((img) =>
          img.id === tempId
            ? {
                ...img,
                status: 'success',
                serverData: {
                  url: result.data.cloudinaryUrl,
                  public_id: result.data.public_id,
                },
              }
            : img,
        ),
      );
    } catch (error) {
      setProductImages((prev) =>
        prev.map((img) => (img.id === tempId ? { ...img, status: 'error' } : img)),
      );
    }
  };

  // UPDATED: Now accepts an array of Files, not an event
  const handleImagesAdded = (files: File[]) => {
    if (productImages.length + files.length > 8) {
      setDialogState({
        open: true,
        type: 'error',
        title: 'Limit Reached',
        message: 'You can only upload up to 8 images per product.',
      });
      return;
    }

    const newImageStates: ProductImageState[] = files.map((file) => {
      const tempId = Math.random().toString(36).substring(7);
      uploadFileToBackend(file, tempId);
      return {
        id: tempId,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'uploading',
      };
    });

    setProductImages((prev) => [...prev, ...newImageStates]);
  };

  const removeImage = (id: string) => {
    setProductImages((prev) => {
      const img = prev.find((p) => p.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleAssignColor = (id: string, color: string) => {
    setProductImages((prev) => prev.map((img) => (img.id === id ? { ...img, color: color } : img)));
  };

  // --- Submission Handler ---
  const onSubmit = async (data: ProductFormValues) => {
    const pending = productImages.some((img) => img.status === 'uploading');
    const failed = productImages.some((img) => img.status === 'error');

    if (pending) {
      setDialogState({
        open: true,
        type: 'error',
        title: 'Upload in Progress',
        message: 'Please wait until all images have finished uploading.',
      });
      return;
    }
    if (failed) {
      setDialogState({
        open: true,
        type: 'error',
        title: 'Upload Failed',
        message: 'Some images failed to upload. Please remove or retry them.',
      });
      toast.info('Please wait for images to finish uploading.');
      return;
    }
    if (productImages.length === 0) {
      setDialogState({
        open: true,
        type: 'error',
        title: 'Missing Images',
        message: 'Please upload at least one image for your product.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const finalImages = productImages.map((img, index) => ({
        url: img.serverData!.url,
        position: index,
        color: img.color || undefined,
      }));

      const payload = {
        ...data,
        shop_id: activeShopId,
        price: Number(data.price),
        display_price: data.display_price ? Number(data.display_price) : undefined,
        productImages: finalImages,
      };

      const response = await fetch(BACKEND_URL + '/api/v1/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Product creation failed');

      setDialogState({
        open: true,
        type: 'success',
        title: 'Product Created!',
        message: 'Your product is now live in your store inventory.',
      });
      // --- Success Actions ---
      toast.success('Product Created Successfully!');

      // Reset
      reset();
      productImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setProductImages([]);
    } catch (error) {
      console.error(error);
      setDialogState({
        open: true,
        type: 'error',
        title: 'Creation Failed',
        message: 'Something went wrong while saving the product. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative min-h-screen bg-gray-50/50 flex flex-col"
    >
      {/* 1. Header (Sticky) */}
      <ProductHeader isSubmitting={isSubmitting} />

      {/* 2. Main Content Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Basic Info & Media */}
          <div className="lg:col-span-7 space-y-8">
            {/* Basic Details */}
            <BasicDetails register={register} errors={errors} control={control} watch={watch} />

            {/* Tip: SEO */}
            <SellerTip
              icon={<Sparkles size={18} />}
              title="Boost Your Reach"
              description='Include keywords like "Cotton", "Oversized", or "Formal" in your title to help customers find your product 3x faster.'
            />

            {/* Media */}
            <ProductMedia
              images={productImages}
              uploadError={null}
              availableColors={variantColors}
              onImagesAdded={handleImagesAdded}
              onRemoveImage={removeImage}
              onAssignColor={handleAssignColor}
            />

            {/* Tip: Color Tagging */}
            <SellerTip
              icon={<Info size={18} />}
              title="Why Tag Colors?"
              description="Tagging colors in images links them to your inventory. When a customer selects 'Red', the preview will automatically show the red photo."
            />
          </div>

          {/* Right Column: Inventory & Variants */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <InventoryVariants
                control={control}
                register={register}
                watch={watch}
                getValues={getValues}
                setValue={setValue}
                suggestedColors={imageColors}
              />
            </div>

            {/* Tip: Bulk Generator */}
            <SellerTip
              icon={<Lightbulb size={18} />}
              title="Pro Tip: Bulk Generator"
              description="Use the generator above to create all Size x Color combinations instantly. You can edit stock for individual variants afterwards."
            />
          </div>
        </div>
      </div>

      {/* 3. Feedback Dialog */}
      <Dialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 \${
                  dialogState.type === 'success'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {dialogState.type === 'success' ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-lg">{dialogState.title}</DialogTitle>
                <DialogDescription className="mt-1">{dialogState.message}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 mt-4">
            <Button
              type="button"
              variant={dialogState.type === 'success' ? 'outline' : 'secondary'}
              onClick={() => setDialogState((prev) => ({ ...prev, open: false }))}
            >
              Close
            </Button>
            {dialogState.type === 'success' && (
              <Button
                type="button"
                onClick={() => {
                  setDialogState((prev) => ({ ...prev, open: false }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Add Another Product
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

function SellerTip({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-4 items-start">
      <div className="bg-white p-2 rounded-full h-fit shadow-sm text-blue-600 shrink-0">{icon}</div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-blue-900">{title}</h4>
        <p className="text-xs text-blue-800/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
