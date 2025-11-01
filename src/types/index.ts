// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'waiter' | 'manager' | 'admin' | 'customer';
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Manager-Specific Types
export interface ManagerKPI {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  period: 'today' | 'week' | 'month';
}

export interface StaffPerformance {
  id: string;
  name: string;
  role: 'waiter' | 'host' | 'bartender' | 'cook';
  tablesServed: number;
  ordersProcessed: number;
  tipsEarned: number;
  customerRating: number;
  shiftStart: Date;
  shiftEnd?: Date;
  efficiency: number; // percentage
}

export interface RevenueData {
  timestamp: Date;
  amount: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface ManagerAlert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Waiter-Specific Types
export interface WaiterTable {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'needsAttention' | 'ordering' | 'paying';
  guests: number;
  capacity: number;
  lastActivity: string;
  priority: 'high' | 'normal' | 'low';
  totalBill?: number;
  orders?: number;
  assignedWaiterId?: string;
}

export interface WaiterNotification {
  id: string;
  type: 'order' | 'request' | 'alert';
  title: string;
  message: string;
  tableNumber: string;
  timestamp: string;
  urgent: boolean;
  waiterId: string;
}

export interface WaiterShiftStats {
  hoursWorked: number;
  tablesServed: number;
  ordersProcessed: number;
  tipsEarned: number;
  customerRating: number;
  shiftStart: Date;
  shiftEnd?: Date;
}

export interface TableAction {
  action: 'seat' | 'reserve' | 'takeOrder' | 'viewTable' | 'requestBill' | 'clear';
  tableId: string;
  waiterId: string;
  timestamp: Date;
  notes?: string;
}

// Customer-Specific Types
export interface CustomerMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  dietary: string[];
  popular: boolean;
  rating: number;
  prepTime: string;
  allergens?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface CustomerOrderItem {
  menuItem: CustomerMenuItem;
  quantity: number;
  customizations: string[];
  assignedTo: string;
  specialInstructions?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  orders: CustomerOrderItem[];
  total: number;
  status: 'ordering' | 'ready' | 'confirmed' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'mobile';
}

export interface BillSplitOption {
  type: 'equal' | 'byItem' | 'byPercentage' | 'custom';
  participants: string[];
  amounts?: { [memberId: string]: number };
}

export interface CustomerTable {
  id: string;
  number: string;
  restaurant: {
    name: string;
    address: string;
    phone: string;
  };
  server: {
    name: string;
    id: string;
  };
  sessionId: string;
  members: GroupMember[];
  totalBill: number;
  tax: number;
  serviceCharge: number;
  status: 'active' | 'orderPlaced' | 'paymentPending' | 'completed';
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