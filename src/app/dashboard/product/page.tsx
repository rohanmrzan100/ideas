'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BasicDetails from '@/components/seller/product-form/BasicDetails';
import InventoryVariants from '@/components/seller/product-form/InventoryVariants';
import ProductHeader from '@/components/seller/product-form/ProductHeader';
import ProductMedia, { ProductImageState } from '@/components/seller/product-form/ProductMedia';
import { BACKEND_URL } from '@/lib/constants';

type ProductVariant = {
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

  const [productImages, setProductImages] = useState<ProductImageState[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      display_price: 0,
      product_variants: [{ size: 'M', color: 'Black', stock: 10 }],
    },
  });

  const uploadFileToBackend = async (file: File, tempId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('position', '1');

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
      console.error('Image upload failed:', error);
      setProductImages((prev) =>
        prev.map((img) => (img.id === tempId ? { ...img, status: 'error' } : img)),
      );
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      if (productImages.length + newFiles.length > 4) {
        setUploadError('You can only upload up to 4 images.');
        return;
      }
      setUploadError(null);

      const newImageStates: ProductImageState[] = newFiles.map((file) => {
        const tempId = Math.random().toString(36).substring(7);
        uploadFileToBackend(file, tempId);

        return {
          id: tempId,
          file,
          previewUrl: URL.createObjectURL(file),
          status: 'uploading', // Initial status
        };
      });

      setProductImages((prev) => [...prev, ...newImageStates]);
    }
  };

  const removeImage = (id: string) => {
    setProductImages((prev) => {
      const img = prev.find((p) => p.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    const pending = productImages.some((img) => img.status === 'uploading');
    const failed = productImages.some((img) => img.status === 'error');

    if (pending) {
      alert('Please wait for images to finish uploading.');
      return;
    }
    if (failed) {
      alert('Some images failed to upload. Please remove or retry them.');
      return;
    }
    if (productImages.length === 0) {
      setUploadError('Please upload at least one product image.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Map the uploaded data to the DTO format
      const finalImages = productImages.map((img, index) => ({
        url: img.serverData!.url,
        cloudinary_public_id: img.serverData!.public_id,
        position: index,
      }));

      const payload = {
        ...data,
        shop_id: 'f9906287-ea84-4eaa-949d-a5508bc3af99',
        price: Number(data.price),
        display_price: data.display_price ? Number(data.display_price) : undefined,
        productImages: finalImages,
      };

      console.log({ payload });

      const response = await fetch(BACKEND_URL + '/api/v1/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Image add failed');
      alert('Product Created Successfully!');
    } catch (error) {
      console.error(error);
      setUploadError('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[85vh] flex flex-col"
    >
      <ProductHeader isSubmitting={isSubmitting} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-full bg-[#F9FAFB]">
        <div className="lg:col-span-8 p-6 md:p-8 space-y-8 overflow-y-auto">
          <BasicDetails register={register} errors={errors} control={control} watch={watch} />

          <InventoryVariants
            control={control}
            register={register}
            watch={watch}
            getValues={getValues}
          />
        </div>

        <ProductMedia
          images={productImages}
          uploadError={uploadError}
          onImageSelect={handleImageSelect}
          onRemoveImage={removeImage}
        />
      </div>
    </form>
  );
}
