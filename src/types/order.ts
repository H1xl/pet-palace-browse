
import { Product } from './product';

export interface OrderItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  shippingAddress: ShippingAddress;
}
