import { Order } from '@/api/order';

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
export const MOCK_PRODUCT: Product = {
  id: 'prod_123456',
  name: 'Vintage Puffer Jacket - North Face',
  description:
    'Premium quality down jacket perfect for winter. Features water-resistant fabric, adjustable cuffs, and a detachable hood. Keeping you warm in Kathmandu winters.',
  price: 4500,
  display_price: 6000,
  shop_id: 'shop_01',
  open_graph_image: null,
  shop: {
    id: 'shop_01',
    name: 'TNT Store',
    owner_id: 'user_01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  productImages: [
    {
      url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop',
      position: 0,
    },
    {
      url: 'https://images.unsplash.com/photo-1539533018447-63fcce667c1f?q=80&w=1000&auto=format&fit=crop',
      position: 1,
    },
    {
      url: 'https://images.unsplash.com/photo-1551488852-7dd86d969790?q=80&w=1000&auto=format&fit=crop',
      position: 2,
    },
  ],
  product_variants: [
    { size: 'M', color: 'Black', stock: 10 },
    { size: 'L', color: 'Black', stock: 5 },
    { size: 'XL', color: 'Black', stock: 2 },
    { size: 'M', color: 'Navy', stock: 8 },
    { size: 'L', color: 'Navy', stock: 0 },
  ],
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7782-XJ',
    product_id: 'prod_123456',
    shop_id: 'shop_01',
    customer_name: 'Aayush Shrestha',
    customer_phone: '9841234567',
    customer_district: 'Kathmandu',
    customer_location: 'Baneshwor, near Eyeplex Mall',
    size: 'M',
    color: 'Black',
    quantity: 1,
    total_price: 4500,
    payment_method: 'COD',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    product: {
      name: 'Vintage Puffer Jacket - North Face',
      productImages: [
        {
          url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
  },
  {
    id: 'ORD-9921-MC',
    product_id: 'prod_987654',
    shop_id: 'shop_01',
    customer_name: 'Sita Sharma',
    customer_phone: '9801987654',
    customer_district: 'Lalitpur',
    customer_location: 'Jhamsikhel, Ward 3',
    size: 'L',
    color: 'Navy',
    quantity: 1,
    total_price: 4500,
    payment_method: 'QR',
    status: 'confirmed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    product: {
      name: 'Vintage Puffer Jacket - North Face',
      productImages: [
        {
          url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
  },
  {
    id: 'ORD-3321-KL',
    product_id: 'prod_555555',
    shop_id: 'shop_01',
    customer_name: 'Rohan Gurung',
    customer_phone: '9812341234',
    customer_district: 'Bhaktapur',
    customer_location: 'Suryabinayak',
    size: 'XL',
    color: 'Black',
    quantity: 1,
    total_price: 4500,
    payment_method: 'COD',
    status: 'delivered',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    product: {
      name: 'Vintage Puffer Jacket - North Face',
      productImages: [
        {
          url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
  },
  {
    id: 'ORD-1100-AB',
    product_id: 'prod_123456',
    shop_id: 'shop_01',
    customer_name: 'Nabin Bhattarai',
    customer_phone: '9860112233',
    customer_district: 'Kathmandu',
    customer_location: 'Kalanki, Chowk',
    size: 'M',
    color: 'Black',
    quantity: 1,
    total_price: 4500,
    payment_method: 'COD',
    status: 'cancelled',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    product: {
      name: 'Vintage Puffer Jacket - North Face',
      productImages: [
        {
          url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
  },
];
