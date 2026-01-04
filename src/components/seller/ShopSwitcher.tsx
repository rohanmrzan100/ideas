'use client';

import { createShop, fetchMyShops } from '@/api/shop';
import { Shop } from '@/api/shop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveShopId } from '@/store/slices/app.slice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, PlusCircle, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// --- Types ---
interface CreateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  isSubmitting: boolean;
}

// --- Modal Component ---
function CreateShopModal({ isOpen, onClose, onCreate, isSubmitting }: CreateShopModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>();

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: { name: string }) => {
    onCreate(data.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-in zoom-in-95 duration-200 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Store</h3>
        <p className="text-sm text-gray-500 mb-6">
          Enter a unique name for your new store to manage products separately.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Store Name</label>
            <Input
              {...register('name', { required: 'Store name is required' })}
              placeholder="e.g. TNT Store"
              className="bg-gray-50"
              autoFocus
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand text-white min-w-30">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Store'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Switcher Component ---
export default function ShopSwitcher() {
  const dispatch = useAppDispatch();
  // FIX 1: Correct Selector usage (select from state, don't read localStorage here)
  const activeShopId = useAppSelector((state) => state.app.activeShopId);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: shops = [] } = useQuery({
    queryKey: ['my-shops'],
    queryFn: fetchMyShops,
  });

  const { mutate: createShopMutation, isPending } = useMutation({
    mutationFn: (name: string) => createShop(name),
    onSuccess: (newShop) => {
      queryClient.invalidateQueries({ queryKey: ['my-shops'] });
      dispatch(setActiveShopId(newShop.id));
      localStorage.setItem('activeShopId', newShop.id);
      setIsModalOpen(false);
    },
  });

  useEffect(() => {
    if (!activeShopId) {
      const storedId = localStorage.getItem('activeShopId');
      if (storedId) {
        dispatch(setActiveShopId(storedId));
        return;
      }
    }

    if (!activeShopId && shops.length > 0) {
      const firstShopId = shops[0].id;
      dispatch(setActiveShopId(firstShopId));
    }
  }, [activeShopId, shops, dispatch]);

  const handleValueChange = (val: string) => {
    if (val === 'create_new') {
      setIsModalOpen(true);
    } else {
      dispatch(setActiveShopId(val));
    }
  };

  return (
    <>
      <div className="w-full mt-4 px-4 pb-2">
        <Select value={activeShopId || ''} onValueChange={handleValueChange} disabled={isPending}>
          <SelectTrigger className="w-full bg-[#F3E79A]/30 border-none h-11 text-sm rounded-lg hover:bg-[#F3E79A]/50 transition-colors focus:ring-0 focus:ring-offset-0">
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <div className="w-6 h-6 rounded bg-gray-900/10 flex items-center justify-center text-gray-700 shrink-0">
                <Store size={14} />
              </div>
              <span className="font-bold truncate text-gray-900 flex-1 text-left">
                <SelectValue placeholder="Select Store" />
              </span>
            </div>
          </SelectTrigger>

          {/* Added positioning props for proper alignment */}
          <SelectContent className="min-w-60" position="popper" align="start" sideOffset={5}>
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">My Stores</div>

            {shops.length === 0 && (
              <div className="px-2 py-2 text-sm text-gray-400 italic text-center">
                No stores found
              </div>
            )}

            {shops.map((shop: Shop) => (
              <SelectItem key={shop.id} value={shop.id} className="cursor-pointer font-medium">
                {shop.name}
              </SelectItem>
            ))}

            <SelectSeparator className="my-2" />

            <SelectItem
              value="create_new"
              className="text-brand font-bold focus:bg-brand/5 focus:text-brand cursor-pointer"
            >
              <div className="flex items-center gap-2 text-inherit">
                <PlusCircle size={16} />
                Create New Store
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CreateShopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(name) => createShopMutation(name)}
        isSubmitting={isPending}
      />
    </>
  );
}
