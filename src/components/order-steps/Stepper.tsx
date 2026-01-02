export type StepItem = {
  label: string;
};
interface StepperProps {
  step: number;
  steps: StepItem[];
}
const Stepper = ({ step, steps }: StepperProps) => {
  const currentStep = steps[step - 1];

  return (
    <div className="px-6 py-8 border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-20 shrink-0">
      {/* Step Label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-md font-bold uppercase tracking-wider text-gray-500">
          {currentStep?.label}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="flex gap-2 w-full">
        {steps.map((_, index) => {
          const stepNumber = index + 1;

          return (
            <div key={stepNumber} className="h-1.5 flex-1 rounded-full overflow-hidden bg-gray-100">
              <div
                className={`h-full transition-all duration-500 ${
                  stepNumber <= step ? 'bg-brand w-full' : 'w-0'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
