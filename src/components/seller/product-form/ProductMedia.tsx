'use client';

import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  ImagePlus,
  Loader2,
  Pipette,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ImageCropper } from '@/components/ImageCropper';

// Declare EyeDropper API for TypeScript
declare global {
  interface Window {
    EyeDropper?: new () => {
      open: () => Promise<{ sRGBHex: string }>;
    };
  }
}

export type ProductImageState = {
  id: string;
  file?: File;
  previewUrl: string;
  status: 'uploading' | 'success' | 'error';
  color?: string;
  serverData?: {
    url: string;
    public_id?: string;
  };
};

type ProductMediaProps = {
  images: ProductImageState[];
  uploadError: string | null;
  availableColors: string[];
  onImagesAdded: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onAssignColor: (id: string, color: string) => void;
};

export default function ProductMedia({
  images,
  uploadError,
  availableColors,
  onImagesAdded,
  onRemoveImage,
  onAssignColor,
}: ProductMediaProps) {
  const [cropImage, setCropImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // FIX: Force crop for every upload. Multi-select disabled in input below.
      setPendingFile(file);
      setCropImage(URL.createObjectURL(file));
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    onImagesAdded([croppedFile]);
    if (cropImage) URL.revokeObjectURL(cropImage);
    setCropImage(null);
    setPendingFile(null);
  };

  const handleCropCancel = (open: boolean) => {
    if (!open) {
      if (cropImage) URL.revokeObjectURL(cropImage);
      setCropImage(null);
      setPendingFile(null);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Product Media</h2>
          <p className="text-sm text-gray-500">
            Upload high quality images. 4:5 aspect ratio is recommended.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-full border',
              images.length === 8
                ? 'bg-red-50 text-red-600 border-red-100'
                : 'bg-white text-gray-600 border-gray-200',
            )}
          >
            {images.length} / 8 Images
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <ImageCard
              key={img.id}
              img={img}
              index={index}
              availableColors={availableColors}
              onRemove={() => onRemoveImage(img.id)}
              onAssignColor={(color) => onAssignColor(img.id, color)}
            />
          ))}

          {images.length < 8 && (
            <label
              className={cn(
                'relative aspect-4/5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group bg-gray-50/50 hover:bg-brand/5',
                uploadError ? 'border-red-300' : 'border-gray-200 hover:border-brand',
              )}
            >
              <input
                type="file"
                // FIX: Removed 'multiple' to enforce single-file flow with crop
                accept="image/png, image/jpeg, image/webp"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                disabled={images.length >= 8}
              />

              <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand group-hover:scale-110 transition-all mb-3">
                <ImagePlus size={32} />
              </div>
              <p className="text-sm font-bold text-gray-600 group-hover:text-brand">Upload Image</p>
              <p className="text-xs text-gray-400 mt-1">Click to browse & crop</p>
            </label>
          )}
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 mt-4 text-red-600 text-sm font-bold bg-red-50 p-4 rounded-xl animate-in fade-in border border-red-100">
            <AlertCircle size={18} />
            {uploadError}
          </div>
        )}
      </div>

      <ImageCropper
        open={!!cropImage}
        onOpenChange={handleCropCancel}
        imageSrc={cropImage}
        onCropComplete={handleCropComplete}
        aspect={4 / 5}
      />
    </section>
  );
}

function ImageCard({
  img,
  index,
  availableColors,
  onRemove,
  onAssignColor,
}: {
  img: ProductImageState;
  index: number;
  availableColors: string[];
  onRemove: () => void;
  onAssignColor: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) {
      alert('EyeDropper not supported on this browser.');
      setOpen(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 10));
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      onAssignColor(result.sRGBHex);
      setOpen(false);
    } catch (e) {
      console.log('EyeDropper closed');
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <div
        className={cn(
          'relative aspect-4/5 bg-gray-100 rounded-xl border overflow-hidden shadow-sm transition-all group-hover:shadow-md',
          img.status === 'error' ? 'border-red-500' : 'border-gray-200',
          index === 0 && 'ring-2 ring-brand ring-offset-2',
        )}
      >
        <Image
          src={img.previewUrl}
          alt="Preview"
          fill
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-105',
            img.status === 'uploading' && 'opacity-50 blur-[1px]',
          )}
        />

        {img.status === 'uploading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-10">
            <Loader2 className="animate-spin text-white drop-shadow-md" size={32} />
          </div>
        )}

        {img.status === 'success' && (
          <>
            <button
              onClick={onRemove}
              type="button"
              className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full shadow-sm backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <Trash2 size={16} />
            </button>

            {index === 0 && (
              <span className="absolute top-2 left-2 px-2.5 py-1 bg-brand/90 backdrop-blur text-white text-[10px] uppercase font-bold rounded-md shadow-sm z-10">
                Cover
              </span>
            )}
          </>
        )}
      </div>

      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-between bg-white hover:bg-gray-50 border-gray-200 h-11',
                img.color ? 'text-gray-900 border-brand/50 ring-1 ring-brand/10' : 'text-gray-500',
              )}
            >
              <span className="flex items-center gap-2 truncate text-xs font-bold uppercase">
                {img.color ? (
                  <>
                    <span
                      className="w-4 h-4 rounded-full border border-gray-200 shadow-sm shrink-0"
                      style={{ backgroundColor: img.color }}
                    />
                    {img.color}
                  </>
                ) : (
                  <>
                    <Pipette size={14} /> Tag Color
                  </>
                )}
              </span>
              <ChevronsUpDown size={14} className="opacity-50 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[200px]"
            align="start"
            side="bottom"
            sideOffset={8}
            avoidCollisions={false}
          >
            <Command>
              <CommandInput placeholder="Search color..." className="h-9 text-xs" />
              <CommandList>
                <CommandEmpty>No color found.</CommandEmpty>

                <CommandGroup heading="Tools">
                  <CommandItem onSelect={handleEyeDropper} className="cursor-pointer text-xs py-2">
                    <Pipette className="mr-2 h-3.5 w-3.5" />
                    Pick from Image
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      onAssignColor('');
                      setOpen(false);
                    }}
                    className="cursor-pointer text-xs text-red-600 py-2"
                  >
                    <X className="mr-2 h-3.5 w-3.5" />
                    Clear Color
                  </CommandItem>
                </CommandGroup>

                {availableColors.length > 0 && (
                  <CommandGroup heading="Used in Variants">
                    {availableColors.map((color) => (
                      <CommandItem
                        key={color}
                        value={color}
                        onSelect={() => {
                          onAssignColor(color);
                          setOpen(false);
                        }}
                        className="cursor-pointer text-xs py-2"
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-gray-200 mr-2"
                          style={{ backgroundColor: color }}
                        />
                        {color}
                        {img.color === color && <Check className="ml-auto h-3.5 w-3.5" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
