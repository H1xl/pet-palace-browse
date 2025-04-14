
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cat, Dog, Bird, Fish, ShoppingBag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const categories: Category[] = [
    { id: 'all', name: 'Все товары', icon: <ShoppingBag size={20} /> },
    { id: 'dogs', name: 'Собаки', icon: <Dog size={20} /> },
    { id: 'cats', name: 'Кошки', icon: <Cat size={20} /> },
    { id: 'birds', name: 'Птицы', icon: <Bird size={20} /> },
    { id: 'fish', name: 'Рыбки', icon: <Fish size={20} /> },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Категории товаров</h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`category-button flex items-center gap-2 ${
              selectedCategory === category.id ? 'bg-pet-blue text-white' : 'text-gray-600'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.icon}
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
