'use client';

import { fetchProductById, Product, updateProduct } from '@/api/products';
import { BACKEND_URL } from '@/lib/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Info, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import BasicDetails from '@/components/seller/product-form/BasicDetails';
import InventoryVariants from '@/components/seller/product-form/InventoryVariants';
import ProductMedia, { ProductImageState } from '@/components/seller/product-form/ProductMedia';
import { toast } from 'sonner';
import { ProductFormValues } from '../../page';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const queryClient = useQueryClient();

  const [productImages, setProductImages] = useState<ProductImageState[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: product, isLoading: isFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
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
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      display_price: 0,
      product_variants: [],
      category: 'clothing',
    },
  });

  // Extract unique colors for the media component
  const variants = watch('product_variants');
  const availableColors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));

  // Derived image colors for suggestions in InventoryVariants
  const imageColors = Array.from(
    new Set(productImages.map((img) => img.color).filter((c): c is string => !!c)),
  );

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
            id: img.id ?? Math.random().toString(36),
            previewUrl: img.url,
            status: 'success',
            color: img.color || '', // Load saved color
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
      toast.success('Product Updated Successfully!');
      router.push('/dashboard/my-products');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update product');
    },
  });

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

  // UPDATED: Now accepts files array
  const handleImagesAdded = (files: File[]) => {
    if (productImages.length + files.length > 8) {
      setUploadError('You can only upload up to 8 images.');
      return;
    }
    setUploadError(null);

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
    setProductImages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAssignColor = (id: string, color: string) => {
    setProductImages((prev) => prev.map((img) => (img.id === id ? { ...img, color: color } : img)));
  };

  const onSubmit = (data: ProductFormValues) => {
    const pending = productImages.some((img) => img.status === 'uploading');
    if (pending) {
      toast.info('Please wait for images to finish uploading.');
      return;
    }

    const finalImages = productImages.map((img, index) => ({
      url: img.serverData!.url,
      position: index,
      color: img.color || undefined,
    }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, ...restData } = data;

    const payload = {
      ...restData,
      price: Number(data.price),
      display_price: data.display_price ? Number(data.display_price) : undefined,
      productImages: finalImages,
      product_variants: data.product_variants.map((variant) => ({
        ...variant,
        stock: Number(variant.stock),
      })),
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
      className="relative min-h-screen bg-gray-50/50 flex flex-col"
    >
      {/* 1. Header (Sticky) */}
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

      {/* 2. Main Content Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Basic Info & Media */}
          <div className="lg:col-span-7 space-y-8">
            <BasicDetails register={register} errors={errors} control={control} watch={watch} />

            <SellerTip
              icon={<Sparkles size={18} />}
              title="Boost Your Reach"
              description='Include keywords like "Cotton", "Oversized", or "Formal" in your title to help customers find your product 3x faster.'
            />

            <ProductMedia
              images={productImages}
              uploadError={uploadError}
              availableColors={availableColors}
              onImagesAdded={handleImagesAdded}
              onRemoveImage={removeImage}
              onAssignColor={handleAssignColor}
            />

            <SellerTip
              icon={<Info size={18} />}
              title="Why Tag Colors?"
              description="Tagging colors in images links them to your inventory. When a customer selects 'Red', the preview will automatically show the red photo."
            />
          </div>

          {/* Right Column: Inventory & Variants (Sticky) */}
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

            <SellerTip
              icon={<Lightbulb size={18} />}
              title="Pro Tip: Bulk Generator"
              description="Use the generator above to create all Size x Color combinations instantly. You can edit stock for individual variants afterwards."
            />
          </div>
        </div>
      </div>
    </form>
  );
}

// --- Shared Helper Component for this page ---
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
