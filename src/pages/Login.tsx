
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('currentUser', 'admin');
        toast({
          title: "Успешный вход",
          description: "Вы вошли как администратор",
        });
        navigate('/profile');
      } else if (username === 'client' && password === 'client') {
        localStorage.setItem('currentUser', 'client');
        toast({
          title: "Успешный вход",
          description: "Вы вошли как клиент",
        });
        navigate('/profile');
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверное имя пользователя или пароль",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 800); // Имитация задержки сервера
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItemCount={0} currentPage="" />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Вход в аккаунт</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                  <User size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type="text" 
                    placeholder="Имя пользователя" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                  <Lock size={18} className="text-gray-500 mr-2" />
                  <Input 
                    type="password" 
                    placeholder="Пароль" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 px-1">
                  Для тестового входа используйте логин/пароль:
                  <br />- admin/admin для администратора
                  <br />- client/client для клиента
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-pet-blue hover:bg-blue-600" 
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              У вас нет аккаунта? Обратитесь к администратору.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
