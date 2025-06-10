
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Cat, Dog, Bird, Fish, Mouse, Package2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
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

  const getProductTypeName = (type: string) => {
    const types: Record<string, string> = {
      food: 'Корм',
      toys: 'Игрушки',
      accessories: 'Аксессуары',
      cages: 'Клетки и домики',
      care: 'Уход',
      medicine: 'Лекарства',
    };
    return types[type] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Изображение */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              getCategoryIcon(product.petType)
            )}
          </div>
          
          {/* Информация */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {getCategoryIcon(product.petType)}
              <span className="text-sm text-gray-600">{product.category}</span>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline">{getProductTypeName(product.productType)}</Badge>
              {product.new && <Badge className="bg-pet-blue">Новинка</Badge>}
              {product.discount > 0 && (
                <Badge className="bg-pet-orange">-{product.discount}%</Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive">Нет в наличии</Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                {product.discount > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-pet-blue">
                      {Math.round(product.price * (1 - product.discount / 100))} ₽
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price} ₽
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-pet-blue">{product.price} ₽</span>
                )}
              </div>
            </div>

            {product.brand && (
              <div>
                <span className="text-sm font-medium">Бренд: </span>
                <span className="text-sm">{product.brand}</span>
              </div>
            )}

            {product.weight && (
              <div>
                <span className="text-sm font-medium">Вес: </span>
                <span className="text-sm">{product.weight}</span>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Описание</h4>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Характеристики</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>• {spec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-gray-400">
              Добавлен: {new Date(product.dateAdded).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
