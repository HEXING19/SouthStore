import { CartItem } from './index';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  currency: string;
  pfPaymentId?: string;
  merchantOrderId?: string;
  customerName?: string;
  customerEmail: string;
  paymentMethod?: string;
  paymentDate?: Date;
  itemName: string;
  itemDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productCategory: string;
  price: number;
  quantity: number;
  image: string;
  createdAt: Date;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreatePaymentRequest {
  cartItems: CartItem[];
  totalAmount: number;
}

export interface CreatePaymentResponse {
  success: boolean;
  orderId: string;
  paymentData: {
    merchant_id: string;
    merchant_key: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    name_first: string;
    email_address: string;
    m_payment_id: string;
    amount: string;
    item_name: string;
    signature: string;
  };
}
