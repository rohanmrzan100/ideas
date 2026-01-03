'use client';

import Stepper from '@/components/order-steps/Stepper';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  PhoneCall,
  Store,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
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

  // Step 3: Pricing Plan
  plan: 'free' | 'pro' | 'enterprise';

  // Step 4: Shop Details
  shop_name: string;
  owner_id: string;
};

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    icon: Store,
    features: ['Up to 10 products', 'Basic analytics', 'Email support', '5% transaction fee'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹999',
    period: 'per month',
    icon: Zap,
    features: [
      'Unlimited products',
      'Advanced analytics',
      'Priority support',
      '2% transaction fee',
      'Custom domain',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₹2,999',
    period: 'per month',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      '24/7 phone support',
      '0% transaction fee',
      'API access',
      'White-label options',
    ],
    popular: false,
  },
];

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupSteps = [
    { label: 'Personal Info' },
    { label: 'Secure Password' },
    { label: 'Create Shop' },
    { label: 'Choose Plan' },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    trigger,
    setValue,
  } = useForm<SignUpData>({
    mode: 'onTouched',
    defaultValues: {
      plan: 'pro',
    },
  });

  const password = watch('password');
  const selectedPlan = watch('plan');
  const totalSteps = signupSteps.length;

  const handleNext = async () => {
    let fieldsToValidate: (keyof SignUpData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email', 'phone_number'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['password', 'confirm_password'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['shop_name', 'owner_id'];
    } else if (currentStep === 4) {
      fieldsToValidate = ['plan'];
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

    try {
      // Api Call garna baki
      console.log('Sign up data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to dashboard after successful signup
      // router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setSignupError(
        error instanceof Error ? error.message : 'Registration failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans text-foreground">
      {/* LEFT SIDE: Visual/Branding */}
      <div className="hidden lg:flex md:basis-[35%]  bg-brand/5 relative flex-col justify-between p-12 overflow-hidden border-r border-border">
        <div className="relative z-10 flex items-center gap-3 text-brand font-bold text-2xl tracking-tight">
          <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center text-brand">
            <Store size={24} />
          </div>
          InstaShopNepal
        </div>

        <div className="relative z-10 space-y-6 max-w-lg ">
          <h1 className="w-full text-5xl font-extrabold text-foreground leading-tight tracking-tight ">
            Start your journey <br />
            <span className="text-brand">with us today.</span>
          </h1>

          <p className="w-full text-lg text-muted-foreground leading-relaxed ">
            Join thousands of sellers who are growing their business with our platform. Setup takes
            less than 5 minutes.
          </p>

          <div className="space-y-4 pt-8">
            {signupSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep > index + 1
                      ? 'bg-brand text-brand-foreground'
                      : currentStep === index + 1
                      ? 'bg-brand text-brand-foreground ring-4 ring-brand/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > index + 1 ? <Check size={20} /> : index + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 && 'Basic details about you'}
                    {index === 1 && 'Protect your account'}
                    {index === 2 && 'Select your pricing tier'}
                    {index === 3 && 'Setup your online store'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-bold text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      {/* Mobile Nav */}

      {/* RIGHT SIDE: Form */}
      <div className="w-full md:basis-[65%] flex items-start justify-center p-6 sm:p-12 md:p-24 bg-background overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8">
          <div className="lg:hidden mb-6">
            <Stepper step={currentStep} steps={signupSteps} />
          </div>
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h2>
            <p className="text-muted-foreground">
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'Create a secure password'}
              {currentStep === 3 && 'Setup your shop'}
              {currentStep === 4 && 'Choose your plan'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
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
                      className={`pl-10 pr-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all  ${
                        errors.password && touchedFields.password ? 'border-destructive' : ''
                      }}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.password && touchedFields.password && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

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
                        errors.confirm_password && touchedFields.confirm_password
                          ? 'border-destructive'
                          : ''
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
                  {errors.confirm_password && touchedFields.confirm_password && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>

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

            {/* STEP 3: Shop */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="shop-name space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Shop Name</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                      <Store size={18} />
                    </div>
                    <Input
                      {...register('shop_name', {
                        required: 'Shop name is required',
                        minLength: {
                          value: 3,
                          message: 'Shop name must be at least 3 characters',
                        },
                      })}
                      type="text"
                      placeholder="My Awesome Shop"
                      className={`pl-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                        errors.shop_name ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  {errors.shop_name && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.shop_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Owner ID</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors">
                      <PhoneCall size={18} />
                    </div>
                    <Input
                      {...register('owner_id', {
                        required: 'Owner is required',
                      })}
                      type="text"
                      placeholder="Owner Id"
                      className={`pl-10 h-12 rounded-xl bg-muted/30 border-input focus:bg-background focus:border-brand focus:ring-1 focus:ring-brand transition-all ${
                        errors.owner_id ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  {errors.owner_id && (
                    <p className="text-destructive text-xs mt-1 font-medium">
                      {errors.owner_id.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Pricing */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <input type="hidden" {...register('plan', { required: 'Please select a plan' })} />

                <div className="grid md:grid-cols-3 gap-4 w-full">
                  {pricingPlans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setValue('plan', plan.id as any)}
                        className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                          selectedPlan === plan.id
                            ? 'border-brand bg-brand/5 shadow-lg scale-105'
                            : 'border-border bg-card hover:border-brand/50'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-brand text-brand-foreground text-xs font-bold px-3 py-1 rounded-full">
                              POPULAR
                            </span>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              selectedPlan === plan.id
                                ? 'bg-brand text-brand-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <Icon size={24} />
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                            <div className="mt-2">
                              <span className="text-3xl font-extrabold text-foreground">
                                {plan.price}
                              </span>
                              <span className="text-sm text-muted-foreground ml-1">
                                /{plan.period}
                              </span>
                            </div>
                          </div>

                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <Check size={16} className="text-brand mt-0.5 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
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
