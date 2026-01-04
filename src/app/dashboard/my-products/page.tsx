'use client';

import { handleDeleteProduct, Product } from '@/api/products';
import { fetchShopProducts } from '@/api/shop';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAppSelector } from '@/store/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Edit,
  Eye,
  Filter,
  Loader2,
  PackageX,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MyProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';
  const queryClient = useQueryClient();
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shop-products', activeShopId], // Unique key for caching
    queryFn: () => fetchShopProducts(activeShopId),
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteMutation = useMutation({
    mutationFn: handleDeleteProduct,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      toast.success('Deleted successfully');
    },
    onError: (error) => {
      console.warn(error.message);
      toast.error('Error deleting product');
    },
  });
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your inventory, prices, and stock levels.
          </p>
        </div>
        <Link
          href="/dashboard/product"
          className="inline-flex items-center justify-center gap-2 bg-brand text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-primary/90 transition shadow-sm"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      {products.length < 1 ? (
        <h1>No Products found in the shop. Please add some products first</h1>
      ) : (
        <>
          {/* Data Table Area */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-100 relative">
            <div className="bg-white p-4 rounded-xl  flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition text-sm"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition bg-white">
                  <Filter size={16} />
                  Filters
                </button>
              </div>
            </div>
            {/* 1. Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 text-gray-400">
                <Loader2 size={32} className="animate-spin mb-2 text-brand" />
                <p className="text-sm">Syncing inventory...</p>
              </div>
            )}

            {/* 2. Error State */}
            {isError && (
              <div className="flex flex-col items-center justify-center h-96 text-red-500">
                <AlertCircle size={32} className="mb-2" />
                <p className="font-medium">Failed to load products</p>
                <p className="text-sm opacity-80">
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <ProductRow
                            key={product.id}
                            product={product}
                            handleDelete={(id) => deleteMutation.mutate(id)}
                            isDeleting={deleteMutation.isPending}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                <PackageX size={20} className="opacity-50" />
                              </div>
                              <p>No products found matching &quot;{searchTerm}&quot;</p>
                              <button
                                onClick={() => setSearchTerm('')}
                                className="text-brand text-sm font-bold hover:underline"
                              >
                                Clear Search
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <p className="text-sm text-gray-500">
                      Showing{' '}
                      <span className="font-bold text-gray-900">{filteredProducts.length}</span>{' '}
                      results
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white disabled:opacity-50 text-gray-500"
                        disabled
                      >
                        Previous
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-gray-600">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProductRow({
  product,
  handleDelete,
  isDeleting,
}: {
  product: Product;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const totalStock = product.product_variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
  const variantCount = product.product_variants?.length || 0;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock < 10;
  const coverImage =
    product.productImages?.find((img) => img.position === 0)?.url ||
    product.productImages?.[0]?.url;

  return (
    <tr className="group hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
            {coverImage ? (
              <Image src={coverImage} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <span className="text-[8px] font-bold">NO IMG</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              {product.description || 'No description'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">Rs. {product.price}</span>
          {product.display_price && Number(product.display_price) > Number(product.price) && (
            <span className="text-xs text-gray-400 line-through">Rs. {product.display_price}</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600 font-medium">{totalStock} units</span>
        <div className="text-xs text-gray-400 mt-0.5">{variantCount} variants</div>
      </td>
      <td className="px-6 py-4">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Low Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Active
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2  transition-opacity">
          <Link
            href={`/dashboard/product/${product.id}/preview`}
            className="p-2 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-lg transition"
          >
            <Eye size={18} />
          </Link>
          <Link
            href={`/dashboard/product/${product.id}/edit`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Edit size={18} />
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Link
                href={`/dashboard/product/${product.id}/preview`}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={18} />
              </Link>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete this product permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}
