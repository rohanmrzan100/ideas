import { BACKEND_URL } from '@/lib/constants';
import { Product } from './products';

export interface Shop {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  logo?: string;
  category?: string;
}
export async function fetchMyShops() {
  const response = await fetch(BACKEND_URL + '/api/v1/shops/mine', {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
}

export async function createShop(name: string): Promise<Shop> {
  const response = await fetch(BACKEND_URL + '/api/v1/shops', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error('Failed to create shop');
  }
  return await response.json();
}

export const fetchShopProducts = async (activeShopId: string): Promise<Product[]> => {
  const response = await fetch(`${BACKEND_URL}/api/v1/shops/my-shop/${activeShopId}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export async function getProduct(shopName: string, slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/product/${shopName}/${slug}`, {
      next: {
        revalidate: 3600,
        tags: [`product-${slug}`],
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function updateShop(id: string, data: Partial<Shop>): Promise<Shop> {
  const response = await fetch(`${BACKEND_URL}/api/v1/shops/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update shop');
  return await response.json();
}

export async function uploadShopLogo(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BACKEND_URL}/api/v1/shops/upload-logo`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload logo');
  const result = await response.json();
  return result.url;
}
