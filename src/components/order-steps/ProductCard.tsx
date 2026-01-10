import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

// Types matching your API structure
type ProductImage = {
  id: string;
  url: string;
  color: string;
  position: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  productImages: ProductImage[];
};

type ProductCardDisplayProps = {
  product: Product;
  uniqueSizes: string[];
  uniqueColors: string[];
  originalPrice: number;
  onColorSelect: (color: string) => void;
};

const ProductCardDisplay = ({ 
  product, 
  uniqueSizes, 
  uniqueColors, 
  originalPrice,
  onColorSelect 
}: ProductCardDisplayProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sort images by position
  const sortedImages = useMemo(() => {
    return [...product.productImages].sort((a, b) => a.position - b.position);
  }, [product.productImages]);

  // Filter images by selected color, or show all if no color selected
  const filteredImages = useMemo(() => {
    if (!selectedColor) return sortedImages;
    return sortedImages.filter(img => 
      img.color.toLowerCase() === selectedColor.toLowerCase()
    );
  }, [sortedImages, selectedColor]);

  // Use filtered images or fall back to all images
  const displayImages = filteredImages.length > 0 ? filteredImages : sortedImages;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Reset image index when color changes
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
    onColorSelect(color);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Get color hex or use the color name as fallback
  const getColorStyle = (color: string) => {
    const colorLower = color.toLowerCase();
    
    // Common color mappings
    const colorMap: Record<string, string> = {
      'red': '#DC2626',
      'blue': '#2563EB',
      'green': '#16A34A',
      'yellow': '#EAB308',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'pink': '#EC4899',
      'purple': '#9333EA',
      'orange': '#EA580C',
      'brown': '#92400E',
      'beige': '#D4C5B0',
      'burgundy': '#5C3639',
      'navy': '#1E3A8A',
      'teal': '#0D9488',
      'maroon': '#7F1D1D',
    };

    return colorMap[colorLower] || colorLower;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Image Carousel */}
        <div className="relative aspect-[3/4] bg-gray-50">
          {displayImages.length > 0 ? (
            <img
              src={displayImages[currentImageIndex].url}
              alt={`${product.name} - ${displayImages[currentImageIndex].color}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
          
          {/* Carousel Controls */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Details */}
        <div className="p-8 text-center">
          {/* Product Name */}
          <h2 className="text-2xl font-light text-gray-700 mb-2">
            {product.name}
          </h2>

          {/* Size & Color Label */}
          <p className="text-sm text-gray-400 tracking-wider mb-6">
            SIZE & COLOR
          </p>

          {/* Size Selection */}
          <div className="flex justify-center gap-3 mb-6">
            {uniqueSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className={`w-14 h-14 rounded-full border-2 transition-all ${
                  selectedSize === size
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="text-gray-600 font-light">{size}</span>
              </button>
            ))}
          </div>

          {/* Color Selection */}
          <div className="flex justify-center gap-4 mb-8">
            {uniqueColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-12 h-12 rounded-full transition-all ${
                  selectedColor === color
                    ? 'ring-2 ring-offset-2 ring-gray-400'
                    : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                }`}
                style={{ backgroundColor: getColorStyle(color) }}
                aria-label={color}
                title={color}
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-4xl font-light text-gray-600">
              ${product.price}
            </div>
           
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ProductCardDisplay;