'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/lib/constants';
import { PLAN_TYPE } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/app.slice';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  XCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// --- Types & Data ---

type SignUpData = {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  plan: PLAN_TYPE;
  shop_name: string;
};

const pricingPlans = [
  {
    id: 'free' as PLAN_TYPE,
    name: 'Starter',
    price: 'Rs. 0',
    period: 'forever',
    icon: Store,
    popular: false,
    description: 'For hobbyists',
    features: ['Up to 50 products', 'Basic analytics', 'Email support'],
  },
  {
    id: 'pro' as PLAN_TYPE,
    name: 'Pro',
    price: 'Rs. 999',
    period: '/mo',
    icon: Zap,
    popular: true,
    description: 'For growing shops',
    features: ['Unlimited products', 'Advanced analytics', 'Priority support', 'Custom branding'],
  },
  {
    id: 'enterprise' as PLAN_TYPE,
    name: 'Scale',
    price: 'Rs. 2,999',
    period: '/mo',
    icon: Crown,
    popular: false,
    description: 'For large teams',
    features: ['Dedicated manager', 'API access', 'White-label solution', '24/7 phone support'],
  },
];

const features = [
  { icon: LayoutDashboard, text: 'Real-time Analytics Dashboard' },
  { icon: ShieldCheck, text: 'Bank-grade Security' },
  { icon: Sparkles, text: 'AI-Powered Inventory' },
];

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 20 : -20, opacity: 0 }),
};

