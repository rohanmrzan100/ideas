import ProductCard from '@/components/ProductCard';
import { products } from './data';

export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard / Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard {...product} key={index} />
        ))}
      </div>
    </main>
  );
}
