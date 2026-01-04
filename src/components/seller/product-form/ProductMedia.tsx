'use client';

import { AlertCircle, CheckCircle2, Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

// Export this type so the parent component can use it
export type ProductImageState = {
  id: string; // Temporary unique ID
  file?: File; // The original file
  previewUrl: string; // Local blob URL for immediate preview
  status: 'uploading' | 'success' | 'error';
  serverData?: {
    // Data returned from your backend
    url: string;
  };
};

type ProductMediaProps = {
  images: ProductImageState[]; // Changed from separate files/previews to this unified state
  uploadError: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
};

export default function ProductMedia({
  images,
  uploadError,
  onImageSelect,
  onRemoveImage,
}: ProductMediaProps) {
  return (
    <div className="lg:col-span-4 bg-white border-l border-gray-200 p-6 md:p-8">
      <div className="sticky top-24">
        <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
          Product Images
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {images.length} / 4
          </span>
        </h3>

        {/* Upload Input Area */}
        <label
          className={`
            relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center 
            transition-all cursor-pointer overflow-hidden group
            ${
              uploadError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-brand hover:bg-brand/5'
            }
          `}
        >
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={onImageSelect}
            disabled={images.length >= 4} // Disable if max images reached
          />

          <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 text-brand rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud size={24} />
          </div>
          <p className="text-sm font-bold text-gray-900">Click to upload</p>
          <p className="text-xs text-gray-500 mt-1 px-4">Support: PNG, JPG, WEBP (Max 800x800px)</p>
        </label>

        {uploadError && (
          <div className="flex items-center gap-2 mt-3 text-red-600 text-xs font-bold bg-red-50 p-2 rounded-lg animate-in fade-in">
            <AlertCircle size={14} />
            {uploadError}
          </div>
        )}

        {/* Image Grid */}
        <div className="mt-6 space-y-3">
          {images.length > 0 && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Gallery Preview
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`
                  group relative aspect-square bg-white rounded-md border shadow-sm overflow-hidden
                  ${img.status === 'error' ? 'border-red-500' : 'border-gray-200'}
                `}
              >
                <Image
                  src={img.previewUrl}
                  alt={`Preview ${index}`}
                  fill
                  className={`object-cover transition-transform group-hover:scale-105 ${
                    img.status === 'uploading' ? 'opacity-50 blur-[2px]' : ''
                  }`}
                />

                {/* --- Visual States --- */}

                {/* 1. Uploading Spinner */}
                {img.status === 'uploading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                    <Loader2 className="animate-spin text-brand" size={24} />
                  </div>
                )}

                {/* 2. Error State */}
                {img.status === 'error' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/80 z-10 text-red-600">
                    <AlertCircle size={24} />
                    <span className="text-[10px] font-bold mt-1">Failed</span>
                  </div>
                )}

                {/* 3. Success (Cover Label) */}
                {index === 0 && img.status === 'success' && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10">
                    COVER
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemoveImage(img.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm transform translate-y-2 group-hover:translate-y-0 z-20"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Empty Slots Placeholders */}
            {Array.from({ length: Math.max(0, 4 - images.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square bg-gray-50 rounded-md border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-md border border-blue-100 bg-blue-50/50">
          <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600" /> Pro Tips
          </h4>
          <div className="space-y-2 text-xs text-blue-800/80">
            <p>
              • High-res images improve conversion by <strong>40%</strong>.
            </p>
            <p>• Use the Bulk Generator to create all size/color combos instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
