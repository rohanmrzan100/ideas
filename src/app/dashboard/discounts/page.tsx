'use client';

import { useState } from 'react';
import { Plus, Tag, Ticket, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function DiscountsPage() {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, uses: 45, status: 'active' },
    { id: 2, code: 'FLAT500', type: 'fixed', value: 500, uses: 12, status: 'active' },
  ]);

  const handleDelete = (id: number) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success('Coupon deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <p className="text-sm text-gray-500">Manage coupon codes and promotions.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-brand text-white gap-2">
              <Plus size={18} /> Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Coupon Code</label>
                <Input placeholder="e.g. SUMMER2024" className="uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Discount Type</label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Value</label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <Button className="w-full bg-brand" onClick={() => toast.success('Coupon Created!')}>
                Save Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <Ticket size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-900">{coupon.code}</h3>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">
                    {coupon.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {coupon.type === 'percentage'
                    ? `${coupon.value}% Off`
                    : `Rs. ${coupon.value} Off`}{' '}
                  • Used {coupon.uses} times
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);
                  toast.success('Copied to clipboard');
                }}
              >
                <Copy size={18} className="text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                <Trash2 size={18} className="text-red-400 hover:text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
