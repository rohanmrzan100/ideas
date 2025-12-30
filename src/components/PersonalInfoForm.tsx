'use client';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

interface IPersonalInfoInput {
  fullName: string;
  phoneNumber: string;
  district: string;
  location: string;
  landmark?: string;
}

const ProductInfoForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IPersonalInfoInput>();

  const onSubmit: SubmitHandler<IPersonalInfoInput> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-7 flex flex-col min-h-screen">
        <FieldSet>
          <h1 className="text-3xl font-medium border-b-3 border-black py-2">
            Personal Info
          </h1>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName" className="text-lg ml-0.5 -mb-1.5">
                Full name
              </FieldLabel>
              <Input
                {...register('fullName', {
                  required: 'Please enter your full name',
                  validate: (v) =>
                    v.trim() !== '' || 'Full name cannot be empty',
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: 'Name can only contain letters',
                  },
                })}
                autoComplete="off"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-0 ml-1">
                  {errors.fullName.message}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel
                htmlFor="phoneNumber"
                className="text-lg ml-0.5 -mb-2.5"
              >
                Phone number
              </FieldLabel>
              <Input
                {...register('phoneNumber', {
                  required: 'Please enter your phone number',
                  validate: (v) => v.trim() !== '',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid phone number',
                  },
                })}
                autoComplete="off"
                className="-mb-1.5"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-0 ml-1">
                  {errors.phoneNumber.message}
                </p>
              )}
              <FieldDescription className="ml-1.5 italic">
                We will sms / call you to confirm your order
              </FieldDescription>
            </Field>
            <FieldLabel className="text-lg ml-0.5 -mb-5.5">Address</FieldLabel>
            <div className="grid grid-cols-2 gap-4 -mb-3">
              <Field>
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: 'Please select a district.' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Kathmandu">Kathmandu</SelectItem>
                          <SelectItem value="Lalitpur">Lalitpur</SelectItem>
                          <SelectItem value="Bhaktapur">Bhaktapur</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.district && (
                  <p className="text-red-500 text-sm mt-0 ml-1">
                    {errors.district.message}
                  </p>
                )}
              </Field>
              <Field>
                <Input
                  autoComplete="off"
                  {...register('location', {
                    required: 'Please enter your location',
                    validate: (v) =>
                      v.trim() !== '' || 'Location cannot be empty',
                  })}
                  placeholder="Location..."
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-0 ml-1">
                    {errors.location.message}
                  </p>
                )}
              </Field>
            </div>
            <Field>
              <Input
                placeholder="Landmark... (Optional)"
                {...register('landmark')}
                className="-mb-2"
              />
              <FieldDescription className="ml-1.5 italic">
                We will deliver the order to this address
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
      <div className="text-black flex justify-between mt-auto">
        <button
          type="button"
          className="flex items-center bg-gray-500 hover:bg-gray-600 text-xl text-white py-2 pl-6 pr-6 rounded-sm"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex items-center bg-blue-700 hover:bg-amber-800 text-xl text-white py-2 pl-6 pr-6 rounded-sm"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ProductInfoForm;
