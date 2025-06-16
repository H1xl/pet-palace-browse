
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit2, Cat, Dog, Bird, Fish, Mouse, Package2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, APIError } from '@/services/api';
import ProductEditor from './ProductEditor';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  pet_type: string;
  product_type: string;
  discount: number;
  is_new: boolean;
  in_stock: boolean;
  brand?: string;
  weight?: string;
  specifications?: string;
  created_at: string;
  updated_at: string;
}

const ProductsManagement: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const productsData = await apiService.getProducts();
      setProducts(productsData);
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
  };

  const handleProductUpdate = async (updatedProduct: any) => {
    try {
      if (selectedProduct?.id) {
        await apiService.updateProduct(selectedProduct.id, updatedProduct);
        toast({
          title: "Товар обновлен",
          description: "Товар успешно обновлен",
        });
      } else {
        await apiService.createProduct(updatedProduct);
        toast({
          title: "Товар создан",
          description: "Товар успешно создан",
        });
      }
      setSelectedProduct(null);
      setIsCreating(false);
      loadProducts();
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

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      await apiService.deleteProduct(productId);
      toast({
        title: "Товар удален",
        description: "Товар успешно удален",
      });
      loadProducts();
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

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Загрузка товаров...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedProduct || isCreating ? (
        <ProductEditor 
          product={selectedProduct}
          onSave={handleProductUpdate}
          onCancel={() => {
            setSelectedProduct(null);
            setIsCreating(false);
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Управление товарами</CardTitle>
            <CardDescription>Просмотр и редактирование всех товаров магазина</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
              <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
                <Plus size={16} />
                Добавить товар
              </Button>
            </div>
            
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
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent && !parent.querySelector('.fallback-icon')) {
                                    const iconContainer = document.createElement('div');
                                    iconContainer.className = 'fallback-icon w-full h-full flex items-center justify-center';
                                    const iconElement = getCategoryIcon(product.pet_type);
                                    parent.appendChild(iconContainer);
                                  }
                                }}
                              />
                            ) : (
                              getCategoryIcon(product.pet_type)
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(product.pet_type)}
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
                          {product.is_new && <Badge>Новинка</Badge>}
                          {product.discount > 0 && (
                            <Badge variant="outline" className="text-pet-orange border-pet-orange">
                              -{product.discount}%
                            </Badge>
                          )}
                          {!product.in_stock && (
                            <Badge variant="destructive">Нет в наличии</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Edit2 size={16} className="mr-1" /> Изменить
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)}
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
