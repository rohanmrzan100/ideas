'use client';

import { Area, City, getAreas, getCities, getZones, Zone } from '@/api/orders';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronRight, Loader2, MapPin, Phone, User, X } from 'lucide-react';
import { useState } from 'react';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData } from '.';

type StepShippingProps = {
  register: UseFormRegister<CheckoutFormData>;
  control: Control<CheckoutFormData, unknown, CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
};

type SelectionState = {
  city: City | null;
  zone: Zone | null;
  area: Area | null;
};

export default function PersonalInfo({ register, setValue }: StepShippingProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [selection, setSelection] = useState<SelectionState>({
    city: null,
    zone: null,
    area: null,
  });

  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const data = await getCities();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: zones, isLoading: loadingZones } = useQuery({
    queryKey: ['zones', selection.city?.city_id],
    queryFn: async () => {
      if (!selection.city) return [];
      const data = await getZones(selection.city.city_id);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!selection.city,
  });

  const { data: areas, isLoading: loadingAreas } = useQuery({
    queryKey: ['areas', selection.zone?.zone_id],
    queryFn: async () => {
      if (!selection.zone) return [];
      const data = await getAreas(selection.zone.zone_id);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!selection.zone,
  });

  const step = !selection.city ? 'CITY' : !selection.zone ? 'ZONE' : 'AREA';

  const handleCitySelect = (city: City) => {
    setSelection({ city, zone: null, area: null });
    setSearch('');
    setValue('district', city.city_name);
    setValue('cityId', city.city_id); // Capture ID
  };

  const handleZoneSelect = (zone: Zone) => {
    setSelection((prev) => ({ ...prev, zone, area: null }));
    setSearch('');
    setValue('zoneId', zone.zone_id); // Capture ID
  };

  const handleAreaSelect = (area: Area) => {
    setSelection((prev) => ({ ...prev, area }));
    setSearch('');
    setOpen(false);
    setValue('location', area.area_name);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelection({ city: null, zone: null, area: null });
    setValue('district', '');
    setValue('location', '');
    setValue('cityId', 0);
    setValue('zoneId', 0);
    setSearch('');
    setOpen(true);
  };

  // ... Rest of the JSX remains the same
  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ... header ... */}
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Shipping Details</h2>
        <p className="text-gray-500">Where should we deliver your order?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
            Contact
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative group">
              <User
                className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand transition-colors"
                size={18}
              />
              <Input
                {...register('fullName', { required: true })}
                placeholder="Full Name"
                className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
              />
            </div>
            <div className="relative group">
              <Phone
                className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand transition-colors"
                size={18}
              />
              <Input
                {...register('phoneNumber', { required: true, pattern: /^[0-9]{10}$/ })}
                placeholder="Mobile Number"
                type="tel"
                className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
            Address
          </h3>

          <div className="flex flex-col gap-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div
                  role="combobox"
                  aria-expanded={open}
                  className="flex min-h-[50px] w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100 hover:border-gray-300 transition-all"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <MapPin className="mr-2 h-5 w-5 text-gray-400" />

                    {!selection.city && (
                      <span className="text-gray-500 text-base">Select City...</span>
                    )}

                    {selection.city && (
                      <span className="font-medium text-gray-900">{selection.city.city_name}</span>
                    )}

                    {selection.zone && selection.zone.zone_name !== selection.city?.city_name && (
                      <div className="flex items-center gap-1">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {selection.zone.zone_name}
                        </span>
                      </div>
                    )}

                    {selection.area && (
                      <>
                        {selection.area.area_name !== selection.zone?.zone_name &&
                          selection.area.area_name !== selection.city?.city_name && (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        <span className="font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                          {selection.area.area_name}
                        </span>
                      </>
                    )}

                    {selection.city && !selection.area && (
                      <span className="text-gray-400 italic flex items-center">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        {selection.zone ? 'Select Area...' : 'Select Zone...'}
                      </span>
                    )}
                  </div>

                  {selection.city ? (
                    <div
                      onClick={handleReset}
                      className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                      <X size={16} />
                    </div>
                  ) : (
                    <ChevronRight className="rotate-90 text-gray-400 h-5 w-5" />
                  )}
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-[340px] p-0 rounded-xl shadow-lg" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={
                      step === 'CITY'
                        ? 'Search city...'
                        : step === 'ZONE'
                        ? 'Search zone...'
                        : 'Search area...'
                    }
                    value={search}
                    onValueChange={setSearch}
                    className="h-11"
                  />
                  <CommandList className="max-h-[300px]">
                    {(loadingCities || loadingZones || loadingAreas) && (
                      <div className="flex items-center justify-center py-6 text-brand">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading...
                      </div>
                    )}

                    {!loadingCities && !loadingZones && !loadingAreas && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    {step === 'CITY' && !loadingCities && (
                      <CommandGroup heading="Select City">
                        {cities
                          ?.filter((c) => c.city_name.toLowerCase().includes(search.toLowerCase()))
                          .map((city) => (
                            <CommandItem
                              key={city.city_id}
                              value={city.city_name}
                              onSelect={() => handleCitySelect(city)}
                              className="py-3 cursor-pointer"
                            >
                              <span>{city.city_name}</span>
                              <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}

                    {step === 'ZONE' && !loadingZones && (
                      <CommandGroup heading={`${selection.city?.city_name} > Select Zone`}>
                        {zones && zones.length > 0 ? (
                          zones
                            .filter((z) => z.zone_name.toLowerCase().includes(search.toLowerCase()))
                            .map((zone) => (
                              <CommandItem
                                key={zone.zone_id}
                                value={zone.zone_name}
                                onSelect={() => handleZoneSelect(zone)}
                                className="py-3 cursor-pointer"
                              >
                                <span>{zone.zone_name}</span>
                                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                              </CommandItem>
                            ))
                        ) : (
                          <CommandItem
                            value={selection.city!.city_name}
                            onSelect={() =>
                              handleZoneSelect({
                                zone_id: selection.city!.city_id,
                                zone_name: selection.city!.city_name,
                              } as Zone)
                            }
                            className="py-3 cursor-pointer font-medium"
                          >
                            <span>{selection.city?.city_name}</span>
                            <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                          </CommandItem>
                        )}
                      </CommandGroup>
                    )}

                    {step === 'AREA' && !loadingAreas && (
                      <CommandGroup heading={`${selection.zone?.zone_name} > Select Area`}>
                        {areas && areas.length > 0 ? (
                          areas
                            .filter((a) => a.area_name.toLowerCase().includes(search.toLowerCase()))
                            .map((area) => (
                              <CommandItem
                                key={area.area_id}
                                value={area.area_name}
                                onSelect={() => handleAreaSelect(area)}
                                className="py-3 cursor-pointer"
                              >
                                <span>{area.area_name}</span>
                                <Check className="ml-auto h-4 w-4 text-brand" />
                              </CommandItem>
                            ))
                        ) : (
                          <CommandItem
                            value={selection.zone!.zone_name}
                            onSelect={() =>
                              handleAreaSelect({
                                area_id: selection.zone!.zone_id,
                                area_name: selection.zone!.zone_name,
                                home_delivery_available: true,
                                pickup_available: true,
                              })
                            }
                            className="py-3 cursor-pointer font-medium"
                          >
                            <span>{selection.zone?.zone_name}</span>
                            <Check className="ml-auto h-4 w-4 text-brand" />
                          </CommandItem>
                        )}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="relative group">
              <MapPin
                className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand transition-colors"
                size={18}
              />
              <textarea
                {...register('landmark')}
                placeholder="Detailed Address (Street / House No / Landmark)"
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none resize-none text-sm placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
