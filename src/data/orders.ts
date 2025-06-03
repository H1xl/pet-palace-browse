
import { Order, OrderItem } from '@/types/order';

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "Иван Петров",
    customerEmail: "ivan@example.com",
    customerPhone: "+7 (999) 123-45-67",
    status: "в обработке",
    totalAmount: 2850,
    createdAt: "2024-01-15T10:30:00Z",
    items: [
      {
        id: "1",
        orderId: "1",
        productId: "1",
        quantity: 1,
        priceAtTime: 2125,
        product: {
          id: "1",
          articleCode: "DOG001",
          name: "Премиум корм для собак «Счастливый Пёс»",
          description: "Полноценный сбалансированный корм для взрослых собак всех пород с курицей и рисом.",
          price: 2500,
          image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd",
          category: "Корм",
          discount: 15,
          new: false,
          petType: "dogs"
        }
      },
      {
        id: "2",
        orderId: "1",
        productId: "6",
        quantity: 1,
        priceAtTime: 1200,
        product: {
          id: "6",
          articleCode: "CAT002",
          name: "Когтеточка-столбик «Царапка»",
          description: "Прочная когтеточка-столбик с игрушкой для вашей кошки.",
          price: 1200,
          image: "https://images.unsplash.com/photo-1587166088074-bc8576739511",
          category: "Когтеточки",
          discount: 0,
          new: true,
          petType: "cats"
        }
      }
    ]
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Анна Сидорова",
    customerEmail: "anna@example.com",
    customerPhone: "+7 (888) 234-56-78",
    status: "отправлен",
    totalAmount: 8075,
    createdAt: "2024-01-14T15:45:00Z",
    items: [
      {
        id: "3",
        orderId: "2",
        productId: "3",
        quantity: 1,
        priceAtTime: 7650,
        product: {
          id: "3",
          articleCode: "FISH001",
          name: "Аквариум с LED-подсветкой «Подводный мир»",
          description: "Современный аквариум с LED-подсветкой, фильтром и всем необходимым для запуска.",
          price: 8500,
          image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5",
          category: "Аквариумы",
          discount: 10,
          new: true,
          petType: "fish"
        }
      }
    ]
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Михаил Васильев",
    customerEmail: "mikhail@example.com",
    customerPhone: "+7 (777) 345-67-89",
    status: "доставлен",
    totalAmount: 1620,
    createdAt: "2024-01-13T09:20:00Z",
    items: [
      {
        id: "4",
        orderId: "3",
        productId: "9",
        quantity: 1,
        priceAtTime: 1620,
        product: {
          id: "9",
          articleCode: "DOG003",
          name: "Комбинезон для собак «Зимний уют»",
          description: "Теплый комбинезон для собак мелких и средних пород для комфортных прогулок в холодное время года.",
          price: 1800,
          image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
          category: "Одежда",
          discount: 10,
          new: true,
          petType: "dogs"
        }
      }
    ]
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerName: "Елена Козлова",
    customerEmail: "elena@example.com",
    customerPhone: "+7 (666) 456-78-90",
    status: "отменен",
    totalAmount: 990,
    createdAt: "2024-01-12T14:10:00Z",
    items: [
      {
        id: "5",
        orderId: "4",
        productId: "10",
        quantity: 1,
        priceAtTime: 990,
        product: {
          id: "10",
          articleCode: "CAT003",
          name: "Интерактивная игрушка для кошек «Умный шарик»",
          description: "Электронная игрушка с непредсказуемым движением для стимуляции охотничьего инстинкта вашей кошки.",
          price: 990,
          image: "https://images.unsplash.com/photo-1547404415-5eb25e0fb22e",
          category: "Игрушки",
          discount: 0,
          new: true,
          petType: "cats"
        }
      }
    ]
  }
];
