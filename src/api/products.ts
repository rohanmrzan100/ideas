import { BACKEND_URL } from '@/lib/constants';

export type ProductVariant = {
  sku?: string;
  size: string;
  color: string;
  stock: number;
  id?: string;
  product_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProductImages = {
  id?: string;
  product_id?: string;
  cloudinary_public_id?: string;
  url: string;
  position: number;
  color?: string; // <--- ADDED THIS FIELD
};

export interface Shop {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export type Product = {
  name: string;
  id: string;
  description: string;
  price: number;
  display_price: number | null;
  shop_id: string | null;
  productImages: ProductImages[];
  shop: Shop;
  open_graph_image: string | null;
  [key: string]: unknown;
  product_variants: ProductVariant[];
};

export async function handleDeleteProduct(id: string) {
  const response = await fetch(BACKEND_URL + '/api/v1/product/' + id, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete a product');
  }
  return await response.json();
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const response = await fetch(`${BACKEND_URL}/api/v1/product/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return await response.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${BACKEND_URL}/api/v1/product/${id}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  const result = await response.json();
  return result;
}
