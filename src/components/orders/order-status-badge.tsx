import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/api/orders';
import { Check, Clock, Package, Truck, X } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string; icon: React.ReactNode }> = {
    [OrderStatus.PENDING]: { 
      label: 'Pending', 
      variant: 'outline', 
      className: 'text-yellow-600 border-yellow-200 bg-yellow-50',
      icon: <Clock size={10} className="mr-1" />
    },
    [OrderStatus.CONFIRMED]: { 
      label: 'Confirmed', 
      variant: 'secondary', 
      className: 'text-blue-700 bg-blue-50 hover:bg-blue-100',
      icon: <Check size={10} className="mr-1" />
    },
    [OrderStatus.SHIPPED]: { 
      label: 'Shipped', 
      variant: 'secondary', 
      className: 'text-purple-700 bg-purple-50 hover:bg-purple-100',
      icon: <Truck size={10} className="mr-1" />
    },
    [OrderStatus.DELIVERED]: { 
      label: 'Delivered', 
      variant: 'default', 
      className: 'bg-green-600 hover:bg-green-700 text-white', 
      icon: <Package size={10} className="mr-1" />
    },
    [OrderStatus.CANCELLED]: { 
      label: 'Cancelled', 
      variant: 'destructive', 
      className: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100 border shadow-none',
      icon: <X size={10} className="mr-1" />
    },
  };

  const statusConfig = config[status as OrderStatus] || { label: status, variant: 'outline', icon: null };

  return (
    <Badge 
      variant={statusConfig.variant} 
      className={`px-2 py-0.5 text-xs font-semibold transition-colors flex w-fit items-center ${statusConfig.className || ''}`}
    >
      {statusConfig.icon}
      {statusConfig.label}
    </Badge>
  );
}