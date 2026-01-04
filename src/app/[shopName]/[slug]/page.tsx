import { getProduct } from '@/api/shop';
import OrderingSteps from '@/components/order-steps';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    shopName: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shopName, slug } = await params;
  const product = await getProduct(shopName, slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Rs. ${product.price}`,
    description: product.description,
    openGraph: {
      images: [product.open_graph_image || ''],
      title: `${product.name} - Buy Now`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { shopName, slug } = await params;
  const product = await getProduct(shopName, slug);
  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-0 md:p-4">
      <div className="w-full md:max-w-6xl bg-white min-h-screen md:min-h-0 md:h-[85vh] shadow-none  relative flex flex-col md:rounded-card overflow-hidden">
        <OrderingSteps product={product} />
      </div>
    </main>
  );
}
