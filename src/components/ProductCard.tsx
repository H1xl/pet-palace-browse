
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.name} добавлен в вашу корзину.`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Товар добавлен в избранное",
      description: `${product.name} добавлен в ваш список желаний.`,
    });
  };

  return (
    <Card className="product-card overflow-hidden h-full flex flex-col">
      <div className="relative pt-4 px-4">
        {product.discount > 0 && (
          <Badge className="absolute top-6 left-6 bg-pet-orange">-{product.discount}%</Badge>
        )}
        {product.new && (
          <Badge className="absolute top-6 right-6 bg-pet-blue">Новинка</Badge>
        )}
        <div className="h-48 flex items-center justify-center mb-4 overflow-hidden rounded-md">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
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
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-2">
        <Button 
          onClick={handleAddToCart}
          className="flex-1 bg-pet-blue hover:bg-blue-600 text-white"
        >
          <ShoppingCart size={18} className="mr-2" /> В корзину
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleAddToWishlist}
          className="border-pet-orange text-pet-orange hover:bg-pet-light-orange hover:text-pet-orange"
        >
          <Heart size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
