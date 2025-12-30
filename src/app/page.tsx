import ProductCard from '@/components/ProductCard';
import { products } from './data';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard / Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {products.map((product, index) => (
          <ProductCard {...product} key={index} />
        ))} */}
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
            className="group"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              {/* Image */}
              <div className="relative w-full aspect-3/4 lg:aspect-4/5 xl:aspect-1/1 bg-gray-50">
                <Image
                  src={product.productImages[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-5 py-4">
                <h2 className="text-base font-medium text-gray-900 leading-tight line-clamp-2">
                  {product.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">Rs. {product.price}</p>

                <p className="mt-3 text-xs tracking-wide text-gray-400 group-hover:text-gray-600 transition">
                  VIEW DETAILS
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
