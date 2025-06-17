
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
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface CreateOrderData {
  shipping_street: string;
  shipping_city: string;
  shipping_postal_code: string;
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

  // Auth endpoints
  async register(userData: RegisterData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data?.token) {
      localStorage.setItem('authToken', data.token);
      // Получаем данные пользователя после успешного входа
      try {
        const user = await this.getCurrentUserFromServer();
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { token: data.token, user };
      } catch (error) {
        console.warn('Не удалось получить данные пользователя после входа:', error);
        return data;
      }
    }
    return data;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  async getCurrentUserFromServer(): Promise<User> {
    return this.request('/users/me');
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

  // User endpoints (для совместимости с существующим кодом)
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
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('currentUser', JSON.stringify(data));
    }
    
    return data;
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
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
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
    return this.request('/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Cart endpoints
  async getCart(sessionId?: string): Promise<CartItem[]> {
    const params = sessionId ? `?session_id=${sessionId}` : '';
    return this.request(`/cart${params}`);
  }

  async addToCart(productId: string, quantity: number): Promise<CartItem> {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(id: string, quantity: number) {
    return this.request(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId: string) {
    return this.request(`/cart/${productId}`, {
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
