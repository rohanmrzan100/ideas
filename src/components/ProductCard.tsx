import Image from 'next/image';

const ProductCard = () => {
  return (
    <div className="container flex flex-col bg-white text-black p-4 rounded-sm gap-1">
      <div className="flex justify-center mb-2">
        <Image
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
          alt="Jacket"
          height={200}
          width={300}
        />
      </div>
      <h1 className="text-center">Fabric T-shirt</h1>
      <div className="color">Colors</div>
      <div className="size">Size</div>
      <div className="flex flex-row justify-between items-center">
        <span> Price: Rs.20,000</span>
        <span
          className="py-1 px-2 rounded-xl bg-emerald-600   font-semibold text-white 
         shadow-md transition-all duration-200
         hover:bg-emerald-700 hover:shadow-lg
         active:scale-[0.98]
         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
         disabled:cursor-not-allowed disabled:bg-emerald-300 cursor-pointer"
        >
          Checkout
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
