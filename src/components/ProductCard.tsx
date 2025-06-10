
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Cat, Dog, Bird, Fish, Mouse, Package2, Hand } from 'lucide-react';

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const parent = target.parentElement;
    
    if (parent) {
      target.style.display = 'none';
      
      if (!parent.querySelector('.fallback-icon')) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'fallback-icon flex items-center justify-center w-full h-full';
        
        // Получаем правильную иконку для категории
        const iconElement = getCategoryIcon(product.petType);
        
        // Создаем div и добавляем иконку
        const iconDiv = document.createElement('div');
        iconDiv.className = 'text-gray-400';
        
        // Создаем SVG элемент для нужной категории
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '48');
        svg.setAttribute('height', '48');
        svg.setAttribute('class', 'text-gray-400');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        
        // Добавляем соответствующий путь для каждой категории
        let pathData = '';
        switch (product.petType) {
          case 'cat':
            pathData = 'm12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01';
            break;
          case 'dog':
            pathData = 'm12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01';
            break;
          case 'bird':
            pathData = 'M16 7h.01M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20l.4-2zm0 0L20 20';
            break;
          case 'fish':
            pathData = 'M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6z M12 12h.01';
            break;
          case 'rodent':
            pathData = 'm12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01';
            break;
          default:
            pathData = 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z';
        }
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('d', pathData);
        
        svg.appendChild(path);
        iconDiv.appendChild(svg);
        iconContainer.appendChild(iconDiv);
        parent.appendChild(iconContainer);
      }
    }
  };

  return (
    <Card 
      className="product-card overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 relative group opacity-0 animate-fade-in-up"
      onClick={() => onClick(product)}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Повернутая иконка указательного пальца в правом нижнем углу */}
      <div className="absolute bottom-3 right-3 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none transform -rotate-45">
        <Hand size={32} className="text-gray-600" />
      </div>
      
      <div className="relative pt-4 px-4 z-10">
        {product.discount > 0 && (
          <Badge className="absolute top-6 left-6 bg-pet-orange animate-scale-in z-20">-{product.discount}%</Badge>
        )}
        {product.new && (
          <Badge className="absolute top-6 right-6 bg-pet-blue animate-scale-in z-20">Новинка</Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute top-6 left-6 bg-gray-500 animate-scale-in z-20">Нет в наличии</Badge>
        )}
        
        <div className="h-48 flex items-center justify-center mb-4 overflow-hidden rounded-md bg-gray-100 group-hover:bg-gray-50 transition-colors duration-200">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              {getCategoryIcon(product.petType)}
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="flex-grow z-10 relative">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-pet-blue transition-colors duration-200">{product.name}</h3>
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
    </Card>
  );
};

export default ProductCard;
