
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import FiltersModal from "@/components/FiltersModal";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Product, ProductFilters, ProductSort, CartItem } from "@/types/product";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get current user from localStorage
  const currentUser = localStorage.getItem('currentUser');
  const isLoggedIn = !!currentUser;
  const cartKey = currentUser ? `cartItems_${currentUser}` : 'cartItems_guest';

  const [filters, setFilters] = useState<ProductFilters>({
    category: 'all',
    productType: 'all',
    priceRange: [0, 10000],
    showOnlyNew: false,
    showOnlyDiscounted: false,
    inStock: false,
  });

  const [sort, setSort] = useState<ProductSort>({
    field: 'name',
    direction: 'asc',
  });

  const maxPrice = Math.max(...products.map(p => p.price));

  // Load cart from localStorage
  useEffect(() => {
    if (isLoggedIn) {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [cartKey, isLoggedIn]);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey, isLoggedIn]);

  useEffect(() => {
    // Установим максимальную цену при первой загрузке
    if (filters.priceRange[1] === 10000) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPrice]
      }));
    }
  }, [maxPrice]);

  const applyFiltersAndSort = () => {
    setLoading(true);
    
    // Минимальная задержка для skeleton анимации
    setTimeout(() => {
      let result = [...products];

      // Поиск
      if (searchTerm.trim()) {
        result = result.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Фильтрация по категории
      if (filters.category !== 'all') {
        result = result.filter(product => product.petType === filters.category);
      }

      // Фильтрация по типу товара
      if (filters.productType !== 'all') {
        result = result.filter(product => product.productType === filters.productType);
      }

      // Фильтрация по цене
      result = result.filter(product => {
        const finalPrice = product.discount > 0 
          ? product.price * (1 - product.discount / 100)
          : product.price;
        return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
      });

      // Фильтрация по новинкам
      if (filters.showOnlyNew) {
        result = result.filter(product => product.new);
      }

      // Фильтрация по скидкам
      if (filters.showOnlyDiscounted) {
        result = result.filter(product => product.discount > 0);
      }

      // Фильтрация по наличию
      if (filters.inStock) {
        result = result.filter(product => product.inStock);
      }

      // Сортировка
      result.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sort.field) {
          case 'price':
            aValue = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
            bValue = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
            break;
          case 'dateAdded':
            aValue = new Date(a.dateAdded);
            bValue = new Date(b.dateAdded);
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            return 0;
        }

        if (sort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      setFilteredProducts(result);
      setLoading(false);
    }, 150); // Минимум 150мс для отображения skeleton
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFiltersAndSort();
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      productType: 'all',
      priceRange: [0, maxPrice],
      showOnlyNew: false,
      showOnlyDiscounted: false,
      inStock: false,
    });
    setSort({
      field: 'name',
      direction: 'asc',
    });
    setSearchTerm('');
    // Автоматически применяем сброс
    setTimeout(() => {
      setFilteredProducts(products);
    }, 100);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      toast({
        title: "Необходима авторизация",
        description: "Для добавления товаров в корзину необходимо авторизоваться",
        variant: "destructive"
      });
      return;
    }

    setCartItems(prevItems => {
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
      description: `${product.name} был добавлен в вашу корзину.`
    });
  };

  // Проверяем, применены ли фильтры
  const hasActiveFilters = filters.category !== 'all' || 
    filters.productType !== 'all' || 
    filters.showOnlyNew || 
    filters.showOnlyDiscounted || 
    filters.inStock || 
    searchTerm.trim() !== '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItemCount={isLoggedIn ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0} 
        currentPage="catalog" 
      />
      
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>
        
        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Input 
              type="text" 
              placeholder="Поиск товаров..." 
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search size={18} />
            </button>
          </form>
          
          <Button 
            onClick={() => setIsFiltersOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter size={18} />
            Фильтры и сортировка
          </Button>
        </div>

        {/* Активные фильтры */}
        <div className="mb-4">
          <div className="text-sm text-gray-600">
            {(filters.category !== 'all' || 
              filters.productType !== 'all' || 
              filters.showOnlyNew || 
              filters.showOnlyDiscounted || 
              filters.inStock || 
              searchTerm.trim()) && (
              <Button 
                variant="link" 
                onClick={resetFilters}
                className="ml-2 h-auto p-0 text-sm"
              >
                Сбросить фильтры
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <ProductGrid 
        products={filteredProducts}
        onProductClick={handleProductClick}
        loading={loading}
      />

      {/* Поле найденных товаров - отображается только при фильтрации */}
      {hasActiveFilters && (
        <div className="container mx-auto px-6 pb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              Найдено товаров: <span className="font-semibold text-gray-800">{filteredProducts.length}</span>
            </p>
          </div>
        </div>
      )}
      
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onApply={() => {
          applyFiltersAndSort();
          setIsFiltersOpen(false);
        }}
        onReset={resetFilters}
        maxPrice={maxPrice}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        showAddToCart={isLoggedIn}
      />
      
      <Footer />
    </div>
  );
};

export default Catalog;
