import { MOCK_ORDERS } from "@/app/data";

// --- Types (If not already defined) ---
export interface Order {
  id: string;
  product_id: string;
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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  product?: {
    name: string;
    productImages: { url: string }[];
  };
}

export type CreateOrderPayload = {
  productId: string;
  shopId: string;
  variant: {
    size: string;
    color: string;
  };
  customer: {
    fullName: string;
    phoneNumber: string;
    district: string;
    location: string;
    landmark?: string;
  };
  paymentMethod: 'COD' | 'QR';
};

// --- Mock Implementations ---

export async function createOrder(data: CreateOrderPayload) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  console.log("Mock Order Created:", data);
  return { success: true, message: "Order placed successfully (Mock)" };
}

export async function fetchShopOrders(shopId: string): Promise<Order[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Return mock data
  return MOCK_ORDERS;
}

export async function updateOrderStatus(orderId: string, status: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Mock: Order ${orderId} status updated to ${status}`);
  return { success: true };
}