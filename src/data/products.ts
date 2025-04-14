
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: "1",
    name: "Премиум корм для собак «Счастливый Пёс»",
    description: "Полноценный сбалансированный корм для взрослых собак всех пород с курицей и рисом.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Корм",
    discount: 15,
    new: false,
    petType: "dogs"
  },
  {
    id: "2",
    name: "Мягкая игрушка для кошек «Мышка с кошачьей мятой»",
    description: "Мягкая игрушка с кошачьей мятой внутри для активных игр вашей кошки.",
    price: 350,
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Игрушки",
    discount: 0,
    new: true,
    petType: "cats"
  },
  {
    id: "3",
    name: "Аквариум с LED-подсветкой «Подводный мир»",
    description: "Современный аквариум с LED-подсветкой, фильтром и всем необходимым для запуска.",
    price: 8500,
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Аквариумы",
    discount: 10,
    new: false,
    petType: "fish"
  },
  {
    id: "4",
    name: "Комфортная клетка для птиц «Небесный дом»",
    description: "Просторная клетка для средних и мелких птиц с жердочками и кормушками.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1611173533528-79c1309a48bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Клетки",
    discount: 0,
    new: false,
    petType: "birds"
  },
  {
    id: "5",
    name: "Лежак для собак «Мягкий сон»",
    description: "Мягкий и уютный лежак для собак средних и крупных пород с ортопедическим эффектом.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Лежаки",
    discount: 5,
    new: false,
    petType: "dogs"
  },
  {
    id: "6",
    name: "Когтеточка-столбик «Царапка»",
    description: "Прочная когтеточка-столбик с игрушкой для вашей кошки.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Когтеточки",
    discount: 0,
    new: true,
    petType: "cats"
  },
  {
    id: "7",
    name: "Корм для рыб «Аква Меню»",
    description: "Питательный корм для всех видов аквариумных рыб, обогащенный витаминами.",
    price: 320,
    image: "https://images.unsplash.com/photo-1520302519878-500e6abf8171?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Корм",
    discount: 0,
    new: false,
    petType: "fish"
  },
  {
    id: "8",
    name: "Витаминный комплекс для птиц «Здоровое оперение»",
    description: "Комплекс витаминов для поддержания здоровья и красивого оперения птиц.",
    price: 450,
    image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
    category: "Витамины",
    discount: 0,
    new: false,
    petType: "birds"
  }
];
