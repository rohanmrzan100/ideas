import { getProductBySlug } from '@/app/data';
import OrderingSteps from '@/components/order-steps';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Rs. ${product.price}`,
    description: product.description,
    openGraph: {
      images: [product.productImages[0]?.url || ''],
      title: `${product.name} - Buy Now`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-0 md:p-4">
      {/* Responsive Container: 
         - Mobile: w-full, min-h-screen (full screen app feel)
         - Desktop: max-w-6xl, fixed height card (modern modal feel)
      */}
      <div className="w-full md:max-w-6xl bg-white min-h-screen md:min-h-0 md:h-[85vh] shadow-none  relative flex flex-col md:rounded-card overflow-hidden">
        <OrderingSteps product={product} />
      </div>
    </main>
  );
}
