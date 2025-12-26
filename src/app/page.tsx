import { products } from './data';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard / Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/tnt/${product.slug}`}
            className="block p-6 border rounded-lg hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-bold text-black">{product.name}</h2>
            <p className="text-gray-600 mt-2">Rs. {product.price}</p>
            <p className="text-blue-500 mt-4 text-sm">Click to view unique URL</p>
            <div className="mt-2 text-xs bg-gray-100 p-2 rounded">/tnt/{product.slug}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
