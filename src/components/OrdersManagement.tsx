
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Order } from '@/types/order';
import { orders as initialOrders } from '@/data/orders';
import { Search, Eye, Package } from 'lucide-react';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId.toLowerCase().includes(searchTerm.toLowerCase());
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
                <TableHead>Товары</TableHead>
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
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package size={16} />
                      {order.items.length} товар(ов)
                    </div>
                  </TableCell>
                  <TableCell>{order.total} ₽</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
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
