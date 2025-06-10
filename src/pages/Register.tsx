
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'ФИО обязательно для заполнения';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Логин обязателен для заполнения';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Логин должен содержать минимум 3 символа';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Номер телефона обязателен для заполнения';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Убираем ошибку для поля при его изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, исправьте ошибки в форме",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress(20);
    
    // Имитируем процесс регистрации
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
      
      // Сохраняем пользователя в localStorage (имитация регистрации)
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      users.push({
        ...formData,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString()
      });
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      toast({
        title: "Регистрация успешна!",
        description: "Вы успешно зарегистрированы. Теперь вы можете войти в систему.",
      });
      
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItemCount={0} currentPage="" />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-pet-light-blue to-pet-light-orange">
        <Card className="w-full max-w-md animate-scale-in shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-pet-blue rounded-full flex items-center justify-center">
              <UserPlus size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 animate-fade-in">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Создание аккаунта...</h3>
                  <p className="text-sm text-gray-500 mt-1">Пожалуйста, подождите</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                    <User size={18} className="text-gray-500 mr-2" />
                    <Input 
                      type="text" 
                      name="fullName"
                      placeholder="ФИО" 
                      value={formData.fullName} 
                      onChange={handleChange}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                    <User size={18} className="text-gray-500 mr-2" />
                    <Input 
                      type="text" 
                      name="username"
                      placeholder="Логин" 
                      value={formData.username} 
                      onChange={handleChange}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                    <Mail size={18} className="text-gray-500 mr-2" />
                    <Input 
                      type="email" 
                      name="email"
                      placeholder="Email" 
                      value={formData.email} 
                      onChange={handleChange}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                    <Phone size={18} className="text-gray-500 mr-2" />
                    <Input 
                      type="tel" 
                      name="phone"
                      placeholder="Номер телефона" 
                      value={formData.phone} 
                      onChange={handleChange}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                    <Lock size={18} className="text-gray-500 mr-2" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      placeholder="Пароль" 
                      value={formData.password} 
                      onChange={handleChange}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                    <Lock size={18} className="text-gray-500 mr-2" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      placeholder="Повторите пароль" 
                      value={formData.confirmPassword} 
                      onChange={handleChange}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-pet-blue hover:bg-blue-600 transition-all duration-200 hover:scale-105" 
                  disabled={isLoading}
                >
                  Зарегистрироваться
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Уже есть аккаунт?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-pet-blue hover:underline font-medium"
              >
                Войти
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
