import { Product, Shop } from '@/app/data';
import { BACKEND_URL } from '@/lib/constants';

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
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
