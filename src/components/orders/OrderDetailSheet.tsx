import { Order } from '@/api/orders';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import EditOrderPage from './order-edit';
import { OrderPreview } from './order-preview';

interface OrderDetailsSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: 'preview' | 'edit';
}

export function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
  initialMode = 'preview',
}: OrderDetailsSheetProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Reset to the initial mode whenever a new order is opened
  useEffect(() => {
    if (open) {
      setIsEditing(initialMode === 'edit');
    }
  }, [open, order?.id, initialMode]);

  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 overflow-hidden border-l border-gray-200 flex flex-col h-full"
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
              <EditOrderPage
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
