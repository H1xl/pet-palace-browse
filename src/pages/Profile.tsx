
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Settings, ShoppingBag, User, Package, ListChecks, LogOut } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-4">
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
    <div className="min-h-screen flex flex-col">
      <Navbar cartItemCount={0} currentPage="" />
      
      <div className="container mx-auto px-6 py-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Личный кабинет</h1>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
            <LogOut size={16} />
            Выйти из профиля
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-1 mb-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Заказы</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings size={16} />
                  <span className="hidden sm:inline">Управление</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile" className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о пользователе</CardTitle>
                  <CardDescription>
                    {isAdmin 
                      ? "Вы вошли как администратор магазина" 
                      : "Вы вошли как клиент магазина"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Логин</h3>
                    <p className="mt-1">{currentUser}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Роль</h3>
                    <p className="mt-1">{isAdmin ? 'Администратор' : 'Клиент'}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                    Вернуться на главную
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle>История заказов</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 italic">У вас пока нет заказов</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="settings" className="p-4">
                <Tabs defaultValue="products">
                  <TabsList className="mb-4">
                    <TabsTrigger value="products" className="flex items-center gap-2">
                      <Package size={16} />
                      <span>Товары</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders-management" className="flex items-center gap-2">
                      <ListChecks size={16} />
                      <span>Заказы</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="products">
                    <ProductsManagement />
                  </TabsContent>
                  
                  <TabsContent value="orders-management">
                    <OrdersManagement />
                  </TabsContent>
                </Tabs>
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
