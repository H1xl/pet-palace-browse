
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from '@/types/product';
import { useToast } from "@/components/ui/use-toast";
import { Cat, Dog, Bird, Fish, Mouse, Package2, ImageOff } from 'lucide-react';

interface ProductEditorProps {
  product: Product;
  onSave: (updatedProduct: Product) => void;
  onCancel: () => void;
}

const getCategoryIcon = (petType: string) => {
  switch (petType) {
    case 'cat':
    case 'cats':
      return Cat;
    case 'dog':
    case 'dogs':
      return Dog;
    case 'bird':
    case 'birds':
      return Bird;
    case 'fish':
      return Fish;
    case 'rodent':
      return Mouse;
    default:
      return Package2;
  }
};

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discount' ? Number(value) : value
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (checked: boolean, field: string) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedProduct);
    toast({
      title: "Товар обновлен",
      description: `${editedProduct.name} был успешно обновлен.`,
    });
  };

  const CategoryIcon = getCategoryIcon(editedProduct.petType);

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Редактирование товара</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название товара</Label>
            <Input 
              id="name" 
              name="name" 
              value={editedProduct.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={editedProduct.description} 
              onChange={handleChange} 
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                min="0" 
                value={editedProduct.price} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Скидка (%)</Label>
              <Input 
                id="discount" 
                name="discount" 
                type="number" 
                min="0" 
                max="100" 
                value={editedProduct.discount} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Input 
              id="category" 
              name="category" 
              value={editedProduct.category} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="petType">Тип питомца</Label>
            <Select 
              value={editedProduct.petType} 
              onValueChange={(value) => handleSelectChange(value, 'petType')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип питомца" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Собака</SelectItem>
                <SelectItem value="cat">Кошка</SelectItem>
                <SelectItem value="bird">Птица</SelectItem>
                <SelectItem value="fish">Рыба</SelectItem>
                <SelectItem value="rodent">Грызун</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">URL изображения</Label>
            <Input 
              id="image" 
              name="image" 
              value={editedProduct.image} 
              onChange={handleChange}
              placeholder="Оставьте пустым для иконки категории" 
            />
            <div className="mt-2 flex items-center justify-center border rounded-md h-32">
              {editedProduct.image ? (
                <img 
                  src={editedProduct.image} 
                  alt={editedProduct.name} 
                  className="h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                    target.parentElement?.appendChild((() => {
                      const el = document.createElement('div');
                      el.className = 'flex flex-col items-center justify-center';
                      el.innerHTML = `
                        <div class="text-gray-400 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="2" y2="22"></line><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path><line x1="13.5" x2="6.5" y1="13.5" y2="20.5"></line><path d="M14 14v6"></path><path d="M10 7v6"></path><path d="M18 18h0"></path><path d="M16.5 2.5C20 6 20 10 18 14"></path></svg>
                        </div>
                        <span class="text-sm text-gray-500">Изображение недоступно</span>
                      `;
                      return el;
                    })());
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <CategoryIcon size={48} />
                  <span className="text-sm text-gray-500 mt-2">Будет использована иконка категории</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="new" 
                checked={editedProduct.new} 
                onCheckedChange={(checked) => handleSwitchChange(checked, 'new')}
              />
              <Label htmlFor="new">Новинка</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>Отмена</Button>
          <Button type="submit">Сохранить изменения</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductEditor;
