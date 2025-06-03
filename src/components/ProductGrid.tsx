
import React from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';

export interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  getCategoryIconSVG?: (petType: string) => string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, getCategoryIconSVG }) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              getCategoryIconSVG={getCategoryIconSVG}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
