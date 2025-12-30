import { getProductBySlug } from '@/app/data';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ProductCard from '@/components/ProductCard';
import ProductInformation from '@/components/ProductUI';
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
    title: `Price : Rs ${product.price} | Sizes : ${product.product_variants
      .map((v) => v.size)
      .join(' - ')} | Color : ${product.product_variants.map((v) => v.color).join(' - ')} `,
    description: product.description,
    openGraph: {
      images: [product.productImages[0].url],
      title: `Price : Rs ${product.price} | Sizes : ${product.product_variants
        .map((v) => v.size)
        .join(' - ')} | Color : ${product.product_variants.map((v) => v.color).join(' - ')} `,
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
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl ">
        <div className='flex justify-center'>
          <ProductInformation product={product} />
        </div>
        <PersonalInfoForm />
      </div>
    </main>
  );
}
