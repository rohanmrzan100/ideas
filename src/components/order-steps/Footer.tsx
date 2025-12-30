import { ArrowRight } from 'lucide-react';

interface CheckoutFooterProps {
  step: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function CheckoutFooter({
  step,
  isSubmitting,
  onBack,
  onNext,
}: CheckoutFooterProps) {
  return (
    <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full z-30 md:static md:w-full md:bg-white md:border-none">
      <div className="flex gap-3">
        {/* Secondary Back Button (Hidden on Step 1) */}
        {step > 1 && (
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 h-14 font-bold text-gray-600 bg-gray-100 rounded-button hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        )}

        {/* Primary Button */}
        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="flex-1 bg-brand text-brand-foreground font-bold h-14 rounded-button shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
        >
          {isSubmitting ? 'Processing...' : step === 4 ? 'Place Order' : 'Continue'}
          {!isSubmitting && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
}
