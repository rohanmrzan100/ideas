import React from 'react';
import ProductForm from '../components/ProductForm';
// Make sure the path matches where you saved the component

export default function CreateProductPage() {
  // In a real app, you would get this from your auth session or the URL
  // e.g. const shopId = params.shopId;
  const DEMO_SHOP_ID = 'shop-uuid-1234-5678';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Container for the page content. 
        We use a specific width to keep the form readable.
      */}
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back Navigation */}
        <div className="max-w-4xl mx-auto mb-6 flex items-center gap-2 text-sm text-gray-500">
          <a href="/dashboard" className="hover:text-blue-600 transition">
            Dashboard
          </a>
          <span>/</span>
          <a href="/products" className="hover:text-blue-600 transition">
            Products
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">New</span>
        </div>

        {/* Render the Form */}
        <ProductForm shopId={DEMO_SHOP_ID} />
      </div>
    </div>
  );
}
