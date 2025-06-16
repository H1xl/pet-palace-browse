
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, APIError } from '@/services/api';

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_street: string;
  shipping_city: string;
  shipping_postal_code: string;
  created_at: string;
  updated_at: string;
  items?: any[];
}

const OrdersManagement: React.FC = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await apiService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Ошибка",
          description: error.status === 0 
            ? "Сервер недоступен. Проверьте подключение к интернету."
            : error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      toast({
        title: "Статус обновлен",
        description: "Статус заказа успешно обновлен",
      });
      loadOrders();
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
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }

    try {
      await apiService.deleteOrder(orderId);
      toast({
        title: "Заказ удален",
        description: "Заказ успешно удален",
      });
      loadOrders();
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      processing: { variant: 'secondary' as const, label: 'В обработке' },
      shipped: { variant: 'default' as const, label: 'Отправлен' },
      delivered: { variant: 'default' as const, label: 'Доставлен' },
      cancelled: { variant: 'destructive' as const, label: 'Отменен' }
    };
    
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Загрузка заказов...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление заказами</CardTitle>
        <CardDescription>Просмотр и управление всеми заказами</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Поиск по ID заказа или пользователю..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </form>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Все статусы</option>
            <option value="processing">В обработке</option>
            <option value="shipped">Отправлен</option>
            <option value="delivered">Доставлен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>
        
        {filteredOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID заказа</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Адрес доставки</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.user_id}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.shipping_street}</div>
                      <div className="text-gray-500">{order.shipping_city}, {order.shipping_postal_code}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.total} ₽</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="text-sm px-2 py-1 border rounded"
                      >
                        <option value="processing">В обработке</option>
                        <option value="shipped">Отправлен</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Заказы не найдены
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersManagement;
