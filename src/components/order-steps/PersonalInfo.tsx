'use client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Control, UseFormRegister } from 'react-hook-form';
import { CheckoutFormData } from '.';
import { FieldDescription } from '../ui/field';
import { Input } from '../ui/input';

import { getAreas, getCities, getZones } from '@/api/orders';
import type { Area, City, Zone } from '@/app/data';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type StepShippingProps = {
  register: UseFormRegister<CheckoutFormData>;
  control: Control<CheckoutFormData, unknown, CheckoutFormData>;
  // errors: FieldErrors<CheckoutFormData>;
};

export default function PersonalInfo({ register, control }: StepShippingProps) {
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState<City[]>([]);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [citiesValue, setCitiesValue] = useState('');

  const [zones, setZones] = useState<Zone[]>([]);
  const [zonesOpen, setZonesOpen] = useState(false);
  const [zonesValue, setZonesValue] = useState('');

  const [areas, setAreas] = useState<Area[]>([]);
  const [areasOpen, setAreasOpen] = useState(false);
  const [areasValue, setAreasValue] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getCities();
        console.log(data);
        setCities(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (zones.length === 0) {
      setAreas([]);
    }
  }, [zones]);

  async function getZonesFromCities(city_id: number) {
    setLoading(true);
    try {
      const data = await getZones(city_id);
      console.log(data);
      setZones(data);
      console.log(data);
    } finally {
      setLoading(false);
    }
  }

  async function getAreasFromZones(zone_id: number) {
    setLoading(true);
    try {
      const data = await getAreas(zone_id);
      console.log(data);
      setAreas(data);
      console.log(data);
    } finally {
      setLoading(false);
    }
  }

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
            {...register('fullName', {
              required: 'Please enter your full name',
            })}
            className="px-4 h-12 rounded-button bg-gray-50 border-transparent focus:bg-white focus:border-brand  transition-all focus:ring-0 focus-visible:ring-0"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-gray-700 text-sm font-medium mb-2 block">Phone Number</label>
          <Input
            {...register('phoneNumber', {
              required: true,
              pattern: /^[0-9]{10}$/,
            })}
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
            {/* City */}
            <div className="w-full">
              <Popover open={citiesOpen} onOpenChange={setCitiesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={citiesOpen}
                    className="w-full justify-between"
                  >
                    {citiesValue
                      ? cities.find((c) => String(c.city_id) === citiesValue)?.city_name
                      : 'Select city...'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search city..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.city_id}
                            value={String(city.city_name)}
                            onSelect={() => {
                              setCitiesValue(String(city.city_id)); // keep storing ID (if you want)
                              setCitiesOpen(false);
                              getZonesFromCities(city.city_id);
                            }}
                          >
                            {city.city_name}

                            <Check
                              className={cn(
                                'ml-auto',
                                citiesValue === String(city.city_id) ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Zone */}
            {zones.length > 0 && (
              <div className="w-full">
                <Popover open={zonesOpen} onOpenChange={setZonesOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={zonesOpen}
                      className="w-full justify-between"
                    >
                      {zonesValue
                        ? zones.find((z) => String(z.zone_id) === zonesValue)?.zone_name
                        : 'Select zone...'}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search zone..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No zone found.</CommandEmpty>

                        <CommandGroup>
                          {zones.map((zone) => (
                            <CommandItem
                              key={zone.zone_id}
                              value={String(zone.zone_name)}
                              onSelect={() => {
                                setZonesValue(String(zone.zone_id)); // store zone id
                                setZonesOpen(false);
                                getAreasFromZones(zone.zone_id);
                              }}
                            >
                              {zone.zone_name}

                              <Check
                                className={cn(
                                  'ml-auto',
                                  zonesValue === String(zone.zone_id) ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Area */}
            {areas.length > 0 && (
              <div className="w-full">
                <Popover open={areasOpen} onOpenChange={setAreasOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={areasOpen}
                      className="w-full justify-between"
                    >
                      {areasValue
                        ? areas.find((a) => String(a.area_id) === areasValue)?.area_name
                        : 'Select area...'}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search area..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No area found.</CommandEmpty>

                        <CommandGroup>
                          {areas.map((area) => (
                            <CommandItem
                              key={area.area_id}
                              value={String(area.area_name)}
                              onSelect={() => {
                                setAreasValue(String(area.area_id)); // store area id
                                setAreasOpen(false);
                              }}
                            >
                              {area.area_name}

                              <Check
                                className={cn(
                                  'ml-auto',
                                  areasValue === String(area.area_id) ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            {/* Street / Landmark Input */}
            <textarea
              {...register('landmark')}
              placeholder="Street Address / Landmark"
              rows={3}
              className="w-full px-4 py-3 rounded-button bg-gray-50 border-transparent focus:bg-white focus:border-brand transition-all outline-none resize-none text-sm placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0"
            />
            <FieldDescription className="ml-1.5 italic">
              We will deliver the order to this address
            </FieldDescription>
          </div>
        </div>
      </div>
    </div>
  );
}
