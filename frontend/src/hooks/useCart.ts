import { useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { sendEvent } from '../utils/api';
import { toast } from 'sonner';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, [localStorage.getItem('cart')]);

  const saveCart = (cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setItems(cartItems);
  };

  const addItem = async (product: Product, quantity = 1) => {
    const existingItem = items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const updatedItems = items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      saveCart(updatedItems);
    } else {
      const updatedItems = [...items, { product, quantity }];
      saveCart(updatedItems);
    }
    await sendEvent(product.id, product.category, "add_to_cart");
    toast.info("Product saved to your cart");
  };

  const removeItem = (productId: string) => {
    const updatedItems = items.filter(item => item.product.id !== productId);
    saveCart(updatedItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedItems = items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updatedItems);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setItems([]);
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart
  };
};