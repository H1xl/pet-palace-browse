
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ErrorPage from './ErrorPage';
import { Order } from '@/services/api';
import { apiService, APIError } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderItemWithProduct {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product_name?: string;
}

interface OrderWithProducts extends Order {
  items?: OrderItemWithProduct[];
}

const OrdersManagement = () => {
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const ordersData = await apiService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      if (error instanceof APIError) {
        setApiError(error.message);
      } else {
        setApiError("Произошла неизвестная ошибка при загрузке заказов");
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderItems = async (orderId: string) => {
    try {
      const orderWithItems = await apiService.getOrderById(orderId);
      
      // Загружаем информацию о товарах для каждого элемента заказа
      const itemsWithProducts = await Promise.all(
        orderWithItems.items?.map(async (item: any) => {
          try {
            const product = await apiService.getProductById(item.product_id);
            return {
              ...item,
              product_name: product.name
            };
          } catch (error) {
            console.error(`Error loading product ${item.product_id}:`, error);
            return {
              ...item,
              product_name: 'Товар не найден'
            };
          }
        }) || []
      );

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, items: itemsWithProducts } : order
      ));
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить товары заказа",
          variant: "destructive"
        });
      }
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
      // Загружаем товары заказа, если они еще не загружены
      const order = orders.find(o => o.id === orderId);
      if (order && !order.items) {
        loadOrderItems(orderId);
      }
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      ));
      toast({
        title: "Успешно",
        description: "Статус заказа обновлен"
      });
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await apiService.deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast({
        title: "Успешно",
        description: "Заказ удален"
      });
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'Обрабатывается';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-lg">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <ErrorPage
        title="Ошибка загрузки заказов"
        message={apiError}
        onRetry={loadOrders}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Управление заказами</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Нет заказов</h3>
          <p className="text-sm text-gray-400">Заказы появятся здесь после их создания</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Заказ #{order.id.slice(-8)}
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </div>
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')} в {new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Обрабатывается</SelectItem>
                        <SelectItem value="shipped">Отправлен</SelectItem>
                        <SelectItem value="delivered">Доставлен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Информация о клиенте</h4>
                      <p className="text-sm text-gray-600">Пользователь ID: {order.user_id}</p>
                    </div>
                  </div>

                  {/* Товары в заказе */}
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      {expandedOrders.has(order.id) ? (
                        <>
                          <ChevronUp size={16} />
                          Скрыть товары
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          Показать товары
                        </>
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      {order.items ? (
                        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <div>
                                <p className="font-medium">{item.product_name || 'Загрузка...'}</p>
                                <p className="text-xs text-gray-400 opacity-70">ID: {item.product_id}</p>
                                <p className="text-sm text-gray-600">
                                  Количество: {item.quantity} × {Math.round(item.price)} ₽
                                </p>
                              </div>
                              <p className="font-semibold">
                                {Math.round(item.price * item.quantity)} ₽
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Загрузка товаров...</p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Итого:</span>
                    <span className="text-xl font-bold">{Math.round(order.total)} ₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
