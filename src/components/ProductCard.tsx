
import React from 'react';
import { Product } from '@/types/product';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, ImageOff, Cat, Dog, Bird, Fish, Mouse } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  getCategoryIconSVG?: (petType: string) => string;
}

const ProductCard = ({ product, onAddToCart, getCategoryIconSVG }: ProductCardProps) => {
  const { toast } = useToast();
  const currentUser = localStorage.getItem('currentUser');
  
  const handleAddToCart = () => {
    if (!currentUser) {
      toast({
        title: "Необходима авторизация",
        description: "Чтобы добавить товар в корзину, необходимо авторизоваться",
        variant: "destructive"
      });
      return;
    }
    
    onAddToCart(product);
  };
  
  const actualPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const getCategoryIcon = (petType: string) => {
    const iconProps = { size: 48, className: "text-gray-400" };
    
    switch (petType) {
      case 'cats':
        return <Cat {...iconProps} />;
      case 'dogs':
        return <Dog {...iconProps} />;
      case 'birds':
        return <Bird {...iconProps} />;
      case 'fish':
        return <Fish {...iconProps} />;
      case 'rodent':
        return <Mouse {...iconProps} />;
      default:
        return <ImageOff {...iconProps} />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-transform hover:-translate-y-1">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
              const container = target.parentElement;
              if (container) {
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'w-full h-full flex items-center justify-center';
                container.appendChild(fallbackDiv);
                
                // Render the React icon component
                const iconElement = getCategoryIcon(product.petType);
                import('react-dom/client').then(({ createRoot }) => {
                  const root = createRoot(fallbackDiv);
                  root.render(iconElement);
                });
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getCategoryIcon(product.petType)}
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.new && (
            <Badge className="bg-pet-blue text-white">Новинка</Badge>
          )}
          
          {product.discount > 0 && (
            <Badge variant="outline" className="text-pet-orange border-pet-orange bg-white">
              -{product.discount}%
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs text-gray-500 mb-1">{product.category}</span>
        <span className="text-xs text-gray-400 mb-1">Артикул: {product.articleCode}</span>
        <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            {product.discount > 0 ? (
              <div>
                <span className="font-bold text-lg">{Math.round(actualPrice)}₽</span>
                <span className="text-sm line-through text-gray-400 ml-1">{product.price}₽</span>
              </div>
            ) : (
              <span className="font-bold text-lg">{product.price}₽</span>
            )}
          </div>
          
          <Button 
            onClick={handleAddToCart} 
            size="sm" 
            className="bg-pet-blue hover:bg-blue-600"
          >
            {!currentUser ? <User size={16} /> : <ShoppingCart size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
