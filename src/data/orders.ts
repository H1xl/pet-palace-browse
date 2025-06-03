
import { Product } from '@/types/product';

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  products: {
    product: Product;
    quantity: number;
  }[];
  status: 'open' | 'closed';
  totalAmount: number;
  date: string;
}

// Sample orders data
export const orders: Order[] = [
  {
    id: "ORD-001",
    clientId: "client",
    clientName: "Тестовый Клиент",
    products: [
      {
        product: {
          id: "1",
          name: "Премиум корм для собак «Счастливый Пёс»",
          description: "Полноценный сбалансированный корм для взрослых собак всех пород с курицей и рисом.",
          price: 2500,
          image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
          category: "Корм",
          discount: 15,
          new: false,
          petType: "dog"
        },
        quantity: 2
      },
      {
        product: {
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
        quantity: 1
      }
    ],
    status: "open",
    totalAmount: 6050,
    date: "2025-05-15"
  },
  {
    id: "ORD-002",
    clientId: "client1",
    clientName: "Новый Клиент",
    products: [
      {
        product: {
          id: "2",
          name: "Мягкая игрушка для кошек «Мышка с кошачьей мятой»",
          description: "Мягкая игрушка с кошачьей мятой внутри для активных игр вашей кошки.",
          price: 350,
          image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
          category: "Игрушки",
          discount: 0,
          new: true,
          petType: "cats"
        },
        quantity: 3
      }
    ],
    status: "closed",
    totalAmount: 1050,
    date: "2025-05-10"
  },
  {
    id: "ORD-003",
    clientId: "client",
    clientName: "Тестовый Клиент",
    products: [
      {
        product: {
          id: "10",
          name: "Интерактивная игрушка для кошек «Умный шарик»",
          description: "Электронная игрушка с непредсказуемым движением для стимуляции охотничьего инстинкта вашей кошки.",
          price: 990,
          image: "https://images.unsplash.com/photo-1547404415-5eb25e0fb22e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
          category: "Игрушки",
          discount: 0,
          new: true,
          petType: "cats"
        },
        quantity: 1
      }
    ],
    status: "open",
    totalAmount: 990,
    date: "2025-05-18"
  }
];
