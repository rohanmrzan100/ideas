'use client';

import { fetchProductById, ProductImages, updateProduct } from '@/api/products';
import { BACKEND_URL } from '@/lib/constants';
import { useAppSelector } from '@/store/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Components
import BasicDetails from '@/components/seller/product-form/BasicDetails';
import InventoryVariants from '@/components/seller/product-form/InventoryVariants';
import ProductHeader from '@/components/seller/product-form/ProductHeader';
import ProductMedia, { ProductImageState } from '@/components/seller/product-form/ProductMedia';
import { ProductFormValues } from '@/app/dashboard/add-product/page';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeShopId = useAppSelector((s) => s.app.activeShopId);
  const productId = id as string;

  const [productImages, setProductImages] = useState<ProductImageState[]>([]);

  // 1. Fetch Product Data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>();

  // 2. Populate Form when data loads
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        display_price: Number(product.display_price || 0),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product_variants: product.product_variants as any[],
      });

      // Populate Images
      const existingImages: ProductImageState[] = (product.productImages || []).map((img) => ({
        id: img.id || Math.random().toString(),
        previewUrl: img.url,
        status: 'success',
        color: img.color || '',
        serverData: {
          url: img.url,
          public_id: img.cloudinary_public_id,
        },
      }));
      setProductImages(existingImages);
    }
  }, [product, reset]);

  // Derived state for suggestions
  const variants = watch('product_variants') || [];
  const variantColors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  const imageColors = Array.from(
    new Set(productImages.map((img) => img.color).filter((c): c is string => !!c)),
  );

  // --- Image Handlers (Reuse from Add Page logic) ---
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
                serverData: { url: result.data.cloudinaryUrl, public_id: result.data.public_id },
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

  const handleImagesAdded = (files: File[]) => {
    const newImageStates: ProductImageState[] = files.map((file) => {
      const tempId = Math.random().toString(36).substring(7);
      uploadFileToBackend(file, tempId);
      return { id: tempId, file, previewUrl: URL.createObjectURL(file), status: 'uploading' };
    });
    setProductImages((prev) => [...prev, ...newImageStates]);
  };

  const removeImage = (id: string) => {
    setProductImages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAssignColor = (id: string, color: string) => {
    setProductImages((prev) => prev.map((img) => (img.id === id ? { ...img, color: color } : img)));
  };

  // --- Update Mutation ---
  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProductFormValues> & { productImages: ProductImages[] }) =>
      updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      toast.success('Product updated successfully!');
      router.back();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update product');
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    const finalImages = productImages.map((img, index) => ({
      url: img.serverData?.url || img.previewUrl,
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

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={48} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative min-h-screen bg-gray-50/50 flex flex-col"
    >
      <ProductHeader
        isSubmitting={updateMutation.isPending}
        title="Edit Product"
        subtitle="Update your product details"
      />

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <BasicDetails register={register} errors={errors} control={control} watch={watch} />
            <ProductMedia
              images={productImages}
              uploadError={null}
              availableColors={variantColors}
              onImagesAdded={handleImagesAdded}
              onRemoveImage={removeImage}
              onAssignColor={handleAssignColor}
            />
          </div>

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
          </div>
        </div>
      </div>
    </form>
  );
}
