
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Cat, Dog, Bird, Fish, Mouse, Package2, ShoppingCart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  showAddToCart = false 
}) => {
  if (!product) return null;

  const getCategoryIcon = (petType: string) => {
    switch (petType) {
      case 'cat':
        return <Cat size={24} className="text-gray-600" />;
      case 'dog':
        return <Dog size={24} className="text-gray-600" />;
      case 'bird':
        return <Bird size={24} className="text-gray-600" />;
      case 'fish':
        return <Fish size={24} className="text-gray-600" />;
      case 'rodent':
        return <Mouse size={24} className="text-gray-600" />;
      default:
        return <Package2 size={24} className="text-gray-600" />;
    }
  };

  const finalPrice = product.discount > 0 
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Изображение и основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(product.petType)}
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 space-y-1">
                {product.discount > 0 && (
                  <Badge className="bg-pet-orange">-{product.discount}%</Badge>
                )}
                {product.new && (
                  <Badge className="bg-pet-blue">Новинка</Badge>
                )}
                {!product.inStock && (
                  <Badge className="bg-gray-500">Нет в наличии</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getCategoryIcon(product.petType)}
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-pet-blue">{finalPrice} ₽</span>
                  {product.discount > 0 && (
                    <span className="text-lg text-gray-400 line-through">{product.price} ₽</span>
                  )}
                </div>
                
                {product.brand && (
                  <p className="text-sm text-gray-600">Бренд: <span className="font-medium">{product.brand}</span></p>
                )}
                
                {product.weight && (
                  <p className="text-sm text-gray-600">Вес: <span className="font-medium">{product.weight}</span></p>
                )}
              </div>
              
              {showAddToCart && product.inStock && (
                <Button 
                  onClick={() => onAddToCart?.(product)}
                  className="w-full flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Добавить в корзину
                </Button>
              )}
              
              {!product.inStock && (
                <Button disabled className="w-full">
                  Нет в наличии
                </Button>
              )}
            </div>
          </div>
          
          {/* Описание */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Характеристики */}
          {product.specifications && product.specifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-pet-blue rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
