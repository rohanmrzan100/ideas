'use client';

import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/constants';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Store,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type SignUpData = {
  // Step 1: Personal Info
  name: string;
  email: string;
  phone_number: string;

  // Step 2: Password
  password: string;
  confirm_password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SignUpData>();

  const password = watch('password');

  const totalSteps = 2;

  const handleNext = async () => {
    let fieldsToValidate: (keyof SignUpData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email', 'phone_number'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['password', 'confirm_password'];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SignUpData) => {
    setIsSubmitting(true);
    setSignupError(null);

    // try {
    //   const response = await fetch(`${BACKEND_URL}/api/v1/auth/sign-up(milauna baki)`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     credentials: 'include',
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Registration failed');
    //   }

    //   const result = await response.json();
    //   console.log('Signup success:', result);

    //   router.push('/dashboard');
    // } catch (error) {
    //   console.error(error);
    //   setSignupError(
    //     error instanceof Error ? error.message : 'Registration failed. Please try again.',
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
    console.log(data, 'K ayo');
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans text-foreground">
      {/* --- LEFT SIDE: Visual/Branding (Hidden on mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-brand/5 relative flex-col justify-between p-12 overflow-hidden border-r border-border">
        {/* Abstract Background Shapes */}
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
            Start your journey <br />
            <span className="text-brand">with us today.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of sellers who are growing their business with our platform. Setup takes
            less than 2 minutes.
          </p>

          {/* Progress Indicator */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= 1
                    ? 'bg-brand text-brand-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > 1 ? <Check size={20} /> : '1'}
              </div>
              <div>
                <p className="font-semibold text-foreground">Personal Info</p>
                <p className="text-sm text-muted-foreground">Basic details about you</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= 2
                    ? 'bg-brand text-brand-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > 2 ? <Check size={20} /> : '2'}
              </div>
              <div>
                <p className="font-semibold text-foreground">Secure Password</p>
                <p className="text-sm text-muted-foreground">Protect your account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-bold text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Progress Bar */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h2>
            <p className="text-muted-foreground">
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'Create a secure password'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                      <User size={18} />
                    </div>
                    <Input
                      {...register('name', {
                        required: 'Full name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                      type="text"
                      placeholder="John Doe"
                      className={`pl-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                        errors.name ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Email</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                      <Mail size={18} />
                    </div>
                    <Input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      type="email"
                      placeholder="john@example.com"
                      className={`pl-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                        errors.email ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">
                    Phone Number
                  </label>
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
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        },
                      })}
                      type="tel"
                      placeholder="98XXXXXXXX"
                      className={`pl-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                        errors.phone_number ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Password */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Password</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                      <Lock size={18} />
                    </div>
                    <Input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain uppercase, lowercase, and number',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className={`pl-10 pr-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                        errors.password ? 'border-destructive' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                      <Lock size={18} />
                    </div>
                    <Input
                      {...register('confirm_password', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      className={`pl-10 pr-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                        errors.confirm_password ? 'border-destructive' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                    >
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground">Password must contain:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                      One number
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {signupError && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3 animate-in fade-in zoom-in-95">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {signupError}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 h-12 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 bg-brand text-brand-foreground font-bold rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-brand text-brand-foreground font-bold rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <Check size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="font-bold text-foreground hover:text-brand transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
