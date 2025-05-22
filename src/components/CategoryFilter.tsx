
import React from 'react';
import { ImageOff } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const categories = [
  { id: 'all', name: 'Все товары', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80' },
  { id: 'cat', name: 'Для кошек', image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80' },
  { id: 'dog', name: 'Для собак', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80' },
  { id: 'bird', name: 'Для птиц', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80' },
  { id: 'fish', name: 'Для рыб', image: '' },
  { id: 'rodent', name: 'Для грызунов', image: '' },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="bg-white py-6 shadow-sm">
      <div className="container mx-auto px-6">
        <h2 className="text-lg font-medium mb-4">Категории</h2>
        <div className="flex flex-nowrap overflow-x-auto pb-2 gap-4 -mx-2 px-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex flex-col items-center min-w-[100px] p-3 rounded-lg transition-colors ${
                selectedCategory === category.id 
                ? "bg-pet-light-blue text-pet-blue" 
                : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.parentElement?.classList.add('flex', 'justify-center', 'items-center');
                      target.parentElement?.classList.remove('overflow-hidden');
                      target.replaceWith(document.createElement('div'));
                      target.parentElement?.appendChild(
                        (() => {
                          const el = document.createElement('div');
                          el.className = 'flex justify-center items-center';
                          el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><line x1="2" x2="22" y1="2" y2="22"></line><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path><line x1="13.5" x2="6.5" y1="13.5" y2="20.5"></line><path d="M14 14v6"></path><path d="M10 7v6"></path><path d="M18 18h0"></path><path d="M16.5 2.5C20 6 20 10 18 14"></path></svg>`;
                          return el;
                        })()
                      );
                    }}
                  />
                ) : (
                  <ImageOff size={24} className="text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
