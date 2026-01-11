import { BACKEND_URL } from '@/lib/constants';
import { Product } from './products';
import { Shop } from './shop';

// --- Backend Types ---
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export type City = {
  city_id: number;
  city_name: string;
};

export type Zone = {
  zone_id: number;
  zone_name: string;
};

export type Area = {
  area_id: number;
  area_name: string;
  home_delivery_available: boolean;
  pickup_available: boolean;
};

export interface CreateOrderDto {
  shop_id: string;
  product_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: number;
  recipient_zone: number;
  item_quantity: number;
  item_description?: string;
  amount_to_collect: number;
  items: {
    size: string;
    color: string;
    quantity: number;
  }[];
}

// Partial for Updates
export type UpdateOrderDto = Partial<CreateOrderDto> & {
  status?: OrderStatus;
};

// --- Frontend Types ---

export interface Order {
  id: string;
  shop_id: string;
  product_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: number;
  recipient_zone: number;
  item_quantity: number;
  item_description: string;
  // Added items array for frontend display
  items?: {
    size: string;
    color: string;
    quantity: number;
  }[];
  amount_to_collect: string;
  delivery_consignment_id: string | null;
  delivery_fee: number | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  shop: Shop;
  product: Product;
}

// Frontend Payload (Form Data Structure)
export type CreateOrderPayload = {
  productId: string;
  shopId: string;
  productName: string;
  price: number;
  quantity: number;
  // Replaced 'variant' with 'items'
  items: {
    size: string;
    color: string;
    quantity: number;
  }[];
  customDescription?: string;
  customer: {
    fullName: string;
    phoneNumber: string;
    district: string;
    cityId: number;
    zoneId: number;
    location: string;
    landmark?: string;
  };
  paymentMethod: 'COD' | 'ESEWA' | 'KHALTI';
};

// --- API Functions ---

export async function createOrder(data: CreateOrderPayload) {
  // Generate description from items array
  const generatedDescription = data.items
    .map((i) => `${i.quantity}x ${i.color}/${i.size}`)
    .join(', ');

  const payload: CreateOrderDto = {
    shop_id: data.shopId,
    product_id: data.productId,
    recipient_name: data.customer.fullName,
    recipient_phone: data.customer.phoneNumber,
    recipient_address: `${data.customer.location}, ${data.customer.landmark || ''}`.trim(),
    recipient_city: data.customer.cityId,
    recipient_zone: data.customer.zoneId,
    item_quantity: data.quantity,
    item_description: data.customDescription || generatedDescription,
    // FIX: Calculate total amount (Price * Quantity)
    amount_to_collect: Number(data.price) * data.quantity,
    items: data.items,
  };

  const response = await fetch(`${BACKEND_URL}/api/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return await response.json();
}

export async function updateOrder(orderId: string, data: UpdateOrderDto) {
  const response = await fetch(`${BACKEND_URL}/api/v1/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update order');
  }
  return await response.json();
}

export async function fetchShopOrders(shopId: string): Promise<Order[]> {
  const response = await fetch(`${BACKEND_URL}/api/v1/orders/shop/${shopId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const result: Order[] = await response.json();
  return result;
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  const response = await fetch(`${BACKEND_URL}/api/v1/orders/${orderId}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  const result: Order = await response.json();
  return result;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return updateOrder(orderId, { status });
}

export async function getCities() {
  try {
    const response = await fetch(BACKEND_URL + '/api/v1/delivery/pathao/city-list');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getZones(city_id: number) {
  try {
    const response = await fetch(BACKEND_URL + `/api/v1/delivery/pathao/zone-list/${city_id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getAreas(zone_id: number) {
  try {
    const response = await fetch(BACKEND_URL + `/api/v1/delivery/pathao/area-list/${zone_id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function requestPathaoDelivery(orderId: string) {
  const response = await fetch(`${BACKEND_URL}/api/v1/orders/request-delivery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to request delivery');
  }
  return await response.json();
}

export async function cancelPathaoDelivery(orderId: string) {
  const response = await fetch(`${BACKEND_URL}/api/v1/orders/delivery/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ id: orderId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel delivery');
  }
  return await response.json();
}
