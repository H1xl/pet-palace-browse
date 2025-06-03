
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading from static data for now
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Mock data with article codes
        const mockProducts: Product[] = [
          {
            id: "1",
            articleCode: "DOG-001",
            name: "Премиум корм для собак",
            description: "Высококачественный корм для взрослых собак",
            price: 2500,
            image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400",
            category: "Корм",
            discount: 15,
            new: false,
            petType: "dogs"
          },
          {
            id: "2", 
            articleCode: "CAT-001",
            name: "Игрушка для кошек",
            description: "Мягкая игрушка с кошачьей мятой",
            price: 350,
            image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
            category: "Игрушки",
            discount: 0,
            new: true,
            petType: "cats"
          },
          {
            id: "3",
            articleCode: "BIRD-001", 
            name: "Корм для птиц",
            description: "Сбалансированный корм для домашних птиц",
            price: 890,
            image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400",
            category: "Корм",
            discount: 10,
            new: false,
            petType: "birds"
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить товары",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  return {
    products,
    loading
  };
};
