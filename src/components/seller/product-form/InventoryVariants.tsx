'use client';

import { ProductFormValues } from '@/app/dashboard/add-product/page';
import VariantGenerator from '@/components/seller/VariantGenerator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Layers, Package, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

type InventoryVariantsProps = {
  control: Control<ProductFormValues, unknown, ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  getValues: UseFormGetValues<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  suggestedColors: string[];
};

export default function InventoryVariants({
  control,
  register,
  watch,
  getValues,
  setValue,
  suggestedColors,
}: InventoryVariantsProps) {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'product_variants',
  });

  const handleBulkGenerate = (variants: { size: string; color: string; stock: number }[]) => {
    replace(variants);
  };

  return (
    <section>
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand shadow-sm">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Inventory & Variants</h2>
            <p className="text-sm text-gray-500">Manage sizes, colors, and stock levels.</p>
          </div>
        </div>

        <VariantGenerator onGenerate={handleBulkGenerate} suggestedColors={suggestedColors} />
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <div className="col-span-3 pl-1">Size</div>
            <div className="col-span-5">Color</div>
            <div className="col-span-3">Stock</div>
            <div className="col-span-1"></div>
          </div>

          {fields.map((field, index) => {
            const currentColor = watch(`product_variants.${index}.color`);
            const currentStock = watch(`product_variants.${index}.stock`);

            return (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-4 items-center group animate-in slide-in-from-left-2 duration-300"
              >
                {/* FIX: Register Hidden ID to prevent data loss on update */}
                <input type="hidden" {...register(`product_variants.${index}.id` as const)} />

                <div className="col-span-3">
                  <input
                    {...register(`product_variants.${index}.size` as const, { required: true })}
                    placeholder="Size"
                    className="w-full h-11 px-4 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 text-sm font-medium transition-all outline-none placeholder:text-gray-400"
                  />
                </div>

                <div className="col-span-5 relative">
                  <ColorInput
                    index={index}
                    register={register}
                    setValue={setValue}
                    currentColor={currentColor}
                    suggestedColors={suggestedColors}
                  />
                </div>

                <div className="col-span-3">
                  <div className="relative group/stock">
                    <input
                      type="number"
                      {...register(`product_variants.${index}.stock` as const, {
                        required: true,
                        min: 0,
                      })}
                      placeholder="0"
                      className={cn(
                        'w-full h-11 pl-4 pr-12 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 text-sm font-medium transition-all outline-none',
                        currentStock < 5 &&
                          currentStock > 0 &&
                          'text-amber-600 bg-amber-50/30 border-amber-200',
                        currentStock == 0 && 'text-gray-400',
                      )}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none group-focus-within/stock:text-brand/50">
                      units
                    </span>
                  </div>
                </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    disabled={fields.length === 1}
                    title="Remove variant"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {fields.length === 0 && (
          <div className="py-12 text-center flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <Package size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">No variants added yet.</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => append({ size: '', color: '', stock: 0 })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 hover:text-gray-900 transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Plus size={12} />
            </div>
            Add Another Variant
          </button>
        </div>
      </div>
    </section>
  );
}

function ColorInput({
  index,
  register,
  setValue,
  currentColor,
  suggestedColors,
}: {
  index: number;
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  currentColor: string;
  suggestedColors: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full h-11 relative cursor-pointer group/input">
          <input
            {...register(`product_variants.${index}.color`, { required: true })}
            type="text"
            className="sr-only"
            readOnly
          />
          <div
            className={cn(
              'w-full h-full rounded-xl border border-gray-200 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]',
              !currentColor && 'bg-white flex items-center justify-center',
            )}
            style={{ backgroundColor: currentColor || undefined }}
          >
            {!currentColor && (
              <span className="text-gray-400 text-sm font-medium">Select Color</span>
            )}
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[240px]" align="start" side="bottom" sideOffset={5}>
        <Command>
          <CommandInput placeholder="Search or type hex..." className="h-9 text-xs" />
          <CommandList>
            <CommandEmpty className="p-3 text-xs text-gray-500 text-center">
              No matching color found.
            </CommandEmpty>
            {suggestedColors.length > 0 && (
              <CommandGroup heading="Suggested Colors">
                <div className="flex flex-wrap gap-2 p-2">
                  {suggestedColors.map((hex) => (
                    <CommandItem
                      key={hex}
                      value={hex}
                      onSelect={() => {
                        setValue(`product_variants.${index}.color`, hex);
                        setOpen(false);
                      }}
                      className="cursor-pointer p-0 w-8 h-8 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform flex items-center justify-center aria-selected:bg-transparent relative"
                      title={hex}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="sr-only">{hex}</span>
                      {currentColor === hex && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                          <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
                        </div>
                      )}
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
