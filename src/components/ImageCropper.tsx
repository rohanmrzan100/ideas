'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCroppedImg } from '@/store/utils/canvas';
import { Loader2, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropComplete: (croppedFile: File) => void;
  aspect?: number;
}

export function ImageCropper({
  imageSrc,
  open,
  onOpenChange,
  onCropComplete,
  aspect = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsCropping(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (croppedFile) {
        onCropComplete(croppedFile);
        onOpenChange(false);
        // Reset state
        setZoom(1);
        setRotation(0);
        setCrop({ x: 0, y: 0 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset state on cancel
    setTimeout(() => {
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Adjust Your Image</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Drag to reposition • Scroll to zoom • Click rotate to adjust
          </p>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mt-4 shadow-inner border border-gray-200">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              rotation={rotation}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={onZoomChange}
              onRotationChange={setRotation}
              cropShape="rect"
              showGrid={true}
              style={{
                containerStyle: {
                  borderRadius: '0.75rem',
                },
              }}
            />
          )}
        </div>

        <div className="space-y-4 py-2">
          {/* Zoom Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Zoom
              </label>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, rgb(var(--brand, 59 130 246)) 0%, rgb(var(--brand, 59 130 246)) ${
                    ((zoom - 1) / 2) * 100
                  }%, rgb(229 231 235) ${((zoom - 1) / 2) * 100}%, rgb(229 231 235) 100%)`,
                }}
              />
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rotate Button */}
          <div className="flex items-center justify-between pt-2">
            <label className="text-sm font-medium text-gray-700">Rotate</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              disabled={isCropping}
              className="flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Rotate 90°
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isCropping}
            className="transition-all hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isCropping || !croppedAreaPixels}
            className="bg-brand text-white hover:opacity-90 transition-all min-w-[140px]"
          >
            {isCropping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Save & Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgb(var(--brand, 59 130 246));
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.15s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgb(var(--brand, 59 130 246));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.15s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </Dialog>
  );
}
