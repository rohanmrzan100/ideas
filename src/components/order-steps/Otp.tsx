import { Input } from '../ui/input';
import { ShieldCheck } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { CheckoutFormData } from '.';

type StepVerificationProps = {
  register: UseFormRegister<CheckoutFormData>;
  phoneNumber: string;
};

export default function StepVerification({ register, phoneNumber }: StepVerificationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-brand/5 text-brand rounded-full flex items-center justify-center mb-6">
        <ShieldCheck size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Phone</h2>
      <p className="text-gray-500 mb-8">
        Enter the 6-digit code sent to <br />
        <span className="text-black font-bold">{phoneNumber}</span>
      </p>
      <Input
        {...register('otp')}
        className="text-center text-4xl tracking-[0.5em] font-bold h-20 w-64 border-2 border-gray-200 focus:border-brand rounded-2xl focus:ring-0 focus-visible:ring-0"
        maxLength={6}
      />
    </div>
  );
}
