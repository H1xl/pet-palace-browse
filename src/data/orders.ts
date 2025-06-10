
import type { Order, OrderItem } from '@/types/order';

export type { Order, OrderItem };

export const orders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    items: [
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
        ],
        quantity: 2
      }
    ],
    total: 4250,
    status: 'delivered',
    date: '2024-01-20',
    shippingAddress: {
      street: 'ул. Ленина, 123',
      city: 'Ставрополь',
      postalCode: '355000'
    }
  },
  {
    id: '2',
    userId: 'user1',
    items: [
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
        ],
        quantity: 1
      }
    ],
    total: 450,
    status: 'processing',
    date: '2024-02-15',
    shippingAddress: {
      street: 'пр. Октябрьской Революции, 45',
      city: 'Ставрополь',
      postalCode: '355001'
    }
  },
  {
    id: '3',
    userId: 'user2',
    items: [
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
        ],
        quantity: 1
      }
    ],
    total: 7120,
    status: 'shipped',
    date: '2024-02-10',
    shippingAddress: {
      street: 'ул. Мира, 78',
      city: 'Ставрополь',
      postalCode: '355002'
    }
  }
];
