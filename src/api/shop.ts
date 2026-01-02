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
