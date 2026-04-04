export interface Category {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  pieces: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  category?: Category;
  isAvailable: boolean;
  isRecommended: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sauce {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  sortOrder: number;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface GiftPromotion {
  id: number;
  thresholdAmount: number;
  giftDescription: string;
  isActive: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  type: 'DELIVERY' | 'PICKUP';
  customerName: string;
  customerPhone: string;
  address: string | null;
  comment: string;
  sauces: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface LoginResponse {
  access_token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
