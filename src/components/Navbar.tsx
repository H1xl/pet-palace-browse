
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  cartItemCount: number;
}

const Navbar = ({ cartItemCount }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
    // Implement search functionality
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMenu} 
              className="lg:hidden text-gray-700"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-pet-blue">Pet<span className="text-pet-orange">Palace</span></span>
            </a>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-pet-blue transition-colors">Главная</a>
            <a href="#" className="text-gray-700 hover:text-pet-blue transition-colors">Каталог</a>
            <a href="#" className="text-gray-700 hover:text-pet-blue transition-colors">О нас</a>
            <a href="#" className="text-gray-700 hover:text-pet-blue transition-colors">Контакты</a>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Input 
                type="text" 
                placeholder="Поиск товаров..." 
                className="w-64 pr-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>

            <Button variant="ghost" className="relative">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-pet-orange">{cartItemCount}</Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-pet-blue transition-colors">Главная</a>
              <a href="#" className="text-gray-700 hover:text-pet-blue transition-colors">Каталог</a>
              <a href="#" className="text-gray-700 hover:text-pet-blue transition-colors">О нас</a>
              <a href="#" className="text-gray-700 hover:text-pet-blue transition-colors">Контакты</a>
              <form onSubmit={handleSearch} className="flex md:hidden relative">
                <Input 
                  type="text" 
                  placeholder="Поиск товаров..." 
                  className="w-full pr-10"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
