
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Cat, Dog, Bird, Fish, Mouse, Package2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const getCategoryIcon = (petType: string) => {
    switch (petType) {
      case 'cat':
        return <Cat size={48} className="text-gray-400" />;
      case 'dog':
        return <Dog size={48} className="text-gray-400" />;
      case 'bird':
        return <Bird size={48} className="text-gray-400" />;
      case 'fish':
        return <Fish size={48} className="text-gray-400" />;
      case 'rodent':
        return <Mouse size={48} className="text-gray-400" />;
      default:
        return <Package2 size={48} className="text-gray-400" />;
    }
  };

  return (
    <Card 
      className="product-card overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(product)}
    >
      <div className="relative pt-4 px-4">
        {product.discount > 0 && (
          <Badge className="absolute top-6 left-6 bg-pet-orange">-{product.discount}%</Badge>
        )}
        {product.new && (
          <Badge className="absolute top-6 right-6 bg-pet-blue">Новинка</Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute top-6 left-6 bg-gray-500">Нет в наличии</Badge>
        )}
        
        <div className="h-48 flex items-center justify-center mb-4 overflow-hidden rounded-md bg-gray-100">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-icon')) {
                  const iconDiv = document.createElement('div');
                  iconDiv.className = 'fallback-icon flex items-center justify-center w-full h-full';
                  parent.appendChild(iconDiv);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              {getCategoryIcon(product.petType)}
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          {product.discount > 0 ? (
            <>
              <span className="text-xl font-bold text-pet-blue">
                {Math.round(product.price * (1 - product.discount / 100))} ₽
              </span>
              <span className="text-sm text-gray-400 line-through">
                {product.price} ₽
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-pet-blue">{product.price} ₽</span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        {product.brand && (
          <p className="text-xs text-gray-500 mt-1">Бренд: {product.brand}</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full text-center text-sm text-gray-500">
          Нажмите для подробной информации
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
