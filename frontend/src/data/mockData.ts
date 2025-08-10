import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
    category: 'Electronics',
    brand: 'TechSound',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    features: ['Noise Cancellation', '30-hour Battery', 'Wireless Charging', 'Voice Assistant']
  },
  {
    id: '2',
    name: 'Smartphone Case',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1042143/pexels-photo-1042143.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    brand: 'ProtectPlus',
    rating: 4.2,
    reviews: 89,
    inStock: true,
    description: 'Durable smartphone case with military-grade protection.',
    features: ['Drop Protection', 'Wireless Charging Compatible', 'Slim Design']
  },
  {
    id: '3',
    name: 'Coffee Maker',
    price: 149.99,
    image: 'https://images.pexels.com/photos/4226792/pexels-photo-4226792.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Kitchen',
    brand: 'BrewMaster',
    rating: 4.7,
    reviews: 256,
    inStock: true,
    description: 'Automatic coffee maker with programmable brewing and thermal carafe.',
    features: ['Programmable', 'Thermal Carafe', 'Auto-shutoff', '12-cup Capacity']
  },
  {
    id: '4',
    name: 'Running Shoes',
    price: 79.99,
    image: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports',
    brand: 'RunFast',
    rating: 4.3,
    reviews: 174,
    inStock: true,
    description: 'Lightweight running shoes with responsive cushioning.',
    features: ['Lightweight', 'Responsive Cushioning', 'Breathable Mesh', 'Durable Sole']
  },
  {
    id: '5',
    name: 'Desk Lamp',
    price: 34.99,
    image: 'https://images.pexels.com/photos/1000621/pexels-photo-1000621.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home',
    brand: 'BrightLife',
    rating: 4.4,
    reviews: 67,
    inStock: true,
    description: 'Adjustable LED desk lamp with multiple brightness levels.',
    features: ['LED Technology', 'Adjustable Arm', 'Multiple Brightness', 'USB Charging Port']
  },
  {
    id: '6',
    name: 'Backpack',
    price: 59.99,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion',
    brand: 'AdventurePack',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    description: 'Durable backpack with multiple compartments and water-resistant material.',
    features: ['Water Resistant', 'Multiple Compartments', 'Laptop Sleeve', 'Ergonomic Design']
  },
  {
    id: '7',
    name: 'Wireless Mouse',
    price: 29.99,
    image: 'https://images.pexels.com/photos/2148217/pexels-photo-2148217.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    brand: 'TechGear',
    rating: 4.1,
    reviews: 145,
    inStock: false,
    description: 'Ergonomic wireless mouse with precision tracking.',
    features: ['Wireless', 'Ergonomic Design', 'Precision Tracking', 'Long Battery Life']
  },
  {
    id: '8',
    name: 'Water Bottle',
    price: 19.99,
    image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports',
    brand: 'HydroMax',
    rating: 4.8,
    reviews: 312,
    inStock: true,
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.',
    features: ['Insulated', 'Stainless Steel', '24-hour Cold', 'Leak Proof']
  },
  {
    id: '9',
    name: 'Bluetooth Speaker',
    price: 49.99,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    brand: 'SoundWave',
    rating: 4.4,
    reviews: 189,
    inStock: true,
    description: 'Portable Bluetooth speaker with 360-degree sound.',
    features: ['360-degree Sound', 'Waterproof', '12-hour Battery', 'Voice Assistant']
  },
  {
    id: '10',
    name: 'Yoga Mat',
    price: 39.99,
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports',
    brand: 'FlexFit',
    rating: 4.5,
    reviews: 278,
    inStock: true,
    description: 'Non-slip yoga mat with superior grip and cushioning.',
    features: ['Non-slip Surface', 'Superior Cushioning', 'Eco-friendly', 'Carrying Strap']
  },
  {
    id: '11',
    name: 'Kitchen Scale',
    price: 27.99,
    image: 'https://images.pexels.com/photos/6195122/pexels-photo-6195122.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Kitchen',
    brand: 'PrecisionWeigh',
    rating: 4.3,
    reviews: 156,
    inStock: true,
    description: 'Digital kitchen scale with precise measurements up to 11 lbs.',
    features: ['Digital Display', 'Tare Function', 'Multiple Units', 'Compact Design']
  },
  {
    id: '12',
    name: 'Reading Glasses',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1637119/pexels-photo-1637119.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion',
    brand: 'ClearVision',
    rating: 4.2,
    reviews: 94,
    inStock: true,
    description: 'Comfortable reading glasses with anti-reflective coating.',
    features: ['Anti-reflective', 'Lightweight Frame', 'Multiple Strengths', 'Case Included']
  }
];

export const categories = ['Electronics', 'Kitchen', 'Sports', 'Fashion', 'Home'];
export const brands = ['TechSound', 'ProtectPlus', 'BrewMaster', 'RunFast', 'BrightLife', 'AdventurePack', 'TechGear', 'HydroMax', 'SoundWave', 'FlexFit', 'PrecisionWeigh', 'ClearVision'];