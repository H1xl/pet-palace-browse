
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from 'lucide-react';
import { ProductFormData } from '@/types/productForm';

interface ProductEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  product?: ProductFormData | null;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ isOpen, onClose, onSave, product: initialProduct }) => {
  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    pet_type: 'dog',
    product_type: 'food',
    discount: 0,
    is_new: false,
    in_stock: true,
    brand: '',
    weight: '',
    specifications: ''
  });

  useEffect(() => {
    if (initialProduct) {
      setProduct({
        ...initialProduct,
        image_url: initialProduct.image_url || '',
        brand: initialProduct.brand || '',
        weight: initialProduct.weight || '',
        specifications: typeof initialProduct.specifications === 'object' 
          ? Object.entries(initialProduct.specifications).map(([key, value]) => `${key}: ${value}`).join('\n')
          : initialProduct.specifications || ''
      });
    } else {
      setProduct({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category: '',
        pet_type: 'dog',
        product_type: 'food',
        discount: 0,
        is_new: false,
        in_stock: true,
        brand: '',
        weight: '',
        specifications: ''
      });
    }
  }, [initialProduct, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    const newValue = type === 'checkbox' ? checked : 
                     type === 'number' ? parseFloat(value) || 0 : value;

    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: newValue,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Преобразуем specifications в объект если это строка
    const processedProduct = {
      ...product,
      specifications: typeof product.specifications === 'string' && product.specifications.trim()
        ? product.specifications.split('\n').reduce((acc, line) => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              acc[key.trim()] = valueParts.join(':').trim();
            }
            return acc;
          }, {} as Record<string, string>)
        : product.specifications
    };
    
    onSave(processedProduct);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialProduct ? 'Редактировать товар' : 'Добавить новый товар'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Название товара *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Цена *</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="discount">Скидка (%)</Label>
              <Input
                type="number"
                id="discount"
                name="discount"
                value={product.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="image_url">URL изображения</Label>
            <Input
              type="url"
              id="image_url"
              name="image_url"
              value={product.image_url}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Категория *</Label>
              <Input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="brand">Бренд</Label>
              <Input
                type="text"
                id="brand"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pet_type">Тип животного *</Label>
              <Select value={product.pet_type} onValueChange={(value) => handleSelectChange('pet_type', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип животного" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Собаки</SelectItem>
                  <SelectItem value="cat">Кошки</SelectItem>
                  <SelectItem value="bird">Птицы</SelectItem>
                  <SelectItem value="fish">Рыбы</SelectItem>
                  <SelectItem value="rodent">Грызуны</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="product_type">Тип товара *</Label>
              <Select value={product.product_type} onValueChange={(value) => handleSelectChange('product_type', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип товара" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Корм</SelectItem>
                  <SelectItem value="toys">Игрушки</SelectItem>
                  <SelectItem value="accessories">Аксессуары</SelectItem>
                  <SelectItem value="cages">Клетки</SelectItem>
                  <SelectItem value="care">Уход</SelectItem>
                  <SelectItem value="medicine">Медицина</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="weight">Вес</Label>
            <Input
              type="text"
              id="weight"
              name="weight"
              value={product.weight}
              onChange={handleChange}
              placeholder="например: 1кг, 500г"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="specifications">Характеристики</Label>
            <Textarea
              id="specifications"
              name="specifications"
              value={typeof product.specifications === 'string' ? product.specifications : ''}
              onChange={handleChange}
              placeholder="Введите характеристики в формате: Ключ: Значение (каждая с новой строки)"
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_new"
                name="is_new"
                checked={product.is_new}
                onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_new: checked }))}
              />
              <Label htmlFor="is_new">Новинка</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="in_stock"
                name="in_stock"
                checked={product.in_stock}
                onCheckedChange={(checked) => setProduct(prev => ({ ...prev, in_stock: checked }))}
              />
              <Label htmlFor="in_stock">В наличии</Label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отменить
            </Button>
            <Button type="submit">
              {initialProduct ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditor;
