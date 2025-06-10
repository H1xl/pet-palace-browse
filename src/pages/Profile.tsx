
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, ShoppingBag, User, Package, ListChecks, LogOut, Crown, UserCircle } from 'lucide-react';
import OrdersManagement from '@/components/OrdersManagement';
import ProductsManagement from '@/components/ProductsManagement';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Имитация загрузки
    setTimeout(() => {
      // Проверяем авторизацию при загрузке страницы
      const user = localStorage.getItem('currentUser');
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUser(user);
      setIsLoading(false);
    }, 800);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pet-light-blue to-pet-light-orange">
        <div className="w-full max-w-md px-4 animate-scale-in">
          <div className="text-center mb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-pet-blue rounded-full flex items-center justify-center animate-bounce-gentle">
              <UserCircle size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-medium text-gray-900">Загрузка профиля...</h2>
            <p className="text-sm text-gray-500 mt-1">Пожалуйста, подождите</p>
          </div>
          <Progress value={70} className="h-2" />
        </div>
      </div>
    );
  }

  const isAdmin = currentUser === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar cartItemCount={0} currentPage="" />
      
      <div className="container mx-auto px-6 py-8 flex-1">
        {/* Заголовок профиля */}
        <div className="bg-gradient-to-r from-pet-blue to-pet-orange rounded-xl p-6 mb-8 text-white animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {currentUser?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Добро пожаловать, {currentUser}!</h1>
                <div className="flex items-center gap-2 mt-1">
                  {isAdmin ? (
                    <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400">
                      <Crown size={14} className="mr-1" />
                      Администратор
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-blue-100 hover:bg-blue-400">
                      <User size={14} className="mr-1" />
                      Клиент
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30" 
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Выйти
            </Button>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 m-1 rounded-lg">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                <User size={16} />
                <span className="hidden sm:inline">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Заказы</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                  <Settings size={16} />
                  <span className="hidden sm:inline">Управление</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile" className="p-6 animate-fade-in">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="text-pet-blue" />
                    Информация о пользователе
                  </CardTitle>
                  <CardDescription>
                    {isAdmin 
                      ? "Панель управления администратора зоомагазина" 
                      : "Добро пожаловать в ваш личный кабинет"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Логин</h3>
                        <p className="text-lg font-semibold">{currentUser}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Роль</h3>
                        <p className="text-lg font-semibold">{isAdmin ? 'Администратор' : 'Клиент'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-pet-light-blue rounded-lg">
                        <h3 className="text-sm font-medium text-pet-blue mb-1">Статус аккаунта</h3>
                        <p className="text-lg font-semibold text-pet-blue">Активен</p>
                      </div>
                      <div className="p-4 bg-pet-light-orange rounded-lg">
                        <h3 className="text-sm font-medium text-pet-orange mb-1">Дата регистрации</h3>
                        <p className="text-lg font-semibold text-pet-orange">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full transition-all duration-200 hover:scale-105" 
                    onClick={() => navigate('/')}
                  >
                    Вернуться на главную
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="p-6 animate-fade-in">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="text-pet-blue" />
                    История заказов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">У вас пока нет заказов</p>
                    <p className="text-gray-400 text-sm mt-2">
                      После создания заказа они появятся здесь
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="settings" className="p-0 animate-fade-in">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                  <Tabs defaultValue="products" className="w-full">
                    <TabsList className="mb-6 bg-white shadow-sm">
                      <TabsTrigger value="products" className="flex items-center gap-2 px-6 py-3">
                        <Package size={16} />
                        <span>Управление товарами</span>
                      </TabsTrigger>
                      <TabsTrigger value="orders-management" className="flex items-center gap-2 px-6 py-3">
                        <ListChecks size={16} />
                        <span>Управление заказами</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="products" className="animate-fade-in">
                      <ProductsManagement />
                    </TabsContent>
                    
                    <TabsContent value="orders-management" className="animate-fade-in">
                      <OrdersManagement />
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
