// lib/data.ts

export type ProductVariant = {
  sku: string;
  size: string;
  color: string;
  stock: number;
  image: string;
};

export type Product = {
  name: string;
  description: string;
  price: number;
  shop_id: string;
  images: { url: string; position: number }[];
  variants: ProductVariant[];
};

export const products: Product[] = [
  {
    name: 'Essential Organic Cotton Crewneck',
    description:
      'A daily staple. Made from 100% organic cotton, pre-shrunk for a perfect fit that lasts.',
    shop_id: 'c6f6e528-0629-4364-9022-723525287895',
    price: 5000,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        position: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        position: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
        position: 3,
      },
    ],
    variants: [
      {
        sku: 'TEE-WHT-S',
        size: 'S',
        color: 'White',
        stock: 50,
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      },
      {
        sku: 'TEE-WHT-M',
        size: 'M',
        color: 'White',
        stock: 42,
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      },
      {
        sku: 'TEE-BLK-M',
        size: 'M',
        color: 'Black',
        stock: 20,
        image:
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      },
      {
        sku: 'TEE-BLK-L',
        size: 'L',
        color: 'Black',
        stock: 15,
        image:
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    name: 'Velocity Red Runner X1',
    description:
      'Engineered for speed. Features breathable mesh and our signature foam sole for impact absorption.',
    price: 150.0,
    shop_id: 'c6f6e528-0629-4364-9022-723525287895',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        position: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
        position: 2,
      },
    ],
    variants: [
      {
        sku: 'RUN-RED-US8',
        size: 'US 8',
        color: 'Red',
        stock: 10,
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      },
      {
        sku: 'RUN-RED-US9',
        size: 'US 9',
        color: 'Red',
        stock: 5,
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      },
      {
        sku: 'RUN-RED-US10',
        size: 'US 10',
        color: 'Red',
        stock: 0,
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    name: 'Sonic Pro Wireless Headphones',
    description: 'Active noise cancelling with 30-hour battery life. Premium silver finish.',
    price: 150.0,
    shop_id: 'c6f6e528-0629-4364-9022-723525287895',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        position: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
        position: 2,
      },
    ],
    variants: [
      {
        sku: 'HP-SILVER-STD',
        size: 'Standard',
        color: 'Silver',
        stock: 100,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return products.find((p) => p.name.toLowerCase().replace(/ /g, '-') === slug);
}
