
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
        
        // Создаем SVG элемент вручную
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '48');
        svg.setAttribute('height', '48');
        svg.setAttribute('class', 'text-gray-400');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        
        // Добавляем подходящую иконку в зависимости от типа питомца
        switch (product.petType) {
          case 'cat':
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />';
            break;
          case 'dog':
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />';
            break;
          case 'bird':
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />';
            break;
          default:
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />';
        }
        
        iconContainer.appendChild(svg);
        parent.appendChild(iconContainer);
      }
    }
  };

  return (
    <Card 
      className="product-card overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 relative group animate-fade-in-up"
      onClick={() => onClick(product)}
    >
      {/* Полупрозрачная иконка пальца в правом нижнем углу */}
      <div className="absolute bottom-2 right-2 z-10 opacity-30 group-hover:opacity-50 transition-opacity duration-200 pointer-events-none">
        <Hand size={20} className="text-gray-600" />
      </div>
      
      <div className="relative pt-4 px-4">
        {product.discount > 0 && (
          <Badge className="absolute top-6 left-6 bg-pet-orange animate-scale-in">-{product.discount}%</Badge>
        )}
        {product.new && (
          <Badge className="absolute top-6 right-6 bg-pet-blue animate-scale-in">Новинка</Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute top-6 left-6 bg-gray-500 animate-scale-in">Нет в наличии</Badge>
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
      
      <CardContent className="flex-grow">
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