// --- Main Component ---

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [criteria, setCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  const signupSteps = [
    { label: 'Details', icon: User },
    { label: 'Security', icon: ShieldCheck },
    { label: 'Store', icon: Store },
    { label: 'Plan', icon: Crown },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<SignUpData>({
    mode: 'onChange',
    defaultValues: { plan: 'pro' as PLAN_TYPE },
  });

  const password = watch('password') || '';
  const selectedPlan = watch('plan');
  const totalSteps = signupSteps.length;

  useEffect(() => {
    setCriteria({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  }, [password]);

  const onSubmit = async (data: SignUpData) => {
    let fields: (keyof SignUpData)[] = [];
    if (currentStep === 1) fields = ['name', 'email', 'phone_number'];
    if (currentStep === 2) fields = ['password', 'confirm_password'];
    if (currentStep === 3) fields = ['shop_name'];
    if (currentStep === 4) fields = ['plan'];

    const isValidStep = await trigger(fields);

    if (isValidStep && currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (isValidStep && currentStep === totalSteps) {
      setIsSubmitting(true);
      setSignupError(null);

      const payload = {
        phone_number: data.phone_number,
        name: data.name,
        email: data.email || undefined,
        password: data.password,
        shop_name: data.shop_name,
        plan: data.plan,
      };

      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const result = await response.json();
        dispatch(setUser(result.data));
        router.push('/dashboard');
      } catch (error) {
        setSignupError(error instanceof Error ? error.message : 'Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setSignupError(null);
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const currentProgress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans selection:bg-[#0F172A] selection:text-white">
      {/* LEFT SIDE: Form Section */}

      {/* RIGHT SIDE: Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[50%] bg-[#0F172A] text-white p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-indigo-200 mb-6">
            <Sparkles size={12} /> New Features Live
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Launch your <br />
            online dream today.
          </h2>
          <p className="text-indigo-200/80 text-lg max-w-md leading-relaxed">
            Join 15,000+ business owners who trust InstaShop to manage their inventory, sales, and
            customer relationships.
          </p>
        </div>

        {/* Feature List */}
        <div className="relative z-10 space-y-6">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                <item.icon className="text-indigo-300 group-hover:text-white" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white/90">{item.text}</p>
                <p className="text-sm text-white/40">Included in all plans</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Snippet */}
        <div className="relative z-10 pt-8 border-t border-white/10">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="w-4 h-4 bg-orange-400 rounded-sm" />
            ))}
          </div>
          <p className="text-sm text-white/60 italic">
            The easiest platform I have ever used. I set up my clothing store in 15 minutes.
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col relative w-full lg:w-[55%] xl:w-[50%] h-full overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center bg-white lg:bg-transparent sticky top-0 z-10 lg:static">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#0F172A] text-white p-2 rounded-lg">
              <Store size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">InstaShop</span>
          </div>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-600 hover:text-[#0F172A] hidden sm:block"
          >
            Already a member?{' '}
            <span className="underline decoration-slate-300 hover:decoration-[#0F172A]">
              Sign in
            </span>
          </Link>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-12 lg:px-16 max-w-3xl mx-auto w-full">
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-[#0F172A]">{signupSteps[currentStep - 1].label}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#0F172A]"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">
              {currentStep === 1 && "Let's get started"}
              {currentStep === 2 && 'Secure your account'}
              {currentStep === 3 && 'Name your store'}
              {currentStep === 4 && 'Choose your plan'}
            </h1>
            <p className="text-slate-500 text-lg">
              {currentStep === 1 && 'Create an account to start managing your business.'}
              {currentStep === 2 && 'Setup a strong password to protect your data.'}
              {currentStep === 3 && 'This will be the name customers see.'}
              {currentStep === 4 && 'Start for free or scale immediately.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full min-h-75"
              >
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField label="Full Name" error={errors.name?.message}>
                        <div className="relative group">
                          <User
                            className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#0F172A] transition-colors"
                            size={18}
                          />
                          <Input
                            {...register('name', { required: 'Name is required' })}
                            placeholder="John Doe"
                            className="pl-10 h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-[#0F172A]/10 transition-all"
                          />
                        </div>
                      </FormField>
                      <FormField label="Phone Number" error={errors.phone_number?.message}>
                        <div className="relative group">
                          <Phone
                            className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#0F172A] transition-colors"
                            size={18}
                          />
                          <Input
                            {...register('phone_number', {
                              required: 'Required',
                              pattern: { value: /^[0-9]{10}$/, message: '10 digits required' },
                            })}
                            placeholder="98XXXXXXXX"
                            className="pl-10 h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-[#0F172A]/10 transition-all"
                            maxLength={10}
                          />
                        </div>
                      </FormField>
                    </div>
                    <FormField label="Email Address (Optional)" error={errors.email?.message}>
                      <div className="relative group">
                        <Mail
                          className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#0F172A] transition-colors"
                          size={18}
                        />
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10 h-12 bg-white border-slate-200 focus:border-[#0F172A] focus:ring-[#0F172A]/10 transition-all"
                        />
                      </div>
                    </FormField>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <FormField label="Password" error={errors.password?.message}>
                      <div className="relative">
                        <Input
                          {...register('password', {
                            required: 'Password is required',
                            validate: (value) => {
                              if (value.length < 8) return 'At least 8 characters';
                              if (!/[A-Z]/.test(value)) return 'One uppercase letter needed';
                              if (!/[a-z]/.test(value)) return 'One lowercase letter needed';
                              if (!/\d/.test(value)) return 'One number needed';
                              return true;
                            },
                          })}
                          type={showPassword ? 'text' : 'password'}
                          className="h-12 pr-10 bg-white border-slate-200 focus:border-[#0F172A] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </FormField>

                    {/* Visual Password Feedback */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <PasswordCheck label="8+ Chars" met={criteria.length} />
                      <PasswordCheck label="Uppercase" met={criteria.upper} />
                      <PasswordCheck label="Lowercase" met={criteria.lower} />
                      <PasswordCheck label="Number" met={criteria.number} />
                    </div>

                    <FormField label="Confirm Password" error={errors.confirm_password?.message}>
                      <div className="relative">
                        <Input
                          {...register('confirm_password', {
                            required: 'Please confirm password',
                            validate: (v) => v === password || 'Passwords do not match',
                          })}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="h-12 pr-10 bg-white border-slate-200 focus:border-[#0F172A] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </FormField>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <FormField label="Shop Name" error={errors.shop_name?.message}>
                      <div className="relative group">
                        <Store
                          className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#0F172A] transition-colors"
                          size={18}
                        />
                        <Input
                          {...register('shop_name', { required: 'Shop name is required' })}
                          placeholder="e.g. Himalayan Crafts"
                          className="pl-10 h-14 text-lg bg-white border-slate-200 focus:border-[#0F172A] focus:ring-[#0F172A]/10 transition-all"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Your shop URL will be generated based on this name.
                      </p>
                    </FormField>
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {pricingPlans.map((plan) => {
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => {
                            setValue('plan', plan.id as PLAN_TYPE);
                            trigger('plan');
                          }}
                          className={cn(
                            'relative cursor-pointer rounded-2xl border p-5 transition-all duration-300',
                            isSelected
                              ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-xl scale-[1.02]'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md text-slate-800',
                          )}
                        >
                          {plan.popular && !isSelected && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-[#0F172A] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                              Recommended
                            </span>
                          )}

                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <div
                                className={cn(
                                  'p-2 rounded-lg',
                                  isSelected ? 'bg-white/10' : 'bg-slate-100',
                                )}
                              >
                                <plan.icon size={20} />
                              </div>
                              {isSelected && <CheckCircle2 size={24} className="text-white" />}
                            </div>

                            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                            <p
                              className={cn(
                                'text-xs mb-4',
                                isSelected ? 'text-slate-300' : 'text-slate-500',
                              )}
                            >
                              {plan.description}
                            </p>

                            <div className="mb-6">
                              <span className="text-2xl font-bold">{plan.price}</span>
                              <span
                                className={cn(
                                  'text-xs font-medium ml-1',
                                  isSelected ? 'text-slate-400' : 'text-slate-500',
                                )}
                              >
                                {plan.period}
                              </span>
                            </div>

                            <div className="mt-auto space-y-2">
                              {plan.features.slice(0, 3).map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Check
                                    size={12}
                                    className={cn(
                                      isSelected ? 'text-emerald-400' : 'text-[#0F172A]',
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      'text-xs',
                                      isSelected ? 'text-slate-300' : 'text-slate-600',
                                    )}
                                  >
                                    {f}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            {signupError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 text-sm font-medium"
              >
                <XCircle size={20} className="shrink-0" /> {signupError}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting || currentStep === 1}
                className={cn(
                  'px-4 py-3 text-sm font-bold text-slate-500 hover:text-[#0F172A] transition-colors rounded-xl hover:bg-slate-100',
                  currentStep === 1 ? 'invisible' : 'visible',
                )}
              >
                Back
              </button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-base font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span className="flex items-center gap-2">
                    {currentStep === totalSteps ? 'Create Account' : 'Continue'}
                    {currentStep !== totalSteps && <ArrowRight size={18} />}
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Mobile Footer */}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/sign-in" className="text-sm font-medium text-slate-600">
              Already a member? <span className="underline decoration-slate-300">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700 block">{label}</label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-red-500 font-medium flex items-center gap-1"
        >
          <XCircle size={12} /> {error}
        </motion.p>
      )}
    </div>
  );
}

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all border',
        met
          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
          : 'bg-slate-50 text-slate-400 border-slate-100',
      )}
    >
      <div
        className={cn(
          'w-3 h-3 rounded-full flex items-center justify-center transition-colors',
          met ? 'bg-emerald-500' : 'bg-slate-300',
        )}
      >
        {met && <Check size={8} className="text-white" strokeWidth={4} />}
      </div>
      {label}
    </div>
  );
}
