
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_street: string;
  shipping_city: string;
  shipping_postal_code: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
}
