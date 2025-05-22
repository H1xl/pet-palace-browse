
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import CartPreview from "@/components/CartPreview";
import Footer from "@/components/Footer";
import { Product, CartItem } from "@/types/product";
import { products } from "@/data/products";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get current user for user-specific cart
  const currentUser = localStorage.getItem('currentUser');
  const cartKey = currentUser ? `cartItems_${currentUser}` : 'cartItems_guest';

  useEffect(() => {
    // Имитация загрузки
    setTimeout(() => {
      // Загружаем корзину из localStorage при монтировании компонента
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setIsLoading(false);
    }, 600);
  }, [cartKey]);
  
  useEffect(() => {
    if (!isLoading) {
      // Сохраняем корзину в localStorage при каждом обновлении
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey, isLoading]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.petType === selectedCategory)
      );
    }
  }, [selectedCategory]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.name} был добавлен в вашу корзину.`,
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Товар удален из корзины",
      description: "Товар был удален из вашей корзины.",
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar cartItemCount={0} currentPage="catalog" />
        <div className="container mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-4">
              <h2 className="text-xl font-medium">Загрузка каталога...</h2>
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
        currentPage="catalog"
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">Каталог товаров</h1>
          <CartPreview 
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>
      </div>
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory} 
      />
      
      <ProductGrid 
        products={filteredProducts}
        onAddToCart={handleAddToCart}
      />
      
      <Footer />
    </div>
  );
};

export default Catalog;
