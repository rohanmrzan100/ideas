import { products } from './data';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
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
  );
}
