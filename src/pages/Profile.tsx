
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ShoppingBag, User } from 'lucide-react';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Проверяем авторизацию при загрузке страницы
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  if (!currentUser) {
    return null; // или показывать загрузку
  }

  const isAdmin = currentUser === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItemCount={0} currentPage="" />
      
      <div className="container mx-auto px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>
        
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
                <Card>
                  <CardHeader>
                    <CardTitle>Панель управления</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-amber-50 border border-amber-300 p-4 rounded-md">
                      <p className="text-amber-800">Административные функции доступны только для администратора магазина.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" disabled>Управление товарами</Button>
                      <Button variant="outline" disabled>Управление заказами</Button>
                      <Button variant="outline" disabled>Управление пользователями</Button>
                      <Button variant="outline" disabled>Настройки магазина</Button>
                    </div>
                  </CardContent>
                </Card>
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
