import { BACKEND_URL } from '@/lib/constants';

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

// Represents the raw JSON coming from NestJS
export interface BackendOrder {
  id: string;
  shop_id: string;
  product_id: string;
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
  product?: {
    id: string;
    name: string;
    price: number;
    open_graph_image: string | null;
    productImages: {
      id: string;
      url: string;
      position: number;
      color?: string;
    }[];
  };
}

// Exactly matches 'CreateOrderDto' in NestJS
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
}

// Partial for Updates
export type UpdateOrderDto = Partial<CreateOrderDto> & {
  status?: OrderStatus;
};

// --- Frontend Types ---

export interface OrderItemDetail {
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  customer_district: string; // Kept for legacy compatibility
  customer_location: string;

  // RAW Fields for Editing
  recipient_city: number;
  recipient_zone: number;
  item_description: string;

  // Legacy/Fallback fields
  size: string;
  color: string;

  // New Array for Multi-Variant support
  items: OrderItemDetail[];

  quantity: number;
  total_price: number;
  payment_method: 'COD' | 'QR';
  status: OrderStatus;
  created_at: string;
  product?: {
    name: string;
    price: number;
    image?: string;
    productImages?: { url: string; color?: string }[];
  };
}

export type CreateOrderPayload = {
  productId: string;
  shopId: string;
  productName: string;
  price: number;
  quantity: number;
  variant: {
    size: string;
    color: string;
  };
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
  paymentMethod: 'COD' | 'QR';
};

// --- API Functions ---

export async function createOrder(data: CreateOrderPayload) {
  const payload: CreateOrderDto = {
    shop_id: data.shopId,
    product_id: data.productId,
    recipient_name: data.customer.fullName,
    recipient_phone: data.customer.phoneNumber,
    recipient_address: `${data.customer.location}, ${data.customer.landmark || ''}`.trim(),
    recipient_city: data.customer.cityId,
    recipient_zone: data.customer.zoneId,
    item_quantity: data.quantity,
    item_description: data.customDescription
      ? data.customDescription
      : `Size: ${data.variant.size} | Color: ${data.variant.color}`,
    amount_to_collect: Number(data.price) * data.quantity,
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

// NEW: Generic Update Function
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

  const result: BackendOrder[] = await response.json();

  return result.map((order) => {
    let items: OrderItemDetail[] = [];
    let size = '-';
    let color = '-';
    const desc = order.item_description || '';

    // Parsing logic (same as before)
    if (desc.includes(',')) {
      const parts = desc.split(',');
      items = parts.map((part) => {
        const trimmed = part.trim();
        const [qtyStr, variantStr] = trimmed.split('x ');
        if (!variantStr) return { quantity: 1, color: '?', size: '?' };
        const [c, s] = variantStr.split('/');
        return {
          quantity: Number(qtyStr) || 1,
          color: c ? c.trim() : '-',
          size: s ? s.trim() : '-',
        };
      });
      size = 'Mixed';
      color = 'Mixed';
    } else if (desc.includes('|')) {
      const parts = desc.split('|');
      let parsedSize = '-';
      let parsedColor = '-';
      parts.forEach((p: string) => {
        const cleanP = p.trim();
        if (cleanP.startsWith('Size:')) parsedSize = cleanP.split(':')[1].trim();
        if (cleanP.startsWith('Color:')) parsedColor = cleanP.split(':')[1].trim();
      });
      size = parsedSize;
      color = parsedColor;
      items.push({ quantity: order.item_quantity, color: parsedColor, size: parsedSize });
    } else if (desc.includes('x ') && desc.includes('/')) {
      const [qtyStr, variantStr] = desc.trim().split('x ');
      const [c, s] = variantStr.split('/');
      items.push({ quantity: Number(qtyStr), color: c.trim(), size: s.trim() });
      size = s.trim();
      color = c.trim();
    } else {
      items.push({ quantity: order.item_quantity, color: '-', size: '-' });
    }

    const productImages =
      order.product?.productImages?.map((img) => ({
        url: img.url,
        color: img.color,
      })) || [];
    const mainImage = productImages[0]?.url || order.product?.open_graph_image || '';

    return {
      id: order.id,
      shop_id: order.shop_id,
      customer_name: order.recipient_name,
      customer_phone: order.recipient_phone,
      customer_district: 'Nepal', // Placeholder
      customer_location: order.recipient_address,

      // MAPPED RAW FIELDS
      recipient_city: order.recipient_city,
      recipient_zone: order.recipient_zone,
      item_description: desc,

      size: size,
      color: color,
      items: items,
      quantity: order.item_quantity,
      total_price: Number(order.amount_to_collect),
      payment_method: 'COD',
      status: order.status,
      created_at: order.created_at,
      product: {
        name: order.product?.name || 'Unknown Product',
        price: Number(order.product?.price || 0),
        image: mainImage,
        productImages: productImages,
      },
    };
  });
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
