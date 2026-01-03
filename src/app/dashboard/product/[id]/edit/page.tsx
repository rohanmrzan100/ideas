'use client';

import { fetchProductById, updateProduct } from '@/api/products';
import { BACKEND_URL } from '@/lib/constants';
import { useAppSelector } from '@/store/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import BasicDetails from '@/components/seller/product-form/BasicDetails';
import InventoryVariants from '@/components/seller/product-form/InventoryVariants';
import ProductMedia, { ProductImageState } from '@/components/seller/product-form/ProductMedia';
import { ProductFormValues } from '../../page';
import { Product } from '@/app/data';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const activeShopId = useAppSelector((s) => s.app.activeShopId);
  const queryClient = useQueryClient();

  const [productImages, setProductImages] = useState<ProductImageState[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 1. Fetch Existing Data
  const { data: product, isLoading: isFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
  });

  // 2. Setup Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      display_price: 0,
      product_variants: [],
    },
  });

  // 3. Populate Form when data arrives
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        display_price: product.display_price ? Number(product.display_price) : 0,
        category: 'clothing',
        product_variants: product.product_variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      });

      if (product.productImages) {
        const mappedImages: ProductImageState[] = product.productImages
          .sort((a, b) => a.position - b.position)
          .map((img) => ({
            id: img.id ?? '',
            previewUrl: img.url,
            status: 'success',
            serverData: {
              url: img.url,
              public_id: img.cloudinary_public_id || '',
            },
          }));
        setProductImages(mappedImages);
      }
    }
  }, [product, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      alert('Product Updated Successfully!');
      router.push('/dashboard/my-products');
    },
    onError: (error) => {
      console.error(error);
      alert('Failed to update product');
    },
  });

  // --- Image Handling Logic (Reused) ---
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
          status: 'uploading',
        };
      });
      setProductImages((prev) => [...prev, ...newImageStates]);
    }
  };

  const removeImage = (id: string) => {
    setProductImages((prev) => prev.filter((p) => p.id !== id));
  };

  const onSubmit = (data: ProductFormValues) => {
    const pending = productImages.some((img) => img.status === 'uploading');
    if (pending) {
      alert('Please wait for images to finish uploading.');
      return;
    }

    const finalImages = productImages.map((img, index) => ({
      url: img.serverData!.url,
      cloudinary_public_id: img.serverData!.public_id,
      position: index,
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

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={48} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative bg-white md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[85vh] flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 md:px-8 md:py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur z-20">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
          <p className="hidden md:block text-sm text-gray-500 mt-1">
            Update details for <span className="font-bold">{product?.name}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="hidden md:block px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-full transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-primary/90 rounded-full shadow-md transition flex items-center gap-2"
          >
            {updateMutation.isPending && <Loader2 size={16} className="animate-spin" />}
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

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
