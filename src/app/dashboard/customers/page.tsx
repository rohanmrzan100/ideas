'use client';

import { fetchCustomers } from '@/api/customers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowUpDown,
  Download,
  Filter,
  Loader2,
  MapPin,
  Phone,
  Search,
} from 'lucide-react';
import { useState } from 'react';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: customers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm),
  );

  const handleExport = () => {
    return;
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">People who have purchased from your store.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-white"
            onClick={handleExport}
            disabled={customers.length === 0}
          >
            <Download size={16} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px] relative">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name or phone..."
              className="pl-10 bg-white border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <Loader2 className="animate-spin text-brand" size={32} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <AlertCircle size={32} className="mb-2" />
              <p>Failed to load customers</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No customers found matching your search.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Last Location</th>
                  <th className="px-6 py-4">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      Orders <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-6 py-4">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      Total Spent <ArrowUpDown size={12} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((customer) => {
                  const isVip = customer.total_spent > 50000;
                  return (
                    <tr
                      key={customer.phone}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                              isVip
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                            }`}
                          >
                            {customer.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{customer.name}</span>
                            {isVip && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                VIP
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" /> {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2 bg-gray-100 w-fit px-2 py-1 rounded text-xs font-medium max-w-[200px] truncate">
                          <MapPin size={12} /> {customer.address || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{customer.total_orders}</span>
                        <p className="text-[10px] text-gray-400">
                          Last: {format(new Date(customer.last_order_at), 'MMM dd')}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        Rs. {customer.total_spent.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
