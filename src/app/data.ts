export type ProductVariant = {
  sku: string;
  size: string;
  color: string;
  stock: number;
  id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
};
export type ProductImages = {
  id: string;
  product_id: string;
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
  price: string;
  display_price: number | null;
  shop_id: string;
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
