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
import { Camera, Loader2, Save, Store } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ShopFormValues = {
  name: string;
  category: string;
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
  const queryClient = useQueryClient();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Cropper State
  const [cropImage, setCropImage] = useState<string | null>(null);

  const { data: shops = [] } = useQuery({
    queryKey: ['my-shops'],
    queryFn: fetchMyShops,
  });

  const activeShop = shops.find((s: Shop) => s.id === activeShopId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<ShopFormValues>();

  useEffect(() => {
    if (activeShop) {
      reset({
        name: activeShop.name,
        category: activeShop.category || 'Clothing & Apparel',
      });
      setLogoPreview(activeShop.logo || null);
    }
  }, [activeShop, reset]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Shop>) => updateShop(activeShopId!, data),
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
      // Update the shop with the new logo URL
      await updateMutation.mutateAsync({ logo: url });
      setLogoPreview(url);
      toast.success('Logo updated successfully');
      // Cleanup crop image url if exists
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
      // clear input
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
    if (!activeShopId) return;
    updateMutation.mutate(data);
  };

  if (!activeShop)
    return <div className="p-8 text-center text-gray-500">Select a shop to manage settings</div>;

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
        {/* Left Col: Logo */}
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

              {/* Upload Overlay */}
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

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 w-full  space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-gray-700">Store Name</label>
              <Input
                disabled={updateMutation.isPending}
                {...register('name', { required: true })}
                className="h-11 bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2 text-left w-full ">
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
