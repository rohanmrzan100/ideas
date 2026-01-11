'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquareText, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen h-screen  flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header Section */}
        <div className="bg-brand/5 p-8 text-center border-b border-gray-100">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <CheckCircle2 size={40} className="text-green-600" strokeWidth={3} />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-500 font-medium">Your order has been placed successfully.</p>
        </div>

        {/* Info Content */}
        <div className="p-6 space-y-4">
          {/* SMS Notification Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100"
          >
            <div className="bg-white p-2.5 rounded-full text-blue-600 shadow-sm shrink-0">
              <MessageSquareText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Confirmation Sent</h3>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">
                We have sent an order confirmation message to your registered phone number.
              </p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-4"
          >
            <Link href="/">
              <Button className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-brand/20 bg-brand hover:bg-brand-primary/90 transition-all active:scale-[0.98]">
                <ShoppingBag size={18} className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
