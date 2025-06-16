
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // API возвращает строку
  image_url?: string;
  category: string;
  pet_type: 'cat' | 'dog' | 'bird' | 'fish' | 'rodent';
  product_type: 'food' | 'toys' | 'accessories' | 'cages' | 'care' | 'medicine';
  discount: number;
  is_new: boolean;
  in_stock: boolean;
  brand?: string;
  weight?: string;
  specifications?: Record<string, string> | string;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
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
