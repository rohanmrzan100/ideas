import { Search, X } from 'lucide-react';

interface OrderToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function OrderToolbar({ searchTerm, onSearchChange }: OrderToolbarProps) {
  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
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
      {/* Add Filter Dropdowns here in the future */}
    </div>
  );
}
