//
'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter, // Imported here now
  AlertDialogHeader, // Imported here now
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Check, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

type VariantGeneratorProps = {
  onGenerate: (variants: { size: string; color: string; stock: number }[]) => void;
  suggestedColors?: string[];
};

export default function VariantGenerator({
  onGenerate,
  suggestedColors = [],
}: VariantGeneratorProps) {
  // State for tags
  const [sizes, setSizes] = useState<string[]>(['L', 'XL']);
  const [colors, setColors] = useState<string[]>(['red']);

  // State for inputs
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [defaultStock, setDefaultStock] = useState(5);

  // Controls specific popover state
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);

  // Helper to add tags
  const addTag = (
    value: string,
    currentList: string[],
    setList: (l: string[]) => void,
    clearInput: () => void,
  ) => {
    const trimmed = value.trim();
    if (trimmed && !currentList.includes(trimmed)) {
      setList([...currentList, trimmed]);
      clearInput();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    value: string,
    list: string[],
    setList: (l: string[]) => void,
    clearInput: () => void,
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(value, list, setList, clearInput);
    }
  };

  const removeTag = (itemToRemove: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.filter((item) => item !== itemToRemove));
  };

  const handleGenerate = () => {
    const newVariants: { size: string; color: string; stock: number }[] = [];
    const finalSizes = sizes.length > 0 ? sizes : ['Free Size'];
    const finalColors = colors.length > 0 ? colors : ['Standard'];

    finalSizes.forEach((size) => {
      finalColors.forEach((color) => {
        newVariants.push({
          size: size,
          color: color,
          stock: defaultStock,
        });
      });
    });

    onGenerate(newVariants);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
        <Sparkles size={18} className="text-brand" />
        <h3>Bulk Generator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Size Input */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Sizes</label>
          <div className="min-h-[50px] bg-white border border-gray-200 rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 transition-all">
            {sizes.map((size) => (
              <span
                key={size}
                className="bg-brand/10 text-brand text-xs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 border border-brand/20"
              >
                {size}
                <button
                  onClick={() => removeTag(size, sizes, setSizes)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              className="flex-1 min-w-[80px] outline-none text-sm bg-transparent px-2 py-1.5"
              placeholder="Type size..."
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, sizeInput, sizes, setSizes, () => setSizeInput(''))
              }
              onBlur={() => addTag(sizeInput, sizes, setSizes, () => setSizeInput(''))}
            />
          </div>
        </div>

        {/* Color Input - Enhanced with Popover and Visual Dot */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Colors</label>
          <div
            className="min-h-[50px] bg-white border border-gray-200 rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 transition-all cursor-text"
            onClick={() => setColorPopoverOpen(true)}
          >
            {/* Render existing tags */}
            {colors.map((color) => (
              <span
                key={color}
                className="bg-gray-100 text-gray-700 text-xs font-bold pl-2 pr-1.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-200"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                {color}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(color, colors, setColors);
                  }}
                  className="hover:text-red-500 ml-1"
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* Input with Popover Trigger */}
            <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="flex-1 min-w-[120px] relative flex items-center gap-2 px-2">
                  {/* Visual Dot for Current Input */}
                  <div className="w-3 h-3 rounded-full border border-gray-300 shadow-sm shrink-0 overflow-hidden bg-gray-50 transition-all duration-300">
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: colorInput || 'transparent' }}
                    />
                    {!colorInput && (
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
                    )}
                  </div>

                  <input
                    className="flex-1 outline-none text-sm bg-transparent py-1.5"
                    placeholder="Type color..."
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleKeyDown(e, colorInput, colors, setColors, () => {
                          setColorInput('');
                        });
                      }
                    }}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-[220px]" align="start" side="bottom" sideOffset={8}>
                <Command>
                  <CommandList>
                    <CommandEmpty className="p-2 text-xs text-gray-500">
                      Press Enter to add &quot;{colorInput}&quot;
                    </CommandEmpty>

                    <CommandGroup heading="From Uploaded Images">
                      {suggestedColors.length === 0 && (
                        <div className="px-2 text-xs text-gray-400 italic">
                          No image colors available
                        </div>
                      )}
                      {suggestedColors.map((color) => (
                        <CommandItem
                          key={color}
                          value={color}
                          onSelect={() => {
                            addTag(color, colors, setColors, () => setColorInput(''));
                            setColorPopoverOpen(true); // Keep open to add more
                          }}
                          className="cursor-pointer text-xs flex items-center gap-2 py-2"
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                          {color}
                          {colors.includes(color) && (
                            <Check className="ml-auto h-3 w-3 text-brand" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>

                    <CommandGroup heading="Standard">
                      {['Black', 'White', 'Navy', 'Red', 'Grey', 'Blue', 'Green'].map((c) => (
                        <CommandItem
                          key={c}
                          value={c}
                          onSelect={() => {
                            addTag(c, colors, setColors, () => setColorInput(''));
                            setColorPopoverOpen(true);
                          }}
                          className="cursor-pointer text-xs flex items-center gap-2 py-2"
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                          {c}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between mt-4 border-t border-gray-200 pt-4">
        <div className="w-32">
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
            Default Stock
          </label>
          <input
            type="number"
            value={defaultStock}
            onChange={(e) => setDefaultStock(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setSizes([]);
              setColors([]);
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Reset
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={sizes.length === 0 && colors.length === 0}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Sparkles size={16} />
                Generate Combinations
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Generate Variants?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will generate {(sizes.length || 1) * (colors.length || 1)} variant
                  combinations based on your selection.
                  <br />
                  <span className="font-bold text-red-500 mt-2 block">
                    Warning: This will replace your current variant list.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-gray-900 hover:bg-black text-white"
                  onClick={handleGenerate}
                >
                  Generate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
