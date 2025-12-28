"use client";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Switch } from "@radix-ui/react-switch";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Form = () => {
  return (
    <div className="p-10 flex flex-col min-h-screen">
      <form>
        <FieldSet>
          <FieldLegend>Personal Info</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input id="name" autoComplete="off" />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone-number">Phone Number</FieldLabel>
              <Input id="username" autoComplete="off" />
              <FieldDescription>
                We will sms / call you to confirm your order
              </FieldDescription>
            </Field>
            <FieldLabel>Address</FieldLabel>
            <div className="grid grid-cols-2 gap-4">
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
              <Input placeholder="Landmark... (Optional)" />
              <FieldDescription>
                We will deliver the order to this address
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
      <div className="text-black flex justify-between mt-auto">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Form;
