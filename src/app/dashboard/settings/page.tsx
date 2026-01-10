'use client';

import { fetchMyShops, Shop, updateShop, uploadShopLogo } from '@/api/shop';
import { ImageCropper } from '@/components/ImageCropper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppSelector } from '@/store/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2, Save, Store, Truck } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ShopFormValues = {
  name: string;
  category: string;
  pathao_store_id?: string;
  create_delivery_on_order: boolean;
};

const CATEGORIES = [
  'Clothing & Apparel',
  'Electronics',
  'Home & Decor',
  'Beauty & Personal Care',
  'Food & Beverage',
  'Others',
];

export default function SettingsPage() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId);
  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['my-shops'],
    queryFn: fetchMyShops,
  });

  const activeShop: Shop = shops.find((s: Shop) => s.id === activeShopId);

  // Wait for activeShop to load before rendering the form
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!activeShop) {
    return <div className="p-8 text-center text-gray-500">Select a shop to manage settings</div>;
  }

  return <SettingsContent activeShop={activeShop} />;
}

function SettingsContent({ activeShop }: { activeShop: Shop }) {
  const queryClient = useQueryClient();
  const [logoPreview, setLogoPreview] = useState<string | null>(activeShop.logo || null);
  const [cropImage, setCropImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<ShopFormValues>({
    defaultValues: {
      name: activeShop.name,
      category: activeShop.category || 'Clothing & Apparel',
      pathao_store_id: activeShop.pathao_store_id || '',
      create_delivery_on_order: false,
    },
  });

  useEffect(() => {
    reset({
      name: activeShop.name,
      category: activeShop.category || 'Clothing & Apparel',
      pathao_store_id: activeShop.pathao_store_id || '',
    });
    setLogoPreview(activeShop.logo || null);
  }, [activeShop.id, reset]); // Use activeShop.id as dependency

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Shop>) => updateShop(activeShop.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shops'] });
      toast.success('Shop settings updated!');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: uploadShopLogo,
    onSuccess: async (url) => {
      await updateMutation.mutateAsync({ logo: url });
      setLogoPreview(url);
      toast.success('Logo updated successfully');
      if (cropImage) URL.revokeObjectURL(cropImage);
      setCropImage(null);
    },
    onError: (err) => {
      console.log(err);
      toast.error('Error uploading image');
    },
  });

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCropImage(URL.createObjectURL(file));
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    uploadLogoMutation.mutate(croppedFile);
  };

  const handleCropCancel = (open: boolean) => {
    if (!open) {
      if (cropImage) URL.revokeObjectURL(cropImage);
      setCropImage(null);
    }
  };

  const onSubmit = (data: ShopFormValues) => {
    updateMutation.mutate(data);
  };

  if (updateMutation.isPending) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-2 text-brand" />
        <p className="text-sm">Updating...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
        <p className="text-sm text-gray-500">Manage your store&apos;s branding and details.</p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="relative w-32 h-32 mb-4 group cursor-pointer">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 relative">
              {logoPreview ? (
                <Image src={logoPreview} alt="Shop Logo" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Store size={48} />
                </div>
              )}

              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoFileSelect}
                  disabled={uploadLogoMutation.isPending}
                />
                {uploadLogoMutation.isPending ? (
                  <Loader2 className="animate-spin text-white" />
                ) : (
                  <Camera className="text-white" size={24} />
                )}
              </label>
            </div>
          </div>
          <h3 className="font-bold text-gray-900">{activeShop.name}</h3>
          <p className="text-xs text-gray-500 mt-1">Click image to change logo</p>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 w-full space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-gray-700">Store Name</label>
              <Input
                disabled={updateMutation.isPending}
                {...register('name', { required: true })}
                className="h-11 bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2 text-left w-full">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <Select
                value={watch('category')}
                onValueChange={(val) => setValue('category', val, { shouldDirty: true })}
                disabled={updateMutation.isPending}
              >
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Truck size={16} className="text-red-600" /> Delivery Integration (Pathao)
              </h4>
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold text-gray-600">Pathao Store ID</label>
                  <Input
                    disabled={updateMutation.isPending}
                    {...register('pathao_store_id')}
                    placeholder="e.g. 12345"
                    className="h-11 bg-gray-50 border-gray-200"
                  />
                  <p className="text-[10px] text-gray-400">
                    Required to create consignment orders with Pathao.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-0.5 text-left">
                    <label className="text-sm font-semibold text-gray-700 block">
                      Create Delivery on Order Received
                    </label>
                    <p className="text-[10px] text-gray-500">
                      Automatically request delivery when a new order is placed.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer accent-brand"
                    disabled={updateMutation.isPending}
                    {...register('create_delivery_on_order')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty || updateMutation.isPending}
                className="bg-brand hover:bg-brand-primary/90"
              >
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ImageCropper
        open={!!cropImage}
        onOpenChange={handleCropCancel}
        imageSrc={cropImage}
        onCropComplete={handleCropComplete}
        aspect={1}
      />
    </div>
  );
}
