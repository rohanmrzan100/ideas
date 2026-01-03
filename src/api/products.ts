import { Product } from '@/app/data';
import { BACKEND_URL } from '@/lib/constants';

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
