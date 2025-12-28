import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug } from "@/app/data";
import ProductUI from "@/components/ProductUI";

// 1. Update Props: params is a Promise in Next.js 15+
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 2. Await params before accessing properties
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | My Store`,
    description: product.description,
    openGraph: {
      images: [product.images[0].url],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  // 3. Await params here as well
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  console.log("Slug requested:", slug); // Now this should log the correct string

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ProductUI product={product} />
      </div>
    </main>
  );
}
