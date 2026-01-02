'use client';
import { fetchShopProducts } from '@/api/shop';
import ProductCard from '@/components/ProductCard';
import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const SellerDashboard = () => {
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shop-products', activeShopId],
    queryFn: () => fetchShopProducts(activeShopId),
  });

  if (isLoading) {
    return (
      <>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-2 text-brand" />
          <p className="text-sm">Loading...</p>
        </div>
      </>
    );
  }
  if (isError) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-96 text-red-500">
          <AlertCircle size={32} className="mb-2" />
          <p className="font-medium">Something Went Wrong</p>
          <p className="text-sm opacity-80">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </>
    );
  }

  return (
    <h1>
      {' '}
      <main className="min-h-screen bg-gray-50/30 pb-20">
        {/* Product Grid Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-2">Handpicked for you this season</p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-sm font-bold border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-400 transition"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm font-bold border-b border-black pb-0.5"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </h1>
  );
};

export default SellerDashboard;
