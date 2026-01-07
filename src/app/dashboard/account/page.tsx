'use client';

import { useAppSelector } from '@/store/hooks';
import { User, Lock, Mail, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AccountPage() {
  const user = useAppSelector((s) => s.app.user);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your personal details and security.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="font-bold text-lg flex items-center gap-2 pb-4 border-b">
          <User size={20} /> Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input defaultValue={user?.name} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input defaultValue="9800000000" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input defaultValue="user@example.com" className="pl-9" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={() => toast.success('Profile updated')}>
            Update Profile
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="font-bold text-lg flex items-center gap-2 pb-4 border-b">
          <Lock size={20} /> Security
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => toast.success('Password changed')}>
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
