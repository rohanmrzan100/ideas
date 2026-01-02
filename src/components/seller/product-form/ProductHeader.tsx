'use client';

import { Loader2 } from 'lucide-react';

type ProductHeaderProps = {
  isSubmitting: boolean;
};

export default function ProductHeader({ isSubmitting }: ProductHeaderProps) {
  return (
    <div className="px-6 py-4 md:px-8 md:py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur z-20">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
        <p className="hidden md:block text-sm text-gray-500 mt-1">
          Create a new listing for your store
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="hidden md:block px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-full transition"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-primary/90 rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? 'Publishing...' : 'Publish Product'}
        </button>
      </div>
    </div>
  );
}
