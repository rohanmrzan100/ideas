'use client';

import { useState } from 'react';
import { Upload, LayoutTemplate, Palette, Save, Smartphone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function StoreDesignPage() {
  const [primaryColor, setPrimaryColor] = useState('#0F172A');
  const [announcement, setAnnouncement] = useState('Free Shipping on orders over Rs. 2000');
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBannerImage(url);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-8">
      {/* --- Settings Column --- */}
      <div className="flex-1 space-y-8 overflow-y-auto pr-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Design</h1>
          <p className="text-sm text-gray-500">Customize the look and feel of your online store.</p>
        </div>

        {/* Banner Upload */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <LayoutTemplate size={20} />
            </div>
            <h2 className="font-bold text-lg">Store Banner</h2>
          </div>
          <label className="aspect-[3/1] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-brand/50 transition relative overflow-hidden group">
            {bannerImage ? (
              <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload
                  className="text-gray-400 mb-2 group-hover:scale-110 transition-transform"
                  size={32}
                />
                <p className="text-sm font-medium text-gray-600">Click to upload banner</p>
                <p className="text-xs text-gray-400">Recommended: 1200x400px</p>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
          </label>
        </section>

        {/* Theme Settings */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Palette size={20} />
            </div>
            <h2 className="font-bold text-lg">Theme Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-xl border border-gray-200 shadow-sm ring-2 ring-offset-2 ring-transparent transition-all"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">
                    #
                  </span>
                  <Input
                    type="text"
                    value={primaryColor.replace('#', '')}
                    onChange={(e) => setPrimaryColor(`#${e.target.value}`)}
                    className="font-mono uppercase pl-6"
                    maxLength={7}
                  />
                </div>
                <div className="relative w-12 h-11 overflow-hidden rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Announcement Bar</label>
              <Input
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Free Shipping on orders over Rs. 2000"
              />
              <p className="text-xs text-gray-500">Appears at the very top of your store.</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button
            className="bg-brand text-white gap-2 px-6"
            onClick={() => toast.success('Changes Saved!')}
          >
            <Save size={18} /> Save Changes
          </Button>
        </div>
      </div>

      {/* --- Live Preview Column --- */}
      <div className="hidden xl:flex w-[400px] flex-col items-center justify-center bg-gray-100 rounded-3xl border border-gray-200 p-8 relative">
        <div className="absolute top-4 left-0 w-full text-center">
          <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm flex items-center gap-2 w-fit mx-auto">
            <Smartphone size={14} /> Live Mobile Preview
          </span>
        </div>

        {/* Phone Frame */}
        <div className="w-[320px] h-[640px] bg-white rounded-[40px] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20"></div>

          {/* App Content Mockup */}
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            {/* Dynamic Announcement Bar */}
            {announcement && (
              <div
                style={{ backgroundColor: primaryColor }}
                className="px-4 py-2 text-[10px] text-white text-center font-medium"
              >
                {announcement}
              </div>
            )}

            {/* Header Mock */}
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
              <span className="font-bold text-gray-900 text-sm">Store Name</span>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>

            {/* Dynamic Banner */}
            <div className="aspect-[2/1] bg-gray-100 w-full relative">
              {bannerImage ? (
                <img src={bannerImage} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  Banner Area
                </div>
              )}
            </div>

            {/* Product List Mock */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[4/5] bg-gray-100 rounded-lg"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  {/* Dynamic Button Color */}
                  <div
                    style={{ backgroundColor: primaryColor }}
                    className="h-6 w-full rounded text-[10px] text-white flex items-center justify-center font-bold"
                  >
                    Buy Now
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
