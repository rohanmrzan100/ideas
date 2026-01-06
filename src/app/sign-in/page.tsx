'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constants';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/app.slice';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Phone,
  Store,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// --- Types ---

type SignInData = {
  phone_number: string;
  password: string;
};

// --- Components ---

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();

  const onSubmit = async (data: SignInData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      dispatch(setUser(result.data));
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setLoginError(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-[#0F172A] selection:text-white">
      {/* --- LEFT SIDE: Form Section --- */}

      <div className="hidden lg:flex flex-col justify-center items-center w-[50%] xl:w-[50%] bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2.5">
          <div className="bg-[#0F172A] text-white p-2 rounded-lg">
            <Store size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">InstaShop</span>
        </div>
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-indigo-500/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/2 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 p-12 max-w-lg text-center">
          {/* Floating Card Visual */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl mb-10 text-left w-full max-w-sm mx-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-medium">Monthly Revenue</p>
                  <p className="text-white font-bold text-lg">Rs. 245,000</p>
                </div>
              </div>
              <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
                +12.5%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[70%]" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Manage your store <br />
            <span className="text-indigo-400">from anywhere.</span>
          </h2>
          <p className="text-indigo-200/80 text-lg leading-relaxed mb-8">
            Stay on top of your orders, manage inventory in real-time, and analyze your sales growth
            with our intuitive dashboard.
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" /> System Operational
            </span>
            <span>•</span>
            <span>v1.4.0</span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Visual/Branding (Hidden on mobile) --- */}

      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col lg:justify-center items-center justify-start px-6 lg:py-12 py-32 lg:px-20 xl:px-32 relative">
        {/* Mobile Header (Logo) */}
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2.5 lg:hidden">
          <div className="bg-[#0F172A] text-white p-2 rounded-lg">
            <Store size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">InstaShop</span>
        </div>
        <div className="w-full max-w-md mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">
                Welcome back
              </h1>
              <p className="text-slate-500 text-lg">
                Enter your details to access your seller dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="relative group">
                  <Phone
                    className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#0F172A] transition-colors"
                    size={18}
                  />
                  <Input
                    {...register('phone_number', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter a valid 10-digit number',
                      },
                    })}
                    placeholder="98XXXXXXXX"
                    className={cn(
                      'pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#0F172A] focus:ring-[#0F172A]/10 transition-all',
                      errors.phone_number &&
                        'border-red-300 focus:border-red-500 focus:ring-red-200',
                    )}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-[#0F172A] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#0F172A] transition-colors"
                    size={18}
                  />
                  <Input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={cn(
                      'pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#0F172A] focus:ring-[#0F172A]/10 transition-all',
                      errors.password && 'border-red-300 focus:border-red-500 focus:ring-red-200',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 text-sm font-medium overflow-hidden"
                  >
                    <XCircle size={20} className="shrink-0" />
                    {loginError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-base font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              New to InstaShop?{' '}
              <Link href="/sign-up" className="font-bold text-[#0F172A] hover:underline">
                Create an account
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
