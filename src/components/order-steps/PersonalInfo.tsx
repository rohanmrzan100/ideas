import { CheckoutFormData } from '.';
import { FieldDescription } from '../ui/field';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Controller, Control, UseFormRegister } from 'react-hook-form';

type StepShippingProps = {
  register: UseFormRegister<CheckoutFormData>;
  control: Control<CheckoutFormData, unknown, CheckoutFormData>;
};

export default function PersonalInfo({ register, control }: StepShippingProps) {
  return (
    <div className="p-6 md:p-10 space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Where to ship?</h2>
      </div>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 block">Full Name</label>
          <Input
            {...register('fullName', { required: true })}
            className="px-4 h-12 rounded-button bg-gray-50 border-transparent focus:bg-white focus:border-brand  transition-all focus:ring-0 focus-visible:ring-0"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 block">Phone Number</label>
          <Input
            {...register('phoneNumber', { required: true, pattern: /^[0-9]{10}$/ })}
            placeholder="98XXXXXXXX"
            type="number"
            className="px-4 h-12 rounded-button bg-gray-50 border-transparent focus:bg-white focus:border-brand transition-all focus:ring-0 focus-visible:ring-0"
          />{' '}
          <FieldDescription className="ml-1.5 italic">
            We will sms / call you to confirm your order
          </FieldDescription>
        </div>

        {/* Address Section */}
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 block">Full Address</label>

          <div className="space-y-3">
            {/* Street / Landmark Input */}
            <textarea
              {...register('landmark')}
              placeholder="Street Address / Landmark"
              rows={3}
              className="w-full px-4 py-3 rounded-button bg-gray-50 border-transparent focus:bg-white focus:border-brand transition-all outline-none resize-none text-sm placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0"
            />

            {/* District & City Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12 bg-gray-50 border-transparent rounded-button focus:bg-white focus:border-brand transition-all">
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kathmandu">Kathmandu</SelectItem>
                      <SelectItem value="Lalitpur">Lalitpur</SelectItem>
                      <SelectItem value="Bhaktapur">Bhaktapur</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FieldDescription className="ml-1.5 italic">
              We will deliver the order to this address
            </FieldDescription>
          </div>
        </div>
      </div>
    </div>
  );
}
