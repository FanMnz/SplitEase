// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'waiter' | 'manager' | 'admin';
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Restaurant/Venue Types
export interface Restaurant {
  id: string;
  name: string;
  type: 'restaurant' | 'bar' | 'cafe' | 'hotel' | 'entertainment';
  address: string;
  phone: string;
  email: string;
  settings: RestaurantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantSettings {
  currency: string;
  taxRate: number;
  serviceChargeRate: number;
  autoCloseTableAfter: number; // minutes
  allowEarlyCheckout: boolean;
  allowPreOrders: boolean;
}

// Table and Guest Types
export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  restaurantId: string;
  currentSessionId?: string;
}

export interface Guest {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  sessionId: string;
  status: 'active' | 'checked_out' | 'left_early';
  joinedAt: Date;
  checkedOutAt?: Date;
}

export interface TableSession {
  id: string;
  tableId: string;
  restaurantId: string;
  waiterId: string;
  guests: Guest[];
  status: 'active' | 'payment_pending' | 'completed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  totalAmount: number;
  taxAmount: number;
  serviceChargeAmount: number;
  finalAmount: number;
}

// Menu and Order Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurantId: string;
  isAvailable: boolean;
  prepTime: number; // minutes
  allergens: string[];
  image?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  totalPrice: number;
  guestId: string;
  sessionId: string;
  status: 'ordered' | 'preparing' | 'ready' | 'served' | 'cancelled';
  specialInstructions?: string;
  orderedAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  guestId: string;
  sessionId: string;
  amount: number;
  method: 'card' | 'cash' | 'mobile' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  processedAt?: Date;
  failureReason?: string;
}

export interface Bill {
  id: string;
  guestId: string;
  sessionId: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  serviceChargeAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  sentAt?: Date;
  paidAt?: Date;
  paymentMethod?: string;
}

// Split Options
export type SplitMethod = 'equal' | 'by_item' | 'custom' | 'percentage';

export interface SplitConfiguration {
  method: SplitMethod;
  includeTax: boolean;
  includeServiceCharge: boolean;
  customAmounts?: { [guestId: string]: number };
  percentages?: { [guestId: string]: number };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Real-time Event Types
export interface SocketEvent {
  type: 'order_update' | 'payment_update' | 'guest_joined' | 'guest_left' | 'bill_sent';
  sessionId: string;
  data: any;
  timestamp: Date;
}

// Dashboard and Analytics Types
export interface DashboardStats {
  totalTables: number;
  activeTables: number;
  totalRevenue: number;
  averageTableTurnover: number;
  guestSatisfaction: number;
}

export interface OrderAnalytics {
  popularItems: MenuItem[];
  averageOrderValue: number;
  peakHours: { hour: number; orderCount: number }[];
  splitMethodUsage: { [method in SplitMethod]: number };
}