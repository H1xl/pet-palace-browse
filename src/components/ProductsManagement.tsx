
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Product } from '@/types/product';
import { products as initialProducts } from '@/data/products';
import { Search, Edit2, Cat, Dog, Bird, Fish, Mouse, Package2 } from 'lucide-react';
import ProductEditor from './ProductEditor';

const ProductsManagement: React.FC = () => {
  // DBPoint: READ - Загрузка всех товаров из базы данных
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getCategoryIcon = (petType: string) => {
    switch (petType) {
      case 'cat':
      case 'cats':
        return <Cat size={18} className="text-gray-600" />;
      case 'dog':
      case 'dogs':
        return <Dog size={18} className="text-gray-600" />;
      case 'bird':
      case 'birds':
        return <Bird size={18} className="text-gray-600" />;
      case 'fish':
        return <Fish size={18} className="text-gray-600" />;
      case 'rodent':
        return <Mouse size={18} className="text-gray-600" />;
      default:
        return <Package2 size={18} className="text-gray-600" />;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // DBPoint: READ - Поиск товаров в базе данных по критериям
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    // DBPoint: UPDATE - Обновление товара в базе данных
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setSelectedProduct(null);
  };

  // DBPoint: READ - Фильтрация товаров (может быть заменена на поиск в БД)
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {selectedProduct ? (
        <ProductEditor 
          product={selectedProduct}
          onSave={handleProductUpdate}
          onCancel={() => setSelectedProduct(null)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Управление товарами</CardTitle>
            <CardDescription>Просмотр и редактирование всех товаров магазина</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </form>
            
            {filteredProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена (₽)</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent && !parent.querySelector('.fallback-icon')) {
                                    const iconContainer = document.createElement('div');
                                    iconContainer.className = 'fallback-icon w-full h-full flex items-center justify-center';
                                    const iconElement = getCategoryIcon(product.petType);
                                    parent.appendChild(iconContainer);
                                  }
                                }}
                              />
                            ) : (
                              getCategoryIcon(product.petType)
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(product.petType)}
                          {product.category}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.discount > 0 ? (
                          <div>
                            <span className="font-bold">
                              {Math.round(product.price * (1 - product.discount / 100))}
                            </span> 
                            <span className="text-xs line-through text-gray-400 ml-1">
                              {product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold">{product.price}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-x-1">
                          {product.new && <Badge>Новинка</Badge>}
                          {product.discount > 0 && (
                            <Badge variant="outline" className="text-pet-orange border-pet-orange">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Edit2 size={16} className="mr-1" /> Изменить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Товары не найдены
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsManagement;
