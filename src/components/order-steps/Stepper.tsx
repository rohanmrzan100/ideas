import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

type StepItem = {
  label: string;
};

interface StepperProps {
  step: number;
  steps: StepItem[];
}

const Stepper = ({ step, steps }: StepperProps) => {
  return (
    <div className="w-full bg-white md:px-8 pt-4 pb-2 md:py-6 md:border-b md:border-gray-100 sticky top-0 z-20">
      <div className="px-6 md:hidden mb-3 flex justify-between items-end">
        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
          {steps[step - 1].label}
        </h2>
        <span className="text-xs font-semibold text-gray-400">
          Step {step} of {steps.length}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="px-6 md:px-0 flex items-center gap-2">
        {steps.map((item, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === step;
          const isCompleted = stepNumber < step;

          return (
            <div key={index} className="flex-1 flex flex-col gap-2 group">
              {/* Desktop Label */}
              <div
                className={cn(
                  'hidden md:flex items-center gap-2 text-sm font-medium transition-colors',
                  isActive ? 'text-brand' : isCompleted ? 'text-gray-900' : 'text-gray-400',
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all',
                    isActive
                      ? 'border-brand bg-brand text-white'
                      : isCompleted
                      ? 'border-brand bg-brand text-white'
                      : 'border-gray-200 text-gray-400',
                  )}
                >
                  {isCompleted ? <Check size={12} strokeWidth={4} /> : stepNumber}
                </div>
                {item.label}
              </div>

              {/* Bar */}
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                {(isCompleted || isActive) && (
                  <motion.div
                    layoutId={isActive ? 'active-step-bar' : undefined}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute top-0 left-0 h-full bg-brand rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
