
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService, APIError, CartItem, CreateOrderData } from '@/services/api';
import ErrorPage from '@/components/ErrorPage';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    postal_code: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentUser = apiService.getCurrentUser();
  const isLoggedIn = apiService.isAuthenticated();

  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadCart = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const items = await apiService.getCart();
      setCartItems(items);
    } catch (error) {
      if (error instanceof APIError) {
        setApiError(error.message);
      } else {
        setApiError("Произошла неизвестная ошибка при загрузке корзины");
      }
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    
    try {
      await apiService.updateCartItem(cartItemId, newQuantity);
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
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
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await apiService.removeFromCart(cartItemId);
      setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
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
    }
  };

  const clearCart = async () => {
    try {
      await apiService.clearCart();
      setCartItems([]);
      toast({
        title: "Корзина очищена",
        description: "Все товары были удалены из корзины"
      });
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Необходима авторизация",
        description: "Для оформления заказа необходимо войти в систему",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары в корзину для оформления заказа",
        variant: "destructive"
      });
      return;
    }

    if (!shippingData.street || !shippingData.city || !shippingData.postal_code) {
      toast({
        title: "Заполните адрес доставки",
        description: "Все поля адреса обязательны для заполнения",
        variant: "destructive"
      });
      return;
    }

    try {
      setCheckoutLoading(true);
      
      const orderData: CreateOrderData = {
        total: calculateTotal(),
        shipping_street: shippingData.street,
        shipping_city: shippingData.city,
        shipping_postal_code: shippingData.postal_code,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product_price
        }))
      };

      await apiService.createOrder(orderData);
      await apiService.clearCart();
      setCartItems([]);
      
      toast({
        title: "Заказ создан!",
        description: "Ваш заказ успешно создан. Мы свяжемся с вами в ближайшее время.",
      });
      
      navigate('/profile');
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка создания заказа",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col animate-fade-in">
        <Navbar cartItemCount={0} currentPage="cart" />
        <div className="container mx-auto px-6 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Загрузка корзины...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen flex flex-col animate-fade-in">
        <Navbar cartItemCount={0} currentPage="cart" />
        <ErrorPage
          title="Ошибка загрузки корзины"
          message={apiError}
          onRetry={loadCart}
        />
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col animate-fade-in">
        <Navbar cartItemCount={0} currentPage="cart" />
        <div className="container mx-auto px-6 py-8 flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader>
              <CardTitle className="text-center">Доступ ограничен</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">Для просмотра корзины необходимо войти в систему</p>
              <Button onClick={() => navigate('/login')} className="w-full transition-all duration-200 hover:scale-105">
                Войти в систему
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Navbar cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} currentPage="cart" />
      
      <div className="container mx-auto px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-500 mb-2">Ваша корзина пуста</h2>
            <p className="text-gray-400 mb-6">Добавьте товары из каталога</p>
            <Button onClick={() => navigate('/catalog')} className="transition-all duration-200 hover:scale-105">
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Список товаров */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card key={item.cart_item_id} className="animate-fade-in transition-all duration-200 hover:shadow-md" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Изображение товара */}
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.product_image_url ? (
                          <img 
                            src={item.product_image_url} 
                            alt={item.product_name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="text-gray-400" size={24} />
                          </div>
                        )}
                      </div>
                      
                      {/* Информация о товаре */}
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.product_name}</h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-pet-blue">
                            {Math.round(item.product_price)} ₽
                          </span>
                        </div>
                        
                        {/* Количество и управление */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                              className="transition-all duration-200 hover:scale-110"
                            >
                              <Minus size={14} />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.cart_item_id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                              className="transition-all duration-200 hover:scale-110"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.cart_item_id)}
                            className="text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Общая стоимость за товар */}
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {Math.round(item.product_price * item.quantity)} ₽
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Оформление заказа */}
            <div className="space-y-4">
              {/* Адрес доставки */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Адрес доставки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Улица и дом</label>
                    <Input
                      placeholder="ул. Примерная, д. 1"
                      value={shippingData.street}
                      onChange={(e) => setShippingData(prev => ({ ...prev, street: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Город</label>
                    <Input
                      placeholder="Москва"
                      value={shippingData.city}
                      onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Почтовый индекс</label>
                    <Input
                      placeholder="123456"
                      value={shippingData.postal_code}
                      onChange={(e) => setShippingData(prev => ({ ...prev, postal_code: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Итоговая информация */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Итого</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Товары ({cartItems.reduce((total, item) => total + item.quantity, 0)} шт.)</span>
                    <span>{Math.round(calculateTotal())} ₽</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>К оплате</span>
                    <span>{Math.round(calculateTotal())} ₽</span>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full transition-all duration-200 hover:scale-105" 
                    size="lg"
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? "Создание заказа..." : "Создать заказ"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearCart} 
                    className="w-full transition-all duration-200 hover:scale-105"
                    disabled={checkoutLoading}
                  >
                    Очистить корзину
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
