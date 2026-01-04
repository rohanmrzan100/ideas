import { Product } from '@/app/types';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ name, price, productImages, display_price, shop }: Product) => {
  const slug = name.trim().toLowerCase().replace(/ /g, '-');
  const shopName = shop.name.trim().toLowerCase().replace(/ /g, '-');
  return (
    <Link href={`/${shopName}/${slug}`} className="group block h-full">
      <div className="relative flex flex-col h-full bg-white rounded-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-100">
        {/* Image Container */}
        <div className="relative w-full aspect-4/5 bg-gray-100 overflow-hidden">
          {productImages?.[0]?.url ? (
            <Image
              src={productImages[0].url}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
            <span className="bg-white/90 backdrop-blur text-brand text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
              View Product <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col gap-1 flex-1">
          <h3 className="font-medium text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-brand transition-colors">
            {name}
          </h3>
          <div className="mt-auto pt-2 flex flex-col items-start justify-start">
            <p className="font-bold text-lg text-gray-900">Rs. {price}</p>
            <span className="text-gray-400 line-through text-sm">Rs. {display_price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
