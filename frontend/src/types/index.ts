export interface User {
  email: string;
  username: string;
  created_at: string;
  longitude: number;
  latitude: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

export type PageProps = {
  onPageChange: (page: string) => void;
};