
const API_BASE_URL = 'http://localhost:9090/api';

export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}

export interface UpdateUserData {
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'blocked';
}

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
  specifications?: object;
  created_at: string;
  updated_at: string;
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
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

// Cart item structure based on actual API response
export interface CartItem {
  cart_item_id: string;
  product_id: string;
  quantity: number;
  product_name: string;
  product_price: number;
  product_image_url?: string;
  // Map to expected interface properties
  id?: string;
  user_id?: string;
  session_id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  discount?: number;
  is_new?: boolean;
  in_stock?: boolean;
}

export interface Session {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface CreateOrderData {
  total: number;
  shipping_street: string;
  shipping_city: string;
  shipping_postal_code: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}

export interface ProductFilters {
  pet_type?: string;
  category?: string;
  in_stock?: boolean;
}

class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

class APIService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      let errorMessage = 'Ошибка сервера';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Если не удается парсить JSON, используем статус код
        switch (response.status) {
          case 400:
            errorMessage = 'Неверные данные запроса';
            break;
          case 401:
            errorMessage = 'Неавторизованный доступ';
            break;
          case 403:
            errorMessage = 'Доступ запрещен';
            break;
          case 404:
            errorMessage = 'Ресурс не найден';
            break;
          case 409:
            errorMessage = 'Конфликт данных';
            break;
          case 422:
            errorMessage = 'Ошибка валидации данных';
            break;
          case 500:
            errorMessage = 'Внутренняя ошибка сервера';
            break;
          default:
            errorMessage = `Ошибка сервера (${response.status})`;
        }
      }
      
      throw new APIError(errorMessage, response.status);
    }

    // Для статуса 204 (No Content) не пытаемся парсить JSON
    if (response.status === 204) {
      return null;
    }

    try {
      return await response.json();
    } catch (e) {
      // Если ответ не JSON, возвращаем null
      return null;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error instanceof TypeError || error.message.includes('fetch')) {
        throw new APIError('Сервер недоступен. Проверьте подключение к интернету.', 0);
      }
      
      throw new APIError('Произошла неизвестная ошибка при выполнении запроса', 500);
    }
  }

  // Auth endpoints - updated to match actual API
  async register(userData: RegisterData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials) {
    const data = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data?.token) {
      localStorage.setItem('authToken', data.token);
      if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { token: data.token, user: data.user };
      }
    }
    return data;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  async getCurrentUserFromServer(): Promise<User> {
    // Since there's no /users/me endpoint, get from stored data or fetch user by ID
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return this.getUserById(currentUser.id);
    }
    throw new APIError('Пользователь не найден', 404);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      return null;
    }
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Invalid user data in localStorage, clearing...', error);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request('/users');
  }

  async getUserById(id: string): Promise<User> {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const data = await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id && data.user) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return data.user;
    }
    
    return data.user || data;
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Products endpoints
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.pet_type) params.append('pet_type', filters.pet_type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.in_stock !== undefined) params.append('in_stock', filters.in_stock.toString());
    
    const query = params.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any) {
    const response = await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.product || response;
  }

  async updateProduct(id: string, productData: any) {
    const response = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.product || response;
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async getOrders(): Promise<Order[]> {
    return this.request('/orders');
  }

  async getMyOrders(): Promise<Order[]> {
    return this.request('/orders/my');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response;
  }

  async updateOrderStatus(id: string, status: string) {
    const response = await this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.order || response;
  }

  async deleteOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Cart endpoints - updated to match actual API structure
  async getCart(sessionId?: string): Promise<CartItem[]> {
    const cartItems = await this.request('/cart');
    // Transform API response to expected format
    return cartItems.map((item: any) => ({
      id: item.cart_item_id,
      cart_item_id: item.cart_item_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: '',
      updated_at: '',
      name: item.product_name,
      price: item.product_price,
      image_url: item.product_image_url,
      product_name: item.product_name,
      product_price: item.product_price,
      product_image_url: item.product_image_url
    }));
  }

  async addToCart(productId: string, quantity: number): Promise<CartItem> {
    const response = await this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    return response.cartItem || response;
  }

  async updateCartItem(id: string, quantity: number) {
    const response = await this.request(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    return response.cartItem || response;
  }

  async removeFromCart(cartItemId: string) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Sessions endpoints
  async createSession(userId: string): Promise<Session> {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }
}

export const apiService = new APIService();
export { APIError };
