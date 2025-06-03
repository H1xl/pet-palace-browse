
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Product } from '@/types/product';
import { products as initialProducts } from '@/data/products';
import { Search, Edit2, Cat, Dog, Bird, Fish, Mouse, Package2, ArrowLeft } from 'lucide-react';
import ProductEditor from './ProductEditor';
import { useToast } from "@/hooks/use-toast";

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const getCategoryIcon = (petType: string) => {
    switch (petType) {
      case 'cats':
        return <Cat size={18} className="text-gray-600" />;
      case 'dogs':
        return <Dog size={18} className="text-gray-600" />;
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
    // Search functionality is already handled by the filteredProducts
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setSelectedProduct(null);
    toast({
      title: "Изменения сохранены",
      description: `Товар "${updatedProduct.name}" успешно обновлен.`,
    });
    
    // Save to localStorage
    localStorage.setItem('savedProducts', JSON.stringify(
      products.map(product => product.id === updatedProduct.id ? updatedProduct : product)
    ));
  };

  const handleCancel = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.articleCode && product.articleCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {selectedProduct ? (
        <div className="container mx-auto py-8">
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Вернуться к списку товаров
          </Button>

          <ProductEditor 
            product={selectedProduct}
            onSave={handleProductUpdate}
            onCancel={handleCancel}
          />
        </div>
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
                    <TableHead>Артикул</TableHead>
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
                                onError={() => {
                                  // Fallback to icon if image fails
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
                        <Badge variant="outline" className="text-xs">
                          {product.articleCode || 'Н/Д'}
                        </Badge>
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
