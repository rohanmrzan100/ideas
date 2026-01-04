import { BACKEND_URL } from '@/lib/constants';

// --- Backend Types (Matches NestJS Entity & DTO) ---

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

// Represents the raw JSON coming from NestJS
export interface BackendOrder {
  id: string;
  shop_id: string;
  product_id: string; // Added
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: number;
  recipient_zone: number;
  item_quantity: number;
  item_description: string | null;
  amount_to_collect: number;
  delivery_consignment_id: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  shop?: {
    id: string;
    name: string;
    owner_id: string;
  };
  // The new relation from your backend change
  product?: {
    id: string;
    name: string;
    price: number;
    open_graph_image: string | null;
    productImages: {
      id: string;
      url: string;
      position: number;
    }[];
  };
}

// Exactly matches 'CreateOrderDto' in NestJS
export interface CreateOrderDto {
  shop_id: string;
  product_id: string; // Added to DTO
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: number;
  recipient_zone: number;
  item_quantity: number;
  item_description?: string;
  amount_to_collect: number;
}

// --- Frontend Types (Mapped for UI components) ---

export interface Order {
  id: string;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  customer_district: string;
  customer_location: string;
  size: string;
  color: string;
  quantity: number;
  total_price: number;
  payment_method: 'COD' | 'QR';
  status: OrderStatus;
  created_at: string;
  // Unified Product Object for UI
  product?: {
    name: string;
    image?: string; // Fallback or main image
    productImages?: { url: string }[]; // Full array
  };
}

// Helper type for the form payload used in your UI components
export type CreateOrderPayload = {
  productId: string;
  shopId: string;
  productName: string;
  price: number;
  variant: {
    size: string;
    color: string;
  };
  customer: {
    fullName: string;
    phoneNumber: string;
    district: string;
    cityId: number;
    zoneId: number;
    location: string;
    landmark?: string;
  };
  paymentMethod: 'COD' | 'QR';
};

// --- API Functions ---

export async function createOrder(data: CreateOrderPayload) {
  // Map Frontend Payload -> Backend DTO
  const payload: CreateOrderDto = {
    shop_id: data.shopId,
    product_id: data.productId, // Now sending the real product relation
    recipient_name: data.customer.fullName,
    recipient_phone: data.customer.phoneNumber,
    recipient_address: `${data.customer.location}, ${data.customer.landmark || ''}`.trim(),
    recipient_city: data.customer.cityId,
    recipient_zone: data.customer.zoneId,
    item_quantity: 1,
    item_description: `Size: ${data.variant.size} | Color: ${data.variant.color}`, // Simplified description
    amount_to_collect: Number(data.price),
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

export async function fetchShopOrders(shopId: string): Promise<Order[]> {
  const response = await fetch(`${BACKEND_URL}/api/v1/orders/shop/${shopId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const result: BackendOrder[] = await response.json();

  // Map Backend Entity -> Frontend Order Type
  return result.map((order) => {
    // 1. Extract Size/Color from description (Legacy support)
    let size = '-';
    let color = '-';

    if (order.item_description) {
      const parts = order.item_description.split('|');
      parts.forEach((p: string) => {
        const cleanP = p.trim();
        if (cleanP.startsWith('Size:')) size = cleanP.split(':')[1].trim();
        if (cleanP.startsWith('Color:')) color = cleanP.split(':')[1].trim();
      });
    }

    // 2. Prepare Product Images safely
    const productImages = order.product?.productImages?.map((img) => ({ url: img.url })) || [];
    const mainImage = productImages[0]?.url || order.product?.open_graph_image || '';

    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_name: order.recipient_name,
      customer_phone: order.recipient_phone,
      customer_district: 'Nepal', // Static as per current backend data
      customer_location: order.recipient_address,
      size: size,
      color: color,
      quantity: order.item_quantity,
      total_price: Number(order.amount_to_collect),
      payment_method: 'COD',
      status: order.status,
      created_at: order.created_at,
      product: {
        name: order.product?.name || 'Unknown Product',
        image: mainImage,
        productImages: productImages,
      },
    };
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const response = await fetch(`${BACKEND_URL}/api/v1/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update status');
  }
  return await response.json();
}

export async function getCities() {
  try {
    const response = await fetch('http://localhost:8000/api/v1/delivery/pathao/city-list');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getZones(city_id: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/delivery/pathao/zone-list/${city_id}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getAreas(zone_id: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/delivery/pathao/area-list/${zone_id}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
