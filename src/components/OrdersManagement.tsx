
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order, orders as initialOrders } from '@/data/orders';
import { Package, CheckCircle, Clock } from 'lucide-react';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openOrders = orders.filter(order => order.status === 'open');
  const closedOrders = orders.filter(order => order.status === 'closed');

  const toggleOrderStatus = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: order.status === 'open' ? 'closed' : 'open' } 
        : order
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: selectedOrder.status === 'open' ? 'closed' : 'open'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление заказами</CardTitle>
          <CardDescription>Просмотр и управление заказами клиентов</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="open">
            <TabsList className="mb-4">
              <TabsTrigger value="open" className="flex items-center gap-2">
                <Clock size={16} />
                <span>Открытые ({openOrders.length})</span>
              </TabsTrigger>
              <TabsTrigger value="closed" className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Закрытые ({closedOrders.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="open">
              {openOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№ Заказа</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.clientName}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.totalAmount} ₽</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedOrder(order)}
                          >
                            Детали
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleOrderStatus(order.id)}
                          >
                            Закрыть
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Нет открытых заказов
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="closed">
              {closedOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№ Заказа</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {closedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.clientName}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.totalAmount} ₽</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedOrder(order)}
                          >
                            Детали
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleOrderStatus(order.id)}
                          >
                            Открыть
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Нет закрытых заказов
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedOrder && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package size={18} />
                  Заказ {selectedOrder.id}
                </CardTitle>
                <CardDescription>
                  Дата: {selectedOrder.date} | Статус: {' '}
                  <Badge variant={selectedOrder.status === 'open' ? 'default' : 'secondary'}>
                    {selectedOrder.status === 'open' ? 'Открыт' : 'Закрыт'}
                  </Badge>
                </CardDescription>
              </div>
              <Button 
                variant={selectedOrder.status === 'open' ? 'default' : 'outline'}
                onClick={() => toggleOrderStatus(selectedOrder.id)}
              >
                {selectedOrder.status === 'open' ? 'Закрыть заказ' : 'Открыть заказ'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Информация о клиенте</h3>
                <p className="font-medium">{selectedOrder.clientName}</p>
                <p className="text-sm text-gray-500">ID: {selectedOrder.clientId}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Товары в заказе</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Товар</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Кол-во</TableHead>
                      <TableHead>Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.products.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none';
                                  const svgContent = getCategoryIconSVG(item.product.petType);
                                  target.parentElement?.insertAdjacentHTML('beforeend', `<div class="w-full h-full flex items-center justify-center">${svgContent}</div>`);
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{item.product.name}</div>
                              <div className="text-xs text-gray-500">{item.product.category}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.product.price} ₽</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.product.price * item.quantity} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm">Итого:</div>
                  <div className="text-xl font-bold">{selectedOrder.totalAmount} ₽</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to get SVG for icons
const getCategoryIconSVG = (petType: string) => {
  switch (petType) {
    case 'cat':
    case 'cats':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>';
    case 'dog':
    case 'dogs':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/></svg>';
    case 'bird':
    case 'birds':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>';
    case 'fish':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7.99 15.98A14.94 14.94 0 0 1 2 12c0-1.68 1.14-3.35 3.01-4.7"/><path d="M12 20c-3.18 0-5.5-1.34-7-4v-8c1.5-2.66 3.82-4 7-4"/></svg>';
    case 'rodent':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M22 9.5c0-3-4-3-4-3m-7 3.5.737-.271c.681-.25 1.263-.825 1.263-1.729 0-2-3-2-3 0 0 1-.5 2-2 3m-2 9-.871-.483c-.658-.365-1.129-1.112-1.129-1.897 0-2.02 3-2.528 3.5.395.667-2.138 0-4.5 0-6.5m8.5-1.5c0-1-1.5-2-1.5-2l1.5 1-1.5-3m-1 4 1.414-1.414"/><path d="M7 14.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Zm7-4a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"/></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M2 10h20"/></svg>';
  }
};

export default OrdersManagement;
