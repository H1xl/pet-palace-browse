
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ProductEditorProps {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product: initialProduct, onSave, onCancel }) => {
  const [product, setProduct] = useState<Product>(
    initialProduct || {
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      discount: 0,
      new: false,
      petType: 'dogs',
    }
  );
  const { toast } = useToast();

  useEffect(() => {
    setProduct(initialProduct || {
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      discount: 0,
      new: false,
      petType: 'dogs',
    });
  }, [initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
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
    onSave(product);
    toast({
      title: "Сохранено",
      description: "Товар успешно сохранен",
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">{initialProduct ? 'Редактировать товар' : 'Добавить новый товар'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Название товара</Label>
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
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="price">Цена</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="image">URL изображения</Label>
          <Input
            type="text"
            id="image"
            name="image"
            value={product.image}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="category">Категория</Label>
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
          <Label htmlFor="discount">Скидка (%)</Label>
          <Input
            type="number"
            id="discount"
            name="discount"
            value={product.discount}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="petType">Тип животного</Label>
          <Select 
            value={product.petType} 
            onValueChange={(value) => handleSelectChange('petType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите тип животного" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dogs">Собаки</SelectItem>
              <SelectItem value="cats">Кошки</SelectItem>
              <SelectItem value="birds">Птицы</SelectItem>
              <SelectItem value="fish">Рыбы</SelectItem>
              <SelectItem value="rodent">Грызуны</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="new">Новинка</Label>
          <Switch
            id="new"
            checked={product.new}
            onCheckedChange={(checked) => setProduct(prevProduct => ({ ...prevProduct, new: checked }))}
          />
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onCancel} className="mr-2">
            Отменить
          </Button>
          <Button type="submit">
            {initialProduct ? 'Сохранить' : 'Добавить'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;
