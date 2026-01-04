'use client';

import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/constants';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/app.slice';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, LucideIcon, Phone, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type SignInData = {
  phone_number: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [type, setType] = useState('password');
  const [icon, setIcon] = useState<LucideIcon>(EyeOff);
  const IconComponent = icon;

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(Eye);
      setType('text');
    } else {
      setIcon(EyeOff);
      setType('password');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();
  const dispatch = useAppDispatch();
  const onSubmit = async (data: SignInData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="min-h-screen w-full flex bg-background font-sans text-foreground">
      {/* --- LEFT SIDE: Visual/Branding (Hidden on mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-brand/5 relative flex-col justify-between p-12 overflow-hidden border-r border-border">
        {/* Abstract Background Shapes using brand colors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3 text-brand font-bold text-2xl tracking-tight">
          <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center text-brand">
            <Store size={24} />
          </div>
          InstaShopNepal
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            Manage your store <br />
            <span className="text-brand">effortlessly.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Track orders, manage inventory, and grow your business with our all-in-one seller
            dashboard designed for growth.
          </p>
        </div>

        {/* Footer/Testimonial */}
        <div className="relative z-10">
          <div className="flex -space-x-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-background bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i + 10}')` }}
              ></div>
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground">Trusted by 4,000+ sellers</p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                  <Phone size={18} />
                </div>
                <Input
                  {...register('phone_number', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit number',
                    },
                  })}
                  type="tel"
                  placeholder="98XXXXXXXX"
                  className={`pl-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                    errors.phone_number
                      ? 'border-destructive focus:border-destructive focus:ring-destructive'
                      : ''
                  }`}
                />
              </div>
              {errors.phone_number && (
                <p className="text-destructive text-xs mt-1 font-medium">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground block">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-brand hover:text-brand/80 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                  <Lock size={18} />
                </div>

                <Input
                  {...register('password', { required: 'Password is required' })}
                  type={type}
                  placeholder="Password"
                  className={`pl-10 pr-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                    errors.password
                      ? 'border-destructive focus:border-destructive focus:ring-destructive'
                      : ''
                  }`}
                />

                <button
                  type="button"
                  onClick={handleToggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                >
                  <IconComponent size={20} />
                </button>
              </div>

              {errors.password && (
                <p className="text-destructive text-xs mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3 animate-in fade-in zoom-in-95">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {loginError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-brand text-brand-foreground font-bold rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="font-bold text-foreground hover:text-brand transition-colors underline underline-offset-4"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
