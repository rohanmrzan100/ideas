'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import {
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Plus,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';

// --- TYPES ---
type FormValues = {
  name: string;
  description: string;
  shop_id: string;
  productImages: { url: string; position: number }[];
  product_variants: {
    size: string;
    color: string;
    stock: number;
    price: number;
    sku: string;
  }[];
};

export default function ProductWizard({ shopId }: { shopId: string }) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger, // Used to validate current step before moving
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      shop_id: shopId,
      productImages: [],
      product_variants: [{ size: 'M', color: 'Black', stock: 10, price: 0, sku: '' }],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'productImages',
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'product_variants',
  });

  const watchedImages = watch('productImages');

  // --- LOGIC: HANDLE FILE UPLOAD ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      // 1. Get Signature from your Backend
      const signRes = await fetch('http://localhost:3000/cloudinary/signature');
      const { signature, timestamp, cloudName, apiKey } = await signRes.json();

      // 2. Upload each file to Cloudinary
      const uploads = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', 'products');

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await uploadRes.json();
        return data.secure_url; // The URL we need
      });

      const urls = await Promise.all(uploads);

      // 3. Add to Form State
      urls.forEach((url, idx) => {
        appendImage({ url, position: watchedImages.length + idx });
      });
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  // --- LOGIC: NAVIGATION ---
  const nextStep = async () => {
    let isValid = false;
    if (step === 1) isValid = await trigger(['name', 'description']);
    if (step === 2) {
      if (imageFields.length === 0) {
        alert('Please upload at least one image.');
        return;
      }
      isValid = true;
    }

    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  // --- LOGIC: SUBMIT ---
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Re-index images just in case
    const payload = {
      ...data,
      productImages: data.productImages.map((img, i) => ({ ...img, position: i })),
    };

    console.log('Submitting:', payload);
    // TODO: POST to NestJS /products endpoint
    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) alert('Product Created!');
  };

  return (
    <div className="max-w-3xl mx-auto my-12">
      {/* --- WIZARD PROGRESS BAR --- */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded transition-all duration-300"
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        ></div>

        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex flex-col items-center bg-white px-2`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                step >= s
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {step > s ? <CheckCircle size={16} /> : s}
            </div>
            <span className="text-xs font-medium mt-1 text-gray-500">
              {s === 1 ? 'Details' : s === 2 ? 'Images' : 'Variants'}
            </span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
      >
        {/* --- STEP 1: DETAILS --- */}
        {step === 1 && (
          <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. Premium Cotton Tee"
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Tell customers about your product..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: IMAGES --- */}
        {step === 6 && (
          <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold mb-1">Media Gallery</h2>
            <p className="text-sm text-gray-500 mb-6">Upload high quality images.</p>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="bg-blue-50 p-4 rounded-full mb-3 text-blue-600">
                  {uploading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                  ) : (
                    <UploadCloud size={24} />
                  )}
                </div>
                <p className="font-medium text-gray-700">
                  {uploading ? 'Uploading...' : 'Click or Drag images here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            {/* Preview Grid */}
            {imageFields.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
                {imageFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border"
                  >
                    <Image src={field.url} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                        Main Image
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- STEP 3: VARIANTS --- */}
        {step === 2 && (
          <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Inventory & Variants</h2>
              <button
                type="button"
                onClick={() => appendVariant({ size: '', color: '', stock: 0, price: 0, sku: '' })}
                className="text-sm bg-gray-900 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="space-y-3">
              {variantFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-wrap md:flex-nowrap gap-2 items-start p-3 bg-gray-50 border rounded-xl"
                >
                  <div className="w-1/5 min-w-[80px]">
                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">
                      Size
                    </label>
                    <input
                      {...register(`product_variants.${index}.size`)}
                      placeholder="Size"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="w-1/4 min-w-[100px]">
                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">
                      Color
                    </label>
                    <input
                      {...register(`product_variants.${index}.color`)}
                      placeholder="Color"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="w-1/4 min-w-[100px]">
                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">
                      Price
                    </label>
                    <input
                      type="number"
                      {...register(`product_variants.${index}.price`)}
                      placeholder="0.00"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="w-1/5 min-w-[80px]">
                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      {...register(`product_variants.${index}.stock`)}
                      placeholder="0"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- FOOTER: NAVIGATION --- */}
        <div className="bg-gray-50 px-8 py-5 flex justify-between border-t items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="text-gray-600 font-medium hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition disabled:opacity-50"
            >
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2 transition"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'} <CheckCircle size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
