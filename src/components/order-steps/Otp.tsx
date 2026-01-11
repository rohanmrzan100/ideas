import { Input } from '../ui/input';
import { ShieldCheck, MessageSquareText, Timer } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { CheckoutFormData } from '.';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';

type StepVerificationProps = {
  register: UseFormRegister<CheckoutFormData>;
  phoneNumber: string;
};

export default function StepVerification({ register, phoneNumber }: StepVerificationProps) {
  const [timer, setTimer] = useState(30);

  // Simple countdown timer for UX
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="space-y-8">
      {/* Consistent Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Verify Phone</h2>
        <p className="text-gray-500">
          Enter the 6-digit code sent to{' '}
          <span className="font-bold text-gray-900">{phoneNumber}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Input Area */}
        <div className="space-y-2">
          <Input
            {...register('otp')}
            placeholder="000000"
            className="text-center text-3xl tracking-[0.5em] font-bold h-16 w-full border-2 border-gray-200 focus:border-brand rounded-2xl focus:ring-4 focus:ring-brand/10 transition-all placeholder:tracking-widest placeholder:text-gray-200"
            maxLength={6}
            autoFocus
            autoComplete="one-time-code"
            inputMode="numeric"
          />
          <p className="text-xs text-center text-gray-400">Enter the code from your SMS</p>
        </div>

        {/* Resend Logic */}
        <div className="flex flex-col items-center gap-3">
          {timer > 0 ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <Timer size={16} /> Resend code in {timer}s
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="text-brand font-bold hover:text-brand-primary hover:bg-brand/5 gap-2"
              onClick={() => setTimer(30)}
            >
              <MessageSquareText size={16} /> Resend Verification Code
            </Button>
          )}
        </div>

        {/* Trust/Security Box */}
        <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 items-start border border-blue-100 mt-4">
          <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 shrink-0 mt-0.5">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-800">Secure Verification</h4>
            <p className="text-xs text-blue-600/80 leading-relaxed mt-0.5">
              We verify your number to prevent spam and ensure you receive order updates instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
