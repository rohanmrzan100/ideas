'use client';

import { ProductFormValues } from '@/app/dashboard/product/page';
import VariantGenerator from '@/components/seller/VariantGenerator';
import { ArrowDownToLine, Layers, Package, Plus, Trash2 } from 'lucide-react';
import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

type ProductVariant = {
  size: string;
  color: string;
  stock: number;
};

type InventoryVariantsProps = {
  control: Control<ProductFormValues, unknown, ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  getValues: UseFormGetValues<ProductFormValues>;
};

export default function InventoryVariants({
  control,
  register,
  watch,
  getValues,
}: InventoryVariantsProps) {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'product_variants',
  });

  const handleBulkGenerate = (variants: ProductVariant[]) => {
    if (fields.length > 0) {
      const confirmed = window.confirm(
        'This will replace your current variant list. Are you sure?',
      );
      if (!confirmed) return;
    }
    replace(variants);
  };

  const handleBulkStockUpdate = () => {
    const firstStock = getValues('product_variants.0.stock');
    if (firstStock !== undefined) {
      const updated = getValues('product_variants').map((v: any) => ({
        ...v,
        stock: firstStock,
      }));
      replace(updated);
    }
  };

  return (
    <section className="bg-white rounded-md border border-gray-200 p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Inventory</h2>
          </div>
        </div>
      </div>

      <VariantGenerator onGenerate={handleBulkGenerate} />

      <div className="mt-6 border border-gray-200 rounded-md overflow-hidden bg-white">
        <div className="grid grid-cols-12 gap-4 bg-gray-50/80 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Size</div>
          <div className="col-span-4">Color</div>
          <div className="col-span-4 flex items-center gap-1">
            Stock
            {fields.length > 1 && (
              <button
                type="button"
                onClick={handleBulkStockUpdate}
                title="Copy first row stock to all"
                className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-brand transition"
              >
                <ArrowDownToLine size={14} />
              </button>
            )}
          </div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        <div className="divide-y divide-gray-100">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50/50 transition-colors group"
            >
              <div className="col-span-3">
                <input
                  {...register(`product_variants.${index}.size` as const, { required: true })}
                  placeholder="Size"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div className="col-span-4 relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: watch(`product_variants.${index}.color`) }}
                />
                <input
                  {...register(`product_variants.${index}.color` as const, { required: true })}
                  placeholder="Color"
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div className="col-span-4">
                <input
                  type="number"
                  {...register(`product_variants.${index}.stock` as const, {
                    required: true,
                    min: 0,
                  })}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-100 md:opacity-0 group-hover:opacity-100"
                  disabled={fields.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="p-8 text-center text-gray-400 bg-gray-50/30">
            <Package size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No variants added yet. Use the generator above.</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => append({ size: '', color: '', stock: 0 })}
        className="mt-4 flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-primary/80 transition px-2 py-1"
      >
        <Plus size={16} /> Add Another Variant
      </button>
    </section>
  );
}
