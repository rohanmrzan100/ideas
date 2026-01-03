import { ArrowLeft, ArrowRight, Loader2, Lock } from 'lucide-react';

interface CheckoutFooterProps {
  step: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  price?: number; // Added price to show in button on mobile
}

export default function CheckoutFooter({
  step,
  isSubmitting,
  onBack,
  onNext,
  price,
}: CheckoutFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 md:static md:bg-white md:border-t md:border-gray-100">
      {/* Glassmorphism Background for Mobile */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-md border-t border-gray-200 md:hidden" />

      <div className="relative flex items-center gap-3 max-w-6xl mx-auto">
        {/* Back Button (Icon only on mobile for space) */}
        {step > 1 && (
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="h-12 w-12 md:w-auto md:px-6 flex items-center justify-center rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
            aria-label="Go Back"
          >
            <ArrowLeft size={20} className="md:mr-2" />
            <span className="hidden md:inline">Back</span>
          </button>
        )}

        {/* Primary Action */}
        <button
          onClick={onNext}
          disabled={isSubmitting}
          className={`
            flex-1 h-12 rounded-xl font-bold text-white shadow-lg shadow-brand/20 
            flex items-center justify-center gap-2 active:scale-[0.98] transition-all
            ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand hover:bg-brand-primary/90'
            }
          `}
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : step === 4 ? (
            <>
              <Lock size={18} /> Pay <span className="hidden xs:inline">Rs. {price}</span>
            </>
          ) : (
            <>
              Continue <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
