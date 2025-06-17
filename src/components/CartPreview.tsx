
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { apiService, APIError, CartItem } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CartPreview = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLoggedIn = apiService.isAuthenticated();

  const loadCart = async () => {
    if (!isLoggedIn) return;
    
    try {
      setLoading(true);
      const items = await apiService.getCart();
      setCartItems(items);
    } catch (error) {
      if (error instanceof APIError) {
        console.error('Error loading cart:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isLoggedIn]);

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (updating) return;
    
    try {
      setUpdating(true);
      await apiService.removeFromCart(cartItemId);
      setCartItems(prev => prev.filter(item => item.cart_item_id !== cartItemId));
      toast({
        title: "Товар удален",
        description: "Товар был удален из корзины"
      });
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    if (updating) return;
    
    if (quantity <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }

    try {
      setUpdating(true);
      await apiService.updateCartItem(cartItemId, quantity);
      setCartItems(prev => 
        prev.map(item => 
          item.cart_item_id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product_price * item.quantity);
  }, 0);

  const handleCheckout = () => {
    navigate('/cart');
  };

  if (!isLoggedIn) {
    return (
      <Button variant="outline" onClick={() => navigate('/login')}>
        <ShoppingCart size={20} />
        <span className="ml-2">Войти</span>
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" onClick={loadCart}>
          <ShoppingCart size={20} />
          <span className="ml-2">Корзина</span>
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-pet-orange">{totalItems}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
          <SheetDescription>
            {loading ? "Загрузка..." : `У вас ${totalItems} ${totalItems === 1 ? 'товар' : 'товаров'} в корзине`}
          </SheetDescription>
        </SheetHeader>
        
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p>Загрузка корзины...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Ваша корзина пуста</p>
          </div>
        ) : (
          <div className="py-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className="flex gap-4 py-2 border-b">
                <div className="w-16 h-16 overflow-hidden rounded-md shrink-0">
                  <img 
                    src={item.product_image_url || '/placeholder.svg'} 
                    alt={item.product_name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.product_name}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-semibold text-pet-blue">{Math.round(item.product_price)} ₽</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full" 
                      onClick={() => handleUpdateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1 || updating}
                    >
                      -
                    </Button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full" 
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                      disabled={updating}
                    >
                      +
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-auto h-8 w-8 text-gray-400 hover:text-destructive" 
                      onClick={() => handleRemoveFromCart(item.cart_item_id)}
                      disabled={updating}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {cartItems.length > 0 && (
          <SheetFooter className="mt-4 sm:mt-0">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between py-4 border-t border-b">
                <span className="font-semibold">Итого:</span>
                <span className="font-bold text-lg">{Math.round(subtotal)} ₽</span>
              </div>
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Button className="w-full bg-pet-blue hover:bg-blue-600" onClick={handleCheckout}>
                    Оформить заказ
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Продолжить покупки
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartPreview;
