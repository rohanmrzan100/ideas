import { OrderStatus } from '@/api/orders';
import { Search, X, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface OrderToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function OrderToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: OrderToolbarProps) {
  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Filter by name, phone or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-10 py-2 rounded-md border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition text-sm bg-white"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Filter size={14} />
          <span>Filters:</span>
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-white h-10 border-gray-200">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Orders</SelectItem>
            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
            <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
