import { Product } from '@/app/data';
import Carousel from './Carousel';

const ProductCard = ({ name, description, price, product_variants, productImages }: Product) => {
  return (
    <div className="flex flex-col gap-1">
      <h1>Product Details</h1>
      <div className="Product Images">
        <Carousel productImages={productImages} />
      </div>
      <div className="name-description mt-2">
        <p className="text-center">{name}</p>
        <p>{description}</p>
      </div>

      <h1> Price:{price}</h1>
      <div className="Product Variants">
        {product_variants.map((variant) => (
          <div key={variant.id} className="mr-2">
            <p>
              <strong>Size:</strong>
              {variant.size}
            </p>
            <p>
              <strong>Color:</strong>
              {variant.color}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
