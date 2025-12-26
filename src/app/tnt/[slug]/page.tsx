import { getProductBySlug } from '@/app/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

// 1. GENERATE METADATA (Server Side)
// This runs BEFORE the page loads to set OG tags for Facebook/WhatsApp
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: `Buy now for Rs. ${product.price}. Colors: ${product.colors.join(', ')}`,
      url: `https://shop.ai/tnt/${product.slug}`, // Your actual domain here
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
  };
}

// 2. THE PAGE UI
export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return notFound(); // Returns the 404 page
  }

  return (
    <main className="min-h-screen p-10 bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          {/* Using standard img tag for simplicity with external dummy URLs */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="w-full rounded-md border" />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-sm text-gray-500 uppercase tracking-wide font-bold">
            Code: {product.code}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-2xl text-green-600 font-semibold mt-4">Rs. {product.price}</p>

          <div className="mt-4">
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Variants */}
          <div className="mt-6 space-y-2">
            <div>
              <span className="font-bold">Color: </span>
              {product.colors.join(', ')}
            </div>
            <div>
              <span className="font-bold">Size: </span>
              {product.sizes.join(', ')}
            </div>
          </div>

          <button className="mt-8 w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition">
            Add To Cart
          </button>
        </div>
      </div>
    </main>
  );
}
