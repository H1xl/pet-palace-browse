
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  discount: number;
  new: boolean;
  petType: string; // dogs, cats, birds, fish, etc.
}

export interface CartItem extends Product {
  quantity: number;
}
