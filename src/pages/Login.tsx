
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(30);
    
    // Имитируем задержку и показываем прогресс
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const validUsers = [
        { username: 'admin', password: 'admin' },
        { username: 'client', password: 'client' },
        { username: 'client1', password: 'client1' }
      ];
      
      const foundUser = validUsers.find(
        user => user.username === username && user.password === password
      );
      
      if (foundUser) {
        localStorage.setItem('currentUser', foundUser.username);
        toast({
          title: "Успешный вход",
          description: foundUser.username === 'admin' 
            ? "Вы вошли как администратор" 
            : "Вы вошли как клиент",
        });
        navigate('/profile');
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверное имя пользователя или пароль",
          variant: "destructive"
        });
        setIsLoading(false);
        setProgress(0);
      }
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
            {isLoading ? (
              <div className="py-8">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Выполняется вход...</h3>
                  <p className="text-sm text-gray-500 mt-1">Пожалуйста, подождите</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ) : (
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
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-pet-blue hover:bg-blue-600" 
                  disabled={isLoading}
                >
                  Войти
                </Button>
              </form>
            )}
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
