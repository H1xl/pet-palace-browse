
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  pet_type: 'cat' | 'dog' | 'bird' | 'fish' | 'rodent';
  product_type: 'food' | 'toys' | 'accessories' | 'cages' | 'care' | 'medicine';
  discount: number;
  is_new: boolean;
  in_stock: boolean;
  brand?: string;
  weight?: string;
  specifications?: object; // Changed to match API
  created_at: string;
  updated_at: string;
}

// Extended CartItem that includes product information for display
export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Product information for display
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  discount: number;
  is_new: boolean;
  in_stock: boolean;
}

export interface ProductFilters {
  category: string;
  productType: string;
  priceRange: [number, number];
  showOnlyNew: boolean;
  showOnlyDiscounted: boolean;
  inStock: boolean;
}

export interface ProductSort {
  field: 'price' | 'created_at' | 'name';
  direction: 'asc' | 'desc';
}
