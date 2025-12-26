// app/data.ts

export interface Product {
  id: number;
  slug: string; // The unique URL part
  name: string;
  price: number;
  code: string;
  colors: string[];
  sizes: string[];
  image: string; // URL for the image
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    slug: 'product-1',
    name: 'Classic Cotton T-Shirt (Red)',
    price: 1200,
    code: 'CCT',
    colors: ['Red'],
    sizes: ['M', 'L', 'XL'],
    image: 'https://i2.pickpik.com/photos/23/376/973/t-shirt-red-man-plain-preview.jpg', // Dummy Image
    description: 'High quality cotton red t-shirt.',
  },
  {
    id: 2,
    slug: 'product-2',
    name: 'Classic Cotton T-Shirt (Green)',
    price: 1200,
    code: 'CCT',
    colors: ['Green'],
    sizes: ['M', 'L'],
    image: 'https://ghillieuk.com/cdn/shop/files/24.png?v=1762352708&width=1946',
    description: 'Eco-friendly green t-shirt.',
  },
  {
    id: 3,
    slug: 'product-3',
    name: 'Classic Cotton T-Shirt (Blue)',
    price: 1250,
    code: 'CCT',
    colors: ['Blue'],
    sizes: ['S', 'M', 'L', 'XXL'],
    image:
      'https://www.dixxon.com/cdn/shop/files/executive-short-sleeve-blue-635540.png?v=1713211641&width=1638',
    description: 'Deep ocean blue cotton t-shirt.',
  },
  {
    id: 4,
    slug: 'product-4',
    name: 'Classic Cotton T-Shirt (Black)',
    price: 1300,
    code: 'CCT',
    colors: ['Black'],
    sizes: ['L', 'XL'],
    image: 'https://jetpilot.com.au/cdn/shop/products/JPW21-BLACK-01.jpg?v=1626151047&width=2048',
    description: 'Premium black formal t-shirt.',
  },
  {
    id: 5,
    slug: 'product-5',
    name: 'Classic Cotton T-Shirt (White)',
    price: 1100,
    code: 'CCT',
    colors: ['White'],
    sizes: ['S', 'M'],
    image: 'https://i1.pickpik.com/photos/126/699/754/man-white-shirt-male-person-preview.jpg',
    description: 'Standard white daily wear t-shirt.',
  },
];

// Helper function to simulate a Database Fetch
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // In a real app, this is where you do: await db.product.findUnique(...)
  return products.find((p) => p.slug === slug);
}
