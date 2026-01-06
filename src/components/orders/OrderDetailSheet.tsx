import { Order } from '@/api/orders';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { OrderPreview } from './order-preview';
import { OrderEditForm } from './order-edit';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderDetailsSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsSheetProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Reset to preview mode whenever a new order is opened
  useEffect(() => {
    if (open) {
      setIsEditing(false);
    }
  }, [open, order?.id]); // Added order.id to dependency

  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-2xl p-0 overflow-hidden  border-l border-gray-200"
        side="right"
      >
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <OrderEditForm
                order={order}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => {
                  setIsEditing(false);
                  onOpenChange(false);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              <OrderPreview order={order} onEdit={() => setIsEditing(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
