import { BACKEND_URL } from '@/lib/constants';

export interface Customer {
  phone: string;
  name: string;
  email?: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string;
  address: string;
}

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch(`${BACKEND_URL}/api/v1/customers`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return await response.json();
}
