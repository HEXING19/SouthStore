import { Product } from './types';

export const CURRENCY_SYMBOL = 'R'; // South African Rand

export const CATEGORIES = ['All', 'Clothing', 'Hardware', 'Home', 'Electronics'];

export const PRODUCTS: Product[] = [
  // Clothing
  {
    id: 'c1',
    name: 'Classic Denim Jacket',
    category: 'Clothing',
    price: 899,
    description: 'Durable and stylish denim jacket suitable for all seasons.',
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.5,
  },
  {
    id: 'c2',
    name: 'Summer Floral Dress',
    category: 'Clothing',
    price: 450,
    description: 'Lightweight breathable fabric, perfect for the SA summer heat.',
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.8,
  },
  {
    id: 'c3',
    name: 'Safety Work Boots',
    category: 'Clothing',
    price: 1200,
    description: 'Steel-toe capped boots for construction and heavy duty work.',
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.9,
  },
  
  // Hardware
  {
    id: 'h1',
    name: 'Cordless Drill Set 18V',
    category: 'Hardware',
    price: 1599,
    description: 'Professional grade drill with two batteries and carrying case.',
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.7,
  },
  {
    id: 'h2',
    name: 'General Tool Kit (50pc)',
    category: 'Hardware',
    price: 699,
    description: 'Essential tools for every household DIY project.',
    image: 'https://picsum.photos/400/400?random=5',
    rating: 4.2,
  },
  
  // Home & Electronics (Load shedding essentials)
  {
    id: 'e1',
    name: 'Rechargeable LED Lantern',
    category: 'Electronics',
    price: 350,
    description: 'Stay lit during load shedding. 10 hours battery life.',
    image: 'https://picsum.photos/400/400?random=6',
    rating: 4.9,
  },
  {
    id: 'e2',
    name: 'Portable Gas Stove',
    category: 'Home',
    price: 499,
    description: 'Single burner gas stove. Canister not included.',
    image: 'https://picsum.photos/400/400?random=7',
    rating: 4.6,
  },
  {
    id: 'e3',
    name: 'Solar Power Bank 20000mAh',
    category: 'Electronics',
    price: 550,
    description: 'Charge your devices with the power of the sun.',
    image: 'https://picsum.photos/400/400?random=8',
    rating: 4.3,
  },
];
