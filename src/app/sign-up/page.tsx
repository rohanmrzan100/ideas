'use client';

import Stepper from '@/components/order-steps/Stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Store,
  User,
  XCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
    color: 'bg-gray-100 text-gray-600',
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
    color: 'bg-blue-100 text-blue-600',
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
    color: 'bg-purple-100 text-purple-600',
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Strength State
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

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

  // Real-time password validation
  useEffect(() => {
    if (password) {
      setPasswordCriteria({
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
      });
    } else {
      setPasswordCriteria({
        length: false,
        upper: false,
        lower: false,
        number: false,
      });
    }
  }, [password]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof SignUpData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email', 'phone_number'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['password', 'confirm_password'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['shop_name'];
    } else if (currentStep === 4) {
      fieldsToValidate = ['plan'];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SignUpData) => {
    setIsSubmitting(true);
    setSignupError(null);

    try {
      console.log('Sign up data:', data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      {/* LEFT SIDE: Visual/Branding */}
      <div className="hidden lg:flex lg:w-[35%] bg-brand/5 relative flex-col justify-between p-12 overflow-hidden border-r border-gray-100">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3 text-brand font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-brand">
            <Store size={20} />
          </div>
          InstaShopNepal
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Start your journey <br />
              <span className="text-brand">with us today.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-sm">
              Create your professional store in minutes. No credit card required for trial.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            {signupSteps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > stepNumber;
              const isActive = currentStep === stepNumber;

              return (
                <div key={step.label} className="flex items-center gap-4 group">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-sm',
                      isCompleted
                        ? 'bg-brand border-brand text-white'
                        : isActive
                        ? 'bg-white border-brand text-brand shadow-lg shadow-brand/20 scale-110'
                        : 'bg-transparent border-gray-300 text-gray-400',
                    )}
                  >
                    {isCompleted ? <Check size={18} /> : stepNumber}
                  </div>
                  <div>
                    <p
                      className={cn(
                        'font-bold transition-colors duration-300',
                        isActive || isCompleted ? 'text-gray-900' : 'text-gray-400',
                      )}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-brand font-medium mt-0.5"
                      >
                        In Progress
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm font-medium text-gray-500">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
          </div>
          Join 4,000+ sellers today
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-[65%] flex flex-col items-center justify-center relative">
        <div className="w-full max-w-lg p-6 md:p-12 lg:p-0">
          {/* Mobile Stepper */}
          <div className="lg:hidden mb-8">
            <Stepper step={currentStep} steps={signupSteps} />
          </div>

          <div className="space-y-2 mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              {currentStep === 1 && 'Personal Details'}
              {currentStep === 2 && 'Set a Password'}
              {currentStep === 3 && 'Name your Shop'}
              {currentStep === 4 && 'Select a Plan'}
            </h2>
            <p className="text-gray-500">
              {currentStep === 1 && "Let's get to know you better."}
              {currentStep === 2 && 'Secure your account with a strong password.'}
              {currentStep === 3 && 'This will be your unique store identity.'}
              {currentStep === 4 && 'Choose the best plan for your business needs.'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full"
              >
                {/* STEP 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <FormField
                      label="Full Name"
                      icon={<User size={18} />}
                      error={errors.name?.message}
                    >
                      <Input
                        {...register('name', {
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'Name too short' },
                        })}
                        placeholder="John Doe"
                        className="pl-10"
                      />
                    </FormField>

                    <FormField
                      label="Email Address"
                      icon={<Mail size={18} />}
                      error={errors.email?.message}
                    >
                      <Input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                      />
                    </FormField>

                    <FormField
                      label="Phone Number"
                      icon={<Phone size={18} />}
                      error={errors.phone_number?.message}
                    >
                      <Input
                        {...register('phone_number', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Invalid 10-digit number',
                          },
                        })}
                        type="tel"
                        placeholder="98XXXXXXXX"
                        className="pl-10"
                        maxLength={10}
                      />
                    </FormField>
                  </div>
                )}

                {/* STEP 2: Password */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField
                      label="Password"
                      icon={<Lock size={18} />}
                      error={errors.password?.message}
                    >
                      <Input
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Must be at least 8 characters',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Must contain uppercase, lowercase & number',
                          },
                        })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </FormField>

                    {/* Password Strength Meter */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                        Password Requirements
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <PasswordCheck
                          label="8+ Characters"
                          met={passwordCriteria.length}
                        />
                        <PasswordCheck
                          label="Uppercase Letter"
                          met={passwordCriteria.upper}
                        />
                        <PasswordCheck
                          label="Lowercase Letter"
                          met={passwordCriteria.lower}
                        />
                        <PasswordCheck
                          label="Number"
                          met={passwordCriteria.number}
                        />
                      </div>
                    </div>

                    <FormField
                      label="Confirm Password"
                      icon={<Lock size={18} />}
                      error={errors.confirm_password?.message}
                    >
                      <Input
                        {...register('confirm_password', {
                          required: 'Please confirm your password',
                          validate: (val) =>
                            val === password || 'Passwords do not match',
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                      >
                        {showConfirmPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </FormField>
                  </div>
                )}

                {/* STEP 3: Shop Name */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <FormField
                      label="Shop Name"
                      icon={<Store size={18} />}
                      error={errors.shop_name?.message}
                    >
                      <Input
                        {...register('shop_name', {
                          required: 'Shop name is required',
                          minLength: { value: 3, message: 'Too short' },
                        })}
                        placeholder="e.g. Urban Threads"
                        className="pl-10"
                        autoFocus
                      />
                    </FormField>
                    <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-xl flex items-start gap-3">
                      <Store className="shrink-0 mt-0.5" size={18} />
                      <p>
                        This will be displayed on your storefront and invoices.
                        You can change this later in settings.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: Pricing Plan */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <input
                      type="hidden"
                      {...register('plan', { required: true })}
                    />
                    <div className="grid gap-4">
                      {pricingPlans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setValue('plan', plan.id as any)}
                          className={cn(
                            'relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 flex items-center gap-4 group',
                            selectedPlan === plan.id
                              ? 'border-brand bg-brand/5 shadow-md scale-[1.02]'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                          )}
                        >
                          {/* Plan Icon */}
                          <div
                            className={cn(
                              'w-14 h-14 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors',
                              selectedPlan === plan.id
                                ? 'bg-brand text-white'
                                : plan.color
                            )}
                          >
                            <plan.icon size={24} />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-bold text-gray-900">
                                {plan.name}
                              </h3>
                              {plan.popular && (
                                <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  BEST VALUE
                                </span>
                              )}
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-extrabold text-gray-900">
                                {plan.price}
                              </span>
                              <span className="text-xs text-gray-500">
                                /{plan.period}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {plan.features.slice(0, 3).join(' • ')}
                            </p>
                          </div>

                          {/* Checkbox Visual */}
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                              selectedPlan === plan.id
                                ? 'border-brand bg-brand text-white'
                                : 'border-gray-200'
                            )}
                          >
                            {selectedPlan === plan.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check size={14} strokeWidth={3} />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {signupError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-3 border border-red-100"
              >
                <XCircle size={18} />
                {signupError}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-gray-50">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className="h-12 px-6 rounded-xl hover:bg-gray-100 text-gray-600"
                >
                  <ArrowLeft size={18} className="mr-2" /> Back
                </Button>
              )}

              <Button
                type={currentStep === totalSteps ? 'submit' : 'button'}
                onClick={currentStep < totalSteps ? handleNext : undefined}
                disabled={isSubmitting}
                className={cn(
                  'flex-1 h-12 rounded-xl text-base font-bold shadow-lg transition-all',
                  currentStep === totalSteps
                    ? 'bg-brand hover:bg-brand-primary/90 text-white shadow-brand/20'
                    : 'bg-gray-900 hover:bg-black text-white shadow-gray-200'
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : currentStep === totalSteps ? (
                  <>
                    Create Account <CheckCircle2 size={18} className="ml-2" />
                  </>
                ) : (
                  <>
                    Continue <ChevronRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="font-bold text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function FormField({
  label,
  icon,
  children,
  error,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
            error
              ? 'text-red-400'
              : 'text-gray-400 group-focus-within:text-brand'
          )}
        >
          {icon}
        </div>
        {children}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs font-medium transition-colors duration-300',
        met ? 'text-green-600' : 'text-gray-400'
      )}
    >
      <div
        className={cn(
          'w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-300',
          met
            ? 'bg-green-100 border-green-200'
            : 'bg-gray-100 border-gray-200'
        )}
      >
        {met && <Check size={10} />}
      </div>
      {label}
    </div>
  );
}