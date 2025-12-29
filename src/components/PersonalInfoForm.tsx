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

const ProductInfoForm = () => {
  return (
    <div className="p-7 flex flex-col min-h-screen">
      <form>
        <FieldSet>
          <h1 className="text-3xl font-medium border-b-3 border-black py-2">
            Personal Info
          </h1>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name" className="text-lg ml-0.5 -mb-1.5">
                Full name
              </FieldLabel>
              <Input id="name" autoComplete="off" />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="phone-number"
                className="text-lg ml-0.5 -mb-2.5"
              >
                Phone Number
              </FieldLabel>
              <Input id="username" autoComplete="off" className="-mb-1.5" />
              <FieldDescription className="ml-1.5 italic">
                We will sms / call you to confirm your order
              </FieldDescription>
            </Field>
            <FieldLabel className="text-lg ml-0.5 -mb-5.5">Address</FieldLabel>
            <div className="grid grid-cols-2 gap-4 -mb-3">
              <Field>
                <Select>
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
              </Field>
              <Field>
                <Input autoComplete="off" placeholder="Location..." />
              </Field>
            </div>
            <Field>
              <Input placeholder="Landmark... (Optional)" className="-mb-2" />
              <FieldDescription className="ml-1.5 italic">
                We will deliver the order to this address
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
      <div className="text-black flex justify-between mt-auto">
        <button
          type="button"
          className="flex items-center bg-gray-500 hover:bg-gray-600 text-xl text-white py-2 pl-6 pr-6 rounded-sm"
        >
          Back
        </button>
        <button
          type="button"
          className="flex items-center bg-blue-700 hover:bg-amber-800 text-xl text-white py-2 pl-6 pr-6 rounded-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductInfoForm;
