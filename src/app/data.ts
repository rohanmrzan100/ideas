// lib/data.ts

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

export type Product = {
  name: string;
  id: string;
  description: string;
  price: string;
  shop_id: string;
  productImages: ProductImages[];

  open_graph_image: string | null;
  [key: string]: unknown;
  product_variants: ProductVariant[];
};

export const products: Product[] = [
  {
    id: '4f53243f-6483-43ef-988d-b5bd8cb6d421',
    name: 'Winter Jacket',
    description: 'Warm and cozy',
    shop_id: 'f9906287-ea84-4eaa-949d-a5508bc3af99',
    open_graph_image: null,
    price: '99.99',
    display_price: null,
    product_variants: [
      {
        id: '69977c98-17aa-4c4b-98a9-d3ce5b30c2e3',
        sku: 'winter-jac-black-m',
        size: 'M',
        color: 'Black',
        stock: 10,
        product_id: '4f53243f-6483-43ef-988d-b5bd8cb6d421',
        created_at: '2025-12-28T00:41:35.661Z',
        updated_at: '2025-12-28T00:41:35.661Z',
      },
      {
        id: '1e06e65e-623b-4a93-9837-2623b3aea500',
        sku: 'winter-jac-black-l',
        size: 'L',
        color: 'Black',
        stock: 5,
        product_id: '4f53243f-6483-43ef-988d-b5bd8cb6d421',
        created_at: '2025-12-28T00:41:35.661Z',
        updated_at: '2025-12-28T00:41:35.661Z',
      },
    ],
    productImages: [
      {
        id: 'b3d3bf14-3b21-4c7f-8524-ca54ca66edd0',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766899856/Insta-Shop/oqiwpsjwijzdlbtgoejb.jpg',
        cloudinary_public_id: 'jacket_123',
        position: 0,
        product_id: '4f53243f-6483-43ef-988d-b5bd8cb6d421',
      },
      {
        id: 'eae26028-0c0d-4b7e-b643-5e9624af948b',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766899856/Insta-Shop/oqiwpsjwijzdlbtgoejb.jpg',
        cloudinary_public_id: 'jacket_back_456',
        position: 1,
        product_id: '4f53243f-6483-43ef-988d-b5bd8cb6d421',
      },
    ],
  },
  {
    id: '371780fb-8bb0-4924-963b-ef791c33eb12',
    name: 'Winter Jacket',
    description: 'Warm and cozy',
    shop_id: 'f9906287-ea84-4eaa-949d-a5508bc3af99',
    open_graph_image: null,
    price: '99.99',
    display_price: null,
    product_variants: [
      {
        id: 'a2294b83-a393-48d1-9271-0e78a155271e',
        sku: 'f9-winter-jac-black-m',
        size: 'M',
        color: 'Black',
        stock: 10,
        product_id: '371780fb-8bb0-4924-963b-ef791c33eb12',
        created_at: '2025-12-28T02:11:04.789Z',
        updated_at: '2025-12-28T02:11:04.789Z',
      },
      {
        id: 'b0a8dcb6-f76e-4d1a-9cd2-ac5e2679b5fe',
        sku: 'f9-winter-jac-black-l',
        size: 'L',
        color: 'Black',
        stock: 5,
        product_id: '371780fb-8bb0-4924-963b-ef791c33eb12',
        created_at: '2025-12-28T02:11:04.789Z',
        updated_at: '2025-12-28T02:11:04.789Z',
      },
    ],
    productImages: [
      {
        id: 'ccede31e-3845-45b1-a4c4-810f6e0d5a1a',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766899856/Insta-Shop/oqiwpsjwijzdlbtgoejb.jpg',
        cloudinary_public_id: 'jacket_123',
        position: 0,
        product_id: '371780fb-8bb0-4924-963b-ef791c33eb12',
      },
      {
        id: 'de7b3e8f-76e4-40e2-b85d-cb1fb85d0db7',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766899856/Insta-Shop/oqiwpsjwijzdlbtgoejb.jpg',
        cloudinary_public_id: 'jacket_back_456',
        position: 1,
        product_id: '371780fb-8bb0-4924-963b-ef791c33eb12',
      },
    ],
  },
  {
    id: '94f86c77-bfb8-4b62-b936-3260835535e7',
    name: 'Winter Jacket',
    description: 'Warm and cozy',
    shop_id: 'f9906287-ea84-4eaa-949d-a5508bc3af99',
    open_graph_image:
      'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766908744/Insta-Shop/mvikbvjk5rtk1mogaxjo.jpg',
    price: '99.99',
    display_price: null,
    product_variants: [
      {
        id: '2a2c5bd1-dc4d-4e23-9e42-598a25e3cd85',
        sku: '97-winter-jac-black-m',
        size: 'M',
        color: 'Black',
        stock: 10,
        product_id: '94f86c77-bfb8-4b62-b936-3260835535e7',
        created_at: '2025-12-28T02:14:05.055Z',
        updated_at: '2025-12-28T02:14:05.055Z',
      },
      {
        id: '64d2bd59-8aa1-4b01-9ba2-dffd9b5a8cc0',
        sku: '97-winter-jac-black-l',
        size: 'L',
        color: 'Black',
        stock: 5,
        product_id: '94f86c77-bfb8-4b62-b936-3260835535e7',
        created_at: '2025-12-28T02:14:05.055Z',
        updated_at: '2025-12-28T02:14:05.055Z',
      },
    ],
    productImages: [
      {
        id: 'ef55b9a1-1712-4bfa-9cbd-3d8255a164e8',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766899856/Insta-Shop/oqiwpsjwijzdlbtgoejb.jpg',
        cloudinary_public_id: 'jacket_123',
        position: 0,
        product_id: '94f86c77-bfb8-4b62-b936-3260835535e7',
      },
      {
        id: 'e31c9a3f-492a-4464-ba86-96d2a1592828',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766899856/Insta-Shop/oqiwpsjwijzdlbtgoejb.jpg',
        cloudinary_public_id: 'jacket_back_456',
        position: 1,
        product_id: '94f86c77-bfb8-4b62-b936-3260835535e7',
      },
    ],
  },
  {
    id: 'a5d7c0f4-5b2e-46e9-bc77-d134f4a839cb',
    name: 'Winter Jacket',
    description: 'Warm and cozy',
    shop_id: 'f9906287-ea84-4eaa-949d-a5508bc3af99',
    open_graph_image:
      'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766909710/Insta-Shop/effjezamljevddpkfj1b.jpg',
    price: '99.99',
    display_price: null,
    product_variants: [
      {
        id: 'f6d11208-cdba-44ba-b505-aa465370c041',
        sku: '80-winter-jac-black-m',
        size: 'M',
        color: 'Black',
        stock: 10,
        product_id: 'a5d7c0f4-5b2e-46e9-bc77-d134f4a839cb',
        created_at: '2025-12-28T02:30:13.398Z',
        updated_at: '2025-12-28T02:30:13.398Z',
      },
      {
        id: 'b11196e4-a18c-4ee6-9e5b-c26b0406ca7f',
        sku: '80-winter-jac-black-l',
        size: 'L',
        color: 'Black',
        stock: 5,
        product_id: 'a5d7c0f4-5b2e-46e9-bc77-d134f4a839cb',
        created_at: '2025-12-28T02:30:13.398Z',
        updated_at: '2025-12-28T02:30:13.398Z',
      },
    ],
    productImages: [
      {
        id: 'ddabd010-3e1b-467d-a635-5bd4737e5980',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766905441/Insta-Shop/jdzaanvcnxsu5zf4chxc.jpg',
        cloudinary_public_id: 'jacket_123',
        position: 0,
        product_id: 'a5d7c0f4-5b2e-46e9-bc77-d134f4a839cb',
      },
      {
        id: 'a93b2b4f-826c-4079-a673-32a509e6ce91',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766905441/Insta-Shop/jdzaanvcnxsu5zf4chxc.jpg',
        cloudinary_public_id: 'jacket_back_456',
        position: 1,
        product_id: 'a5d7c0f4-5b2e-46e9-bc77-d134f4a839cb',
      },
    ],
  },
  {
    id: '6290e672-ffa6-43a7-b14b-56a8876a3a4a',
    name: 'Winter Jacket',
    description: 'Warm and cozy',
    shop_id: 'f9906287-ea84-4eaa-949d-a5508bc3af99',
    open_graph_image:
      'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766910300/Insta-Shop/t6y7yppmpusyilmxpna7.jpg',
    price: '99.99',
    display_price: null,
    product_variants: [
      {
        id: 'bd4c2beb-075e-46cf-9b30-2acccb15950a',
        sku: '28-winter-jac-black-m',
        size: 'M',
        color: 'Black',
        stock: 10,
        product_id: '6290e672-ffa6-43a7-b14b-56a8876a3a4a',
        created_at: '2025-12-28T02:40:02.287Z',
        updated_at: '2025-12-28T02:40:02.287Z',
      },
      {
        id: '0713b632-10a5-4990-8a1e-0c57ccff8db9',
        sku: '28-winter-jac-black-l',
        size: 'L',
        color: 'Black',
        stock: 5,
        product_id: '6290e672-ffa6-43a7-b14b-56a8876a3a4a',
        created_at: '2025-12-28T02:40:02.287Z',
        updated_at: '2025-12-28T02:40:02.287Z',
      },
    ],
    productImages: [
      {
        id: '75f5e349-334e-42bc-a053-6810a29c825d',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766910262/Insta-Shop/tbwq4vk4d6wv1dqf57bi.jpg',
        cloudinary_public_id: 'jacket_back_456',
        position: 1,
        product_id: '6290e672-ffa6-43a7-b14b-56a8876a3a4a',
      },
      {
        id: '6f3e4ad4-67e6-45c6-a8e0-947f096ea479',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766910242/Insta-Shop/xotdfkifawflqcwpqanw.jpg',
        cloudinary_public_id: 'jacket_123',
        position: 2,
        product_id: '6290e672-ffa6-43a7-b14b-56a8876a3a4a',
      },
    ],
  },
  {
    id: 'd9f21001-6c70-4c10-b0a3-f0d3c7b6c455',
    name: 'Black Carpet',
    description: 'Warm and cozy',
    shop_id: 'f9906287-ea84-4eaa-949d-a5508bc3af99',
    open_graph_image:
      'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766910385/Insta-Shop/trivhmnnmhw0mppyvcu2.jpg',
    price: '2000.00',
    display_price: '3000.00',
    product_variants: [
      {
        id: 'e25a2b9e-8f30-46ad-9f0c-331e018c2c6b',
        sku: '72-black-carp-black-m',
        size: 'M',
        color: 'Black',
        stock: 10,
        product_id: 'd9f21001-6c70-4c10-b0a3-f0d3c7b6c455',
        created_at: '2025-12-28T02:41:26.656Z',
        updated_at: '2025-12-28T02:41:26.656Z',
      },
      {
        id: 'd6056999-6c80-47e4-a4f8-5a8369d87423',
        sku: '72-black-carp-black-l',
        size: 'L',
        color: 'Black',
        stock: 5,
        product_id: 'd9f21001-6c70-4c10-b0a3-f0d3c7b6c455',
        created_at: '2025-12-28T02:41:26.656Z',
        updated_at: '2025-12-28T02:41:26.656Z',
      },
    ],
    productImages: [
      {
        id: '40326d41-4d0b-47a8-8d54-01bde4efe4b9',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766910262/Insta-Shop/tbwq4vk4d6wv1dqf57bi.jpg',
        cloudinary_public_id: 'jacket_back_456',
        position: 1,
        product_id: 'd9f21001-6c70-4c10-b0a3-f0d3c7b6c455',
      },
      {
        id: 'bdf3218b-fb50-4898-a6de-95dde5e49829',
        url: 'https://res.cloudinary.com/df2zfm1f2/image/upload/v1766910242/Insta-Shop/xotdfkifawflqcwpqanw.jpg',
        cloudinary_public_id: 'jacket_123',
        position: 2,
        product_id: 'd9f21001-6c70-4c10-b0a3-f0d3c7b6c455',
      },
    ],
  },
];

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return products.find((p) => p.name.toLowerCase().replace(/ /g, '-') === slug);
}
