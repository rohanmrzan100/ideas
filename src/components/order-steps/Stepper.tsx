interface CheckoutHeaderProps {
  step: number;
  totalSteps?: number;
}

const Stepper = ({ step, totalSteps = 4 }: CheckoutHeaderProps) => {
  const getStepLabel = (s: number) => {
    switch (s) {
      case 1:
        return 'Product Details';
      case 2:
        return 'Shipping Info';
      case 3:
        return 'Verification';
      case 4:
        return 'Payment Info';
      default:
        return '';
    }
  };

  return (
    <div className="px-6  py-8 border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-20 shrink-0">
      <div className="flex items-center justify-between mb-4">
        {/* {step > 1 ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-lg font-semibold text-gray-600 cursor-pointer hover:text-black transition"
          >
            <ArrowLeft size={32} /> Back
          </button>
        ) : (
          <div></div>
        )} */}

        <span className="text-md font-bold uppercase tracking-wider text-gray-500">
          {getStepLabel(step)}
        </span>
      </div>

      {/* Segmented Bars */}
      <div className="flex gap-2 w-full">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="h-1.5 flex-1 rounded-full overflow-hidden bg-gray-100">
            <div
              className={`h-full w-full transition-all duration-500 ${
                s <= step ? 'bg-brand' : 'bg-transparent'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
