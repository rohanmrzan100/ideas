import { Order } from '@/api/orders';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { OrderPreview } from './order-preview';
import { OrderEditForm } from './order-edit';

interface OrderDetailsSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsSheetProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Reset to preview mode whenever a new order is opened
  useEffect(() => {
    if (open) setIsEditing(false);
  }, [open, order]);

  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-xl p-0 overflow-hidden bg-white border-l border-gray-200"
        side="right"
      >
        {isEditing ? (
          <OrderEditForm
            order={order}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => {
              setIsEditing(false);
              onOpenChange(false);
            }}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <OrderPreview order={order} onEdit={() => setIsEditing(true)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
