
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Корм для собак Royal Canin Adult',
    price: 2500,
    description: 'Полнорационный сухой корм для взрослых собак средних пород',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=300&fit=crop',
    category: 'Корм для собак',
    petType: 'dog',
    productType: 'food',
    discount: 15,
    new: false,
    dateAdded: '2024-01-15',
    inStock: true,
    brand: 'Royal Canin',
    weight: '15 кг',
    specifications: [
      'Для собак средних пород',
      'Возраст: от 1 года до 7 лет',
      'Поддерживает здоровье пищеварения',
      'Укрепляет иммунную систему'
    ]
  },
  {
    id: '2',
    name: 'Игрушка-мышка для кошек',
    price: 450,
    description: 'Мягкая игрушка-мышка с кошачьей мятой для активных игр',
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=300&fit=crop',
    category: 'Игрушки для кошек',
    petType: 'cat',
    productType: 'toys',
    discount: 0,
    new: true,
    dateAdded: '2024-02-10',
    inStock: true,
    brand: 'Pet Fun',
    specifications: [
      'Материал: плюш',
      'Размер: 8 см',
      'С кошачьей мятой',
      'Безопасные материалы'
    ]
  },
  {
    id: '3',
    name: 'Клетка для попугаев средних размеров',
    price: 8900,
    description: 'Просторная клетка для попугаев с удобными жердочками и кормушками',
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=300&h=300&fit=crop',
    category: 'Клетки для птиц',
    petType: 'bird',
    productType: 'cages',
    discount: 20,
    new: false,
    dateAdded: '2024-01-20',
    inStock: true,
    brand: 'BirdLife',
    specifications: [
      'Размер: 60x40x60 см',
      'Материал: металл с полимерным покрытием',
      '2 жердочки в комплекте',
      '2 кормушки и поилка'
    ]
  },
  {
    id: '4',
    name: 'Корм для рыб Tropical',
    price: 680,
    description: 'Универсальный корм в хлопьях для тропических рыб',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=300&h=300&fit=crop',
    category: 'Корм для рыб',
    petType: 'fish',
    productType: 'food',
    discount: 0,
    new: false,
    dateAdded: '2024-01-25',
    inStock: false,
    brand: 'Tropical',
    weight: '250 г',
    specifications: [
      'Для всех видов тропических рыб',
      'Форма: хлопья',
      'Богат витаминами',
      'Легко усваивается'
    ]
  },
  {
    id: '5',
    name: 'Лоток для грызунов с наполнителем',
    price: 1200,
    description: 'Удобный лоток для грызунов с впитывающим наполнителем',
    category: 'Аксессуары для грызунов',
    petType: 'rodent',
    productType: 'accessories',
    discount: 10,
    new: true,
    dateAdded: '2024-02-05',
    inStock: true,
    brand: 'RodentCare',
    specifications: [
      'Размер: 30x20x5 см',
      'Материал: пластик',
      'В комплекте 1 кг наполнителя',
      'Легко моется'
    ]
  },
  {
    id: '6',
    name: 'Шампунь для собак гипоаллергенный',
    price: 890,
    description: 'Мягкий гипоаллергенный шампунь для чувствительной кожи собак',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop',
    category: 'Уход за собаками',
    petType: 'dog',
    productType: 'care',
    discount: 5,
    new: false,
    dateAdded: '2024-01-30',
    inStock: true,
    brand: 'VetCare',
    weight: '500 мл',
    specifications: [
      'Гипоаллергенная формула',
      'Без парабенов и сульфатов',
      'Подходит для частого использования',
      'Приятный аромат'
    ]
  }
];
