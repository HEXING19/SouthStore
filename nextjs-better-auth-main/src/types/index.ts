export interface Product {
  id: string;
  name: string;
  category: 'Clothing' | 'Hardware' | 'Home' | 'Electronics';
  price: number;
  description: string;
  image: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ViewState = 'HOME' | 'SHOP' | 'PRODUCT_DETAIL';
