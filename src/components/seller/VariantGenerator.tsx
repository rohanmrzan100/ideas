'use client';

import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

type VariantGeneratorProps = {
  onGenerate: (variants: { size: string; color: string; stock: number }[]) => void;
};

export default function VariantGenerator({ onGenerate }: VariantGeneratorProps) {
  // State for tags
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // State for inputs
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [defaultStock, setDefaultStock] = useState(10);

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

  // THE MAGIC: Cartesian Product Generation
  const handleGenerate = () => {
    const newVariants: any[] = [];

    // If no sizes/colors, handle gracefully
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
    <div className="bg-gray-50 rounded-md p-6 border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
        <Sparkles size={18} className="text-brand" />
        <h3>Bulk Generator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Size Input */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Sizes</label>
          <div className="min-h-[50px] bg-white border border-gray-200 rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all">
            {sizes.map((size) => (
              <span
                key={size}
                className="bg-brand/10 text-brand text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"
              >
                {size}
                <button onClick={() => removeTag(size, sizes, setSizes)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              className="flex-1 min-w-[60px] outline-none text-sm bg-transparent"
              placeholder="Type size & Enter..."
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, sizeInput, sizes, setSizes, () => setSizeInput(''))
              }
              onBlur={() => addTag(sizeInput, sizes, setSizes, () => setSizeInput(''))}
            />
          </div>
        </div>

        {/* Color Input */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Colors</label>
          <div className="min-h-[50px] bg-white border border-gray-200 rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all">
            {colors.map((color) => (
              <span
                key={color}
                className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"
              >
                {color}
                <button onClick={() => removeTag(color, colors, setColors)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              className="flex-1 min-w-[60px] outline-none text-sm bg-transparent"
              placeholder="Type color & Enter..."
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, colorInput, colors, setColors, () => setColorInput(''))
              }
              onBlur={() => addTag(colorInput, colors, setColors, () => setColorInput(''))}
            />
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div className="w-32">
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
            Default Stock
          </label>
          <input
            type="number"
            value={defaultStock}
            onChange={(e) => setDefaultStock(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSizes([]);
              setColors([]);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-500 transition"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={sizes.length === 0 && colors.length === 0}
            className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles size={16} />
            Generate Combinations
          </button>
        </div>
      </div>
    </div>
  );
}
