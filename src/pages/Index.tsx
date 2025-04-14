import React, { useState, useEffect } from "react";
import { Truck } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { CartItem } from "@/types/product";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Загружаем корзину из localStorage при монтировании компонента
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        currentPage="home" 
      />
      
      <Hero />
      
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Почему выбирают нас?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pet-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Качественные товары</h3>
              <p className="text-gray-600">Мы отбираем только лучшие товары от проверенных производителей.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-pet-light-blue p-3 rounded-full inline-flex justify-center items-center mb-4">
                <Truck className="h-8 w-8 text-pet-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Экспресс-доставка по городу</h3>
              <p className="text-gray-600">Бесплатная доставка в день заказа для покупок от 1500₽. Доставляем в течение 2-3 часов.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
