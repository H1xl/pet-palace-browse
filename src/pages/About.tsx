
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const About = () => {
  const [cartItemCount, setCartItemCount] = React.useState(0);

  React.useEffect(() => {
    // Загружаем количество товаров в корзине из localStorage
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      setCartItemCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItemCount={cartItemCount} currentPage="about" />
      
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">О нашем магазине</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Наша миссия</h2>
            <p className="text-lg text-gray-700 mb-4">
              Мы стремимся сделать жизнь домашних питомцев счастливее, а их владельцев - спокойнее. 
              Наш магазин предлагает только качественные товары от проверенных производителей.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Основанный в 2015 году, наш зоомагазин стал надёжным помощником для тысяч владельцев 
              домашних животных в выборе лучших товаров для их питомцев.
            </p>
          </div>
          <div className="relative">
            <AspectRatio ratio={4/3} className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=900&q=80" 
                alt="Счастливые питомцы" 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </div>
        
        <div className="bg-pet-light-blue p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Наши преимущества</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-pet-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Отборные товары</h3>
              <p className="text-gray-600">Мы тщательно выбираем каждый товар в наш ассортимент</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-pet-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Выгодные цены</h3>
              <p className="text-gray-600">Лучшие цены на товары для ваших питомцев</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-pet-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Большой выбор</h3>
              <p className="text-gray-600">У нас более 5000 товаров для всех типов домашних животных</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h2>
          <p className="text-lg text-gray-700 mb-2">
            Если у вас есть вопросы или предложения, пожалуйста, свяжитесь с нами:
          </p>
          <div className="mb-1">
            <strong>Телефон:</strong> +7 (123) 456-7890
          </div>
          <div className="mb-1">
            <strong>Email:</strong> info@zoomir.ru
          </div>
          <div className="mb-1">
            <strong>Адрес:</strong> г. Ставрополь, ул. Примерная, д. 123
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
