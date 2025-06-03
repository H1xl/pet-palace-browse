
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import CartPreview from "@/components/CartPreview";
import Footer from "@/components/Footer";
import { Product, CartItem } from "@/types/product";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
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
      if (currentUser) {
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
      setIsLoading(false);
    }, 600);
  }, [cartKey, currentUser]);
  
  useEffect(() => {
    if (!isLoading && currentUser) {
      // Сохраняем корзину в localStorage при каждом обновлении только для зарегистрированных пользователей
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey, isLoading, currentUser]);

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
    if (!currentUser) {
      toast({
        title: "Необходима авторизация",
        description: "Для добавления товаров в корзину необходимо авторизоваться",
        variant: "destructive"
      });
      return;
    }
    
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

  const getCategoryIconSVG = (petType: string) => {
    switch (petType) {
      case 'cats':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>';
      case 'dogs':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/></svg>';
      case 'birds':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>';
      case 'fish':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7.99 15.98A14.94 14.94 0 0 1 2 12c0-1.68 1.14-3.35 3.01-4.7"/><path d="M12 20c-3.18 0-5.5-1.34-7-4v-8c1.5-2.66 3.82-4 7-4"/></svg>';
      case 'rodent':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M22 9.5c0-3-4-3-4-3m-7 3.5.737-.271c.681-.25 1.263-.825 1.263-1.729 0-2-3-2-3 0 0 1-.5 2-2 3m-2 9-.871-.483c-.658-.365-1.129-1.112-1.129-1.897 0-2.02 3-2.528 3.5.395.667-2.138 0-4.5 0-6.5m8.5-1.5c0-1-1.5-2-1.5-2l1.5 1-1.5-3m-1 4 1.414-1.414"/><path d="M7 14.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Zm7-4a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"/></svg>';
      default:
        return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M2 10h20"/></svg>';
    }
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
        cartItemCount={currentUser ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0} 
        currentPage="catalog"
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">Каталог товаров</h1>
          {currentUser && (
            <CartPreview 
              cartItems={cartItems}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
        </div>
      </div>
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory} 
      />
      
      <ProductGrid 
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        getCategoryIconSVG={getCategoryIconSVG}
      />
      
      <Footer />
    </div>
  );
};

export default Catalog;
