'use client';

import { useState } from 'react';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Download,
  User,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock Data
const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '9841234567',
    orders: 15,
    spent: 125000,
    city: 'Kathmandu',
    lastOrder: '2 days ago',
  },
  {
    id: '2',
    name: 'Sita Adhikari',
    email: 'sita@example.com',
    phone: '9801234567',
    orders: 2,
    spent: 3400,
    city: 'Pokhara',
    lastOrder: '1 month ago',
  },
  {
    id: '3',
    name: 'Hari Bahadur',
    email: 'hari@example.com',
    phone: '9812345678',
    orders: 12,
    spent: 45000,
    city: 'Lalitpur',
    lastOrder: '5 days ago',
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your customer relationships and view history.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-white">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search customers..."
              className="pl-10 bg-white border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Location</th>
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
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((customer) => {
                const isVip = customer.spent > 50000;
                return (
                  <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                            isVip
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                              : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                          }`}
                        >
                          {customer.name.charAt(0)}
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
                      <div className="flex flex-col gap-1 text-gray-600 text-xs">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-gray-400" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-gray-400" /> {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2 bg-gray-100 w-fit px-2 py-1 rounded text-xs font-medium">
                        <MapPin size={12} /> {customer.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{customer.orders}</span>
                      <p className="text-[10px] text-gray-400">Last: {customer.lastOrder}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      Rs. {customer.spent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-900"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
