
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/product";
import { Minus, Plus, Trash2, ShieldCheck, ShoppingCart, UserRound } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentUser = localStorage.getItem('currentUser');
  const cartKey = currentUser ? `cartItems_${currentUser}` : 'cartItems_guest';
  
  useEffect(() => {
    // Имитация загрузки при первом рендере
    setTimeout(() => {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setIsLoading(false);
    }, 600);
  }, [cartKey]);

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };
  
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };
  
  const handleCheckout = () => {
    if (!currentUser) {
      toast({
        title: "Требуется авторизация",
        description: "Для оформления заказа необходимо войти в систему",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    
    // Имитируем процесс оформления заказа
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      toast({
        title: "Заказ оформлен",
        description: "Ваш заказ был успешно оформлен и передан в обработку",
      });
      
      // Очищаем корзину
      setCartItems([]);
      localStorage.setItem(cartKey, JSON.stringify([]));
      setIsProcessing(false);
      
      // Перенаправляем на главную страницу
      setTimeout(() => navigate('/'), 1000);
    }, 2000);
  };
  
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  const getCategoryIcon = (petType: string) => {
    switch (petType) {
      case 'cat':
      case 'cats':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>';
      case 'dog':
      case 'dogs':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/></svg>';
      case 'bird':
      case 'birds':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>';
      case 'fish':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7.99 15.98A14.94 14.94 0 0 1 2 12c0-1.68 1.14-3.35 3.01-4.7"/><path d="M12 20c-3.18 0-5.5-1.34-7-4v-8c1.5-2.66 3.82-4 7-4"/></svg>';
      case 'rodent':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M22 9.5c0-3-4-3-4-3m-7 3.5.737-.271c.681-.25 1.263-.825 1.263-1.729 0-2-3-2-3 0 0 1-.5 2-2 3m-2 9-.871-.483c-.658-.365-1.129-1.112-1.129-1.897 0-2.02 3-2.528 3.5.395.667-2.138 0-4.5 0-6.5m8.5-1.5c0-1-1.5-2-1.5-2l1.5 1-1.5-3m-1 4 1.414-1.414"/><path d="M7 14.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Zm7-4a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"/></svg>';
      default:
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M2 10h20"/></svg>';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar cartItemCount={0} currentPage="" />
        <div className="container mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-4">
              <h2 className="text-xl font-medium">Загрузка корзины...</h2>
              <p className="text-sm text-gray-500 mt-1">Пожалуйста, подождите</p>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} 
        currentPage=""
      />
      
      <div className="container mx-auto px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Корзина</h1>
        
        {isProcessing ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Оформление заказа</h2>
            <div className="mx-auto w-24 h-24 mb-6">
              <ShoppingCart size={64} className="mx-auto text-pet-blue animate-pulse" />
            </div>
            <p className="text-gray-600 mb-6">Пожалуйста, подождите, ваш заказ обрабатывается</p>
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-gray-500">{progress}%</p>
            </div>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Товары в корзине</h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-0">
                        <div className="w-full sm:w-20 h-20 bg-gray-100 rounded overflow-hidden mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.style.display = 'none';
                                if (target.parentElement) {
                                  target.parentElement.innerHTML = getCategoryIcon(item.petType);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" 
                                 dangerouslySetInnerHTML={{ __html: getCategoryIcon(item.petType) }}/>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-500 text-sm">{item.category}</p>
                        </div>
                        
                        <div className="flex items-center mt-4 sm:mt-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4">
                          <span className="text-gray-900 font-medium">{item.price * item.quantity}₽</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-red-500 ml-4"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Сумма заказа</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товары ({cartItems.length})</span>
                    <span>{totalAmount}₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span>0₽</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Итого</span>
                      <span>{totalAmount}₽</span>
                    </div>
                  </div>
                </div>
                
                {!currentUser ? (
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start">
                      <UserRound size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                      <p>Для оформления заказа необходимо войти в систему</p>
                    </div>
                    <Button 
                      className="w-full bg-pet-blue hover:bg-blue-600"
                      onClick={() => navigate('/login')}
                    >
                      Войти для оформления
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3 text-sm text-green-800 flex items-start">
                      <ShieldCheck size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                      <p>Вы вошли как {currentUser} и можете оформить заказ</p>
                    </div>
                    <Button 
                      className="w-full bg-pet-blue hover:bg-blue-600"
                      onClick={handleCheckout}
                    >
                      Оформить заказ
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ваша корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте товары из нашего каталога</p>
            <Button className="bg-pet-blue hover:bg-blue-600" asChild>
              <Link to="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
