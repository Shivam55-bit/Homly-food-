import axios from 'axios';
import {
  User,
  Vendor,
  MenuItem,
  SubscriptionPlan,
  UserSubscription,
  Order,
  DeliveryPersonnel,
  PaymentTransaction,
  ExpenseItem,
  InventoryItem,
  BusinessSettings,
  OrderStatus,
  PaymentStatus,
  Review
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VENDORS,
  INITIAL_MENU_ITEMS,
  INITIAL_PLANS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_ORDERS,
  INITIAL_RIDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_EXPENSES,
  INITIAL_INVENTORY,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS
} from './mockData';

// Storage Keys for caching and offline fallback
const STORAGE_KEYS = {
  USERS: 'tiffin_crm_users',
  CURRENT_USER: 'tiffin_crm_current_user',
  VENDORS: 'tiffin_crm_vendors',
  MENU: 'tiffin_crm_menu',
  PLANS: 'tiffin_crm_plans',
  SUBSCRIPTIONS: 'tiffin_crm_subscriptions',
  ORDERS: 'tiffin_crm_orders',
  RIDERS: 'tiffin_crm_riders',
  TRANSACTIONS: 'tiffin_crm_transactions',
  EXPENSES: 'tiffin_crm_expenses',
  INVENTORY: 'tiffin_crm_inventory',
  SETTINGS: 'tiffin_crm_settings',
  REVIEWS: 'tiffin_crm_reviews'
};

// Helper for local storage
function getStorageData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setStorageData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Initialize storage on first load
export const initializeMockDatabase = () => {
  getStorageData(STORAGE_KEYS.USERS, INITIAL_USERS);
  getStorageData(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
  getStorageData(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
  getStorageData(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  getStorageData(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
  getStorageData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  getStorageData(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
  getStorageData(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  getStorageData(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  getStorageData(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  getStorageData(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  getStorageData(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
};

// Create Axios Client
export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 6000
});

// ================= API SERVICES ================= //

// 1. AUTH SERVICE
export const authService = {
  login: async (phoneOrEmail: string): Promise<User> => {
    try {
      const res = await apiClient.post('/auth/login', { phoneOrEmail });
      if (res.data.user) {
        setStorageData(STORAGE_KEYS.CURRENT_USER, res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.warn('Backend unavailable, fallback to local login:', err);
    }

    // Fallback
    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const cleanQuery = phoneOrEmail.toLowerCase().trim();
    let user = users.find(u => 
      u.phone.includes(phoneOrEmail) || 
      u.email.toLowerCase().includes(cleanQuery) ||
      (cleanQuery.includes('vendor') && u.role === 'vendor') ||
      (cleanQuery.includes('admin') && u.role === 'admin')
    );

    if (!user) {
      if (cleanQuery.includes('vendor')) {
        user = users.find(u => u.role === 'vendor') || INITIAL_USERS[1];
      } else if (cleanQuery.includes('admin')) {
        user = users.find(u => u.role === 'admin') || INITIAL_USERS[2];
      } else {
        user = {
          id: `usr-${Date.now()}`,
          name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Valued Customer',
          email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail.replace(/\D/g, '')}@homlyfood.com`,
          phone: phoneOrEmail.startsWith('+') ? phoneOrEmail : `+91 ${phoneOrEmail}`,
          role: 'customer',
          dietaryPreference: 'veg',
          walletBalance: 200,
          createdAt: new Date().toISOString(),
          addresses: [
            {
              id: `addr-${Date.now()}`,
              label: 'Home',
              street: '12th Main Road, HAL 2nd Stage',
              area: 'Indiranagar',
              city: 'Bangalore',
              pincode: '560008',
              isDefault: true
            }
          ]
        };
        users.push(user);
        setStorageData(STORAGE_KEYS.USERS, users);
      }
    }

    setStorageData(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  register: async (userData: Partial<User> & { street?: string; area?: string; city?: string; pincode?: string }): Promise<User> => {
    try {
      const res = await apiClient.post('/auth/register', userData);
      if (res.data.user) {
        setStorageData(STORAGE_KEYS.CURRENT_USER, res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.warn('Backend unavailable, registering in local store:', err);
    }

    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'Valued Customer',
      phone: userData.phone || '+91 98765 43210',
      email: userData.email || 'customer@homlyfood.com',
      role: userData.role || 'customer',
      dietaryPreference: userData.dietaryPreference || 'veg',
      walletBalance: 200,
      createdAt: new Date().toISOString(),
      addresses: userData.street ? [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          street: userData.street,
          area: userData.area || 'Indiranagar',
          city: userData.city || 'Bangalore',
          pincode: userData.pincode || '560038',
          isDefault: true
        }
      ] : []
    };

    users.unshift(newUser);
    setStorageData(STORAGE_KEYS.USERS, users);
    setStorageData(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  sendOTP: async (phone: string) => {
    try {
      const res = await apiClient.post('/auth/send-otp', { phone });
      return res.data;
    } catch {
      return { success: true, message: `OTP sent to ${phone}`, otpDebug: '5432' };
    }
  },

  verifyOTP: async (phone: string, otp: string): Promise<User> => {
    try {
      const res = await apiClient.post('/auth/verify-otp', { phone, otp });
      if (res.data.user) {
        setStorageData(STORAGE_KEYS.CURRENT_USER, res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.warn('Backend verify OTP fallback:', err);
    }

    return authService.login(phone);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return INITIAL_USERS[0];
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  updateProfile: async (updated: Partial<User>): Promise<User> => {
    try {
      const res = await apiClient.put('/auth/profile', updated);
      if (res.data.user) {
        setStorageData(STORAGE_KEYS.CURRENT_USER, res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.warn('Backend update profile fallback:', err);
    }

    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const current = authService.getCurrentUser() || INITIAL_USERS[0];
    const index = users.findIndex(u => u.id === current.id);
    
    const newUser = { ...current, ...updated };
    if (index !== -1) {
      users[index] = newUser;
    } else {
      users.push(newUser);
    }
    
    setStorageData(STORAGE_KEYS.USERS, users);
    setStorageData(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  }
};

// 2. CUSTOMER MANAGEMENT SERVICE
export const customerService = {
  getCustomers: async (search?: string, dietary?: string): Promise<User[]> => {
    try {
      const res = await apiClient.get('/customers', { params: { search, dietary } });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.USERS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getCustomers fallback:', err);
    }
    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    return users.filter(u => u.role === 'customer');
  },

  addCustomer: async (customerData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    try {
      const res = await apiClient.post('/customers', customerData);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend addCustomer fallback:', err);
    }
    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const newCustomer: User = {
      ...customerData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    users.unshift(newCustomer);
    setStorageData(STORAGE_KEYS.USERS, users);
    return newCustomer;
  },

  updateCustomer: async (id: string, updates: Partial<User>): Promise<User> => {
    try {
      const res = await apiClient.put(`/customers/${id}`, updates);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateCustomer fallback:', err);
    }
    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Customer not found');
    const updated = { ...users[index], ...updates };
    users[index] = updated;
    setStorageData(STORAGE_KEYS.USERS, users);
    return updated;
  },

  deleteCustomer: async (id: string): Promise<string> => {
    try {
      await apiClient.delete(`/customers/${id}`);
    } catch (err) {
      console.warn('Backend deleteCustomer fallback:', err);
    }
    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const filtered = users.filter(u => u.id !== id);
    setStorageData(STORAGE_KEYS.USERS, filtered);
    return id;
  }
};

// 3. MENU SERVICE
export const menuService = {
  getMenu: async (params?: { mealType?: string; dietaryType?: string; day?: string; search?: string }): Promise<MenuItem[]> => {
    try {
      const res = await apiClient.get('/menu', { params });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.MENU, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getMenu fallback:', err);
    }
    return getStorageData<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
  },

  addMenuItem: async (item: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>): Promise<MenuItem> => {
    try {
      const res = await apiClient.post('/menu', item);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend addMenuItem fallback:', err);
    }
    const items = getStorageData<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      available: item.available ?? true
    };
    items.unshift(newItem);
    setStorageData(STORAGE_KEYS.MENU, items);
    return newItem;
  },

  updateMenuItem: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
    try {
      const res = await apiClient.put(`/menu/${id}`, updates);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateMenuItem fallback:', err);
    }
    const items = getStorageData<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    const index = items.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Menu item not found');
    const updated = { ...items[index], ...updates };
    items[index] = updated;
    setStorageData(STORAGE_KEYS.MENU, items);
    return updated;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/menu/${id}`);
    } catch (err) {
      console.warn('Backend deleteMenuItem fallback:', err);
    }
    const items = getStorageData<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    const filtered = items.filter(m => m.id !== id);
    setStorageData(STORAGE_KEYS.MENU, filtered);
  }
};

// 4. SUBSCRIPTION SERVICE
export const subscriptionService = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const res = await apiClient.get('/subscriptions/plans');
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.PLANS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getPlans fallback:', err);
    }
    return getStorageData<SubscriptionPlan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  },

  getAllSubscriptions: async (): Promise<UserSubscription[]> => {
    try {
      const res = await apiClient.get('/subscriptions');
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.SUBSCRIPTIONS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getAllSubscriptions fallback:', err);
    }
    return getStorageData<UserSubscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
  },

  getUserSubscription: async (userId: string): Promise<UserSubscription | null> => {
    try {
      const res = await apiClient.get(`/subscriptions/user/${userId}`);
      if (res.data.data !== undefined) return res.data.data;
    } catch (err) {
      console.warn('Backend getUserSubscription fallback:', err);
    }
    const subs = getStorageData<UserSubscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    return subs.find(s => s.userId === userId && s.status === 'active') || subs.find(s => s.userId === userId) || null;
  },

  createSubscription: async (subData: Omit<UserSubscription, 'id' | 'createdAt'>): Promise<UserSubscription> => {
    try {
      const res = await apiClient.post('/subscriptions', subData);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend createSubscription fallback:', err);
    }
    const subs = getStorageData<UserSubscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    const newSub: UserSubscription = {
      ...subData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    subs.unshift(newSub);
    setStorageData(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    return newSub;
  },

  pauseDates: async (subId: string, dates: string[]): Promise<UserSubscription> => {
    try {
      const res = await apiClient.put(`/subscriptions/${subId}/pause`, { dates });
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend pauseDates fallback:', err);
    }
    const subs = getStorageData<UserSubscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    const index = subs.findIndex(s => s.id === subId);
    if (index === -1) throw new Error('Subscription not found');
    const updated = {
      ...subs[index],
      pauseDates: Array.from(new Set([...subs[index].pauseDates, ...dates])),
      status: 'paused' as const
    };
    subs[index] = updated;
    setStorageData(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    return updated;
  },

  resumeSubscription: async (subId: string, dateToRemove?: string): Promise<UserSubscription> => {
    try {
      const res = await apiClient.put(`/subscriptions/${subId}/resume`, { dateToRemove });
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend resumeSubscription fallback:', err);
    }
    const subs = getStorageData<UserSubscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    const index = subs.findIndex(s => s.id === subId);
    if (index === -1) throw new Error('Subscription not found');

    let updatedDates = subs[index].pauseDates;
    if (dateToRemove) {
      updatedDates = updatedDates.filter(d => d !== dateToRemove);
    } else {
      updatedDates = [];
    }

    const updated = {
      ...subs[index],
      pauseDates: updatedDates,
      status: updatedDates.length > 0 ? 'paused' as const : 'active' as const
    };
    subs[index] = updated;
    setStorageData(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    return updated;
  },

  updateSubscription: async (subId: string, updates: Partial<UserSubscription>): Promise<UserSubscription> => {
    try {
      const res = await apiClient.put(`/subscriptions/${subId}`, updates);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateSubscription fallback:', err);
    }
    const subs = getStorageData<UserSubscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    const index = subs.findIndex(s => s.id === subId);
    if (index === -1) throw new Error('Subscription not found');
    const updated = { ...subs[index], ...updates };
    subs[index] = updated;
    setStorageData(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    return updated;
  }
};

// 5. ORDER SERVICE
export const orderService = {
  getAllOrders: async (params?: { status?: string; slot?: string; search?: string }): Promise<Order[]> => {
    try {
      const res = await apiClient.get('/orders', { params });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.ORDERS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getAllOrders fallback:', err);
    }
    return getStorageData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    try {
      const res = await apiClient.get(`/orders/user/${userId}`);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend getUserOrders fallback:', err);
    }
    const orders = getStorageData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return orders.filter(o => o.userId === userId || o.userId === 'usr-1');
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> => {
    try {
      const res = await apiClient.post('/orders', orderData);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend createOrder fallback:', err);
    }
    const orders = getStorageData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `HF-2026-${randSuffix}`,
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    setStorageData(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus, riderId?: string): Promise<Order> => {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/status`, { status, riderId });
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateOrderStatus fallback:', err);
    }
    const orders = getStorageData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    let riderName = orders[index].deliveryBoyName;
    let riderPhone = orders[index].deliveryBoyPhone;
    if (riderId) {
      const riders = getStorageData<DeliveryPersonnel[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
      const rider = riders.find(r => r.id === riderId);
      if (rider) {
        riderName = rider.name;
        riderPhone = rider.phone;
      }
    }

    const updated: Order = {
      ...orders[index],
      status,
      deliveryBoyId: riderId || orders[index].deliveryBoyId,
      deliveryBoyName: riderName,
      deliveryBoyPhone: riderPhone,
      deliveredAt: status === 'delivered' ? new Date().toISOString() : orders[index].deliveredAt
    };
    orders[index] = updated;
    setStorageData(STORAGE_KEYS.ORDERS, orders);
    return updated;
  },

  updateOrderPayment: async (orderId: string, paymentStatus: PaymentStatus): Promise<Order> => {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/payment`, { paymentStatus });
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateOrderPayment fallback:', err);
    }
    const orders = getStorageData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    orders[index].paymentStatus = paymentStatus;
    setStorageData(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  assignRider: async (orderId: string, riderId: string): Promise<Order> => {
    try {
      const res = await apiClient.post(`/orders/${orderId}/assign-rider`, { riderId });
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend assignRider fallback:', err);
    }
    return orderService.updateOrderStatus(orderId, 'out_for_delivery', riderId);
  },

  updateOrder: async (id: string, updates: Partial<Order>): Promise<Order> => {
    try {
      const res = await apiClient.put(`/orders/${id}`, updates);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateOrder fallback:', err);
    }
    const orders = getStorageData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    const updated = { ...orders[index], ...updates };
    orders[index] = updated;
    setStorageData(STORAGE_KEYS.ORDERS, orders);
    return updated;
  },

  deleteOrder: async (id: string): Promise<string> => {
    try {
      await apiClient.delete(`/orders/${id}`);
    } catch (err) {
      console.warn('Backend deleteOrder fallback:', err);
    }
    const orders = getStorageData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const filtered = orders.filter(o => o.id !== id);
    setStorageData(STORAGE_KEYS.ORDERS, filtered);
    return id;
  }
};

// 6. VENDOR SERVICE
export const vendorService = {
  getVendors: async (search?: string): Promise<Vendor[]> => {
    try {
      const res = await apiClient.get('/vendors', { params: { search } });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.VENDORS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getVendors fallback:', err);
    }
    return getStorageData<Vendor[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
  },

  getVendorStats: async (vendorId: string) => {
    try {
      const res = await apiClient.get(`/vendors/${vendorId}/stats`);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend getVendorStats fallback:', err);
    }
    const vendors = getStorageData<Vendor[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const vendor = vendors.find(v => v.id === vendorId || v.userId === vendorId) || vendors[0];
    return {
      vendor,
      totalOrders: vendor.totalOrdersCompleted,
      todaysOrdersCount: 28,
      todaysEarnings: vendor.todaysEarnings,
      totalEarnings: vendor.totalEarnings,
      activeSubscribers: vendor.activeSubscribers,
      rating: vendor.rating
    };
  },

  addVendor: async (vendorData: Partial<Vendor>): Promise<Vendor> => {
    try {
      const res = await apiClient.post('/vendors', vendorData);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend addVendor fallback:', err);
    }
    const vendors = getStorageData<Vendor[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const newVendor: Vendor = {
      id: `ven-${Date.now()}`,
      userId: vendorData.userId || `usr-vendor-${Date.now()}`,
      kitchenName: vendorData.kitchenName || 'New Cloud Kitchen',
      ownerName: vendorData.ownerName || 'Kitchen Owner',
      phone: vendorData.phone || '+91 99999 88888',
      email: vendorData.email || 'kitchen@homlyfood.com',
      address: vendorData.address || 'Indiranagar',
      area: vendorData.area || 'Indiranagar',
      city: vendorData.city || 'Bangalore',
      fssaiLicense: vendorData.fssaiLicense || `FSSAI-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: 'active',
      rating: 5.0,
      totalOrdersCompleted: 0,
      activeSubscribers: 0,
      todaysEarnings: 0,
      totalEarnings: 0,
      commissionPercentage: vendorData.commissionPercentage || 10,
      speciality: Array.isArray(vendorData.speciality) ? vendorData.speciality : [vendorData.speciality || 'North Indian Thalis'],
      createdAt: new Date().toISOString()
    };
    vendors.unshift(newVendor);
    setStorageData(STORAGE_KEYS.VENDORS, vendors);
    return newVendor;
  },

  updateVendor: async (id: string, updates: Partial<Vendor>): Promise<Vendor> => {
    try {
      const res = await apiClient.put(`/vendors/${id}`, updates);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateVendor fallback:', err);
    }
    const vendors = getStorageData<Vendor[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const index = vendors.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vendor not found');
    const updated = { ...vendors[index], ...updates };
    vendors[index] = updated;
    setStorageData(STORAGE_KEYS.VENDORS, vendors);
    return updated;
  },

  deleteVendor: async (id: string): Promise<string> => {
    try {
      await apiClient.delete(`/vendors/${id}`);
    } catch (err) {
      console.warn('Backend deleteVendor fallback:', err);
    }
    const vendors = getStorageData<Vendor[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const filtered = vendors.filter(v => v.id !== id);
    setStorageData(STORAGE_KEYS.VENDORS, filtered);
    return id;
  }
};

// 7. DELIVERY SERVICE
export const deliveryService = {
  getRiders: async (params?: { status?: string; search?: string }): Promise<DeliveryPersonnel[]> => {
    try {
      const res = await apiClient.get('/delivery/riders', { params });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.RIDERS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getRiders fallback:', err);
    }
    return getStorageData<DeliveryPersonnel[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
  },

  assignRider: async (orderId: string, riderId: string): Promise<Order> => {
    return orderService.updateOrderStatus(orderId, 'out_for_delivery', riderId);
  },

  addRider: async (rider: Omit<DeliveryPersonnel, 'id' | 'currentOrdersCount' | 'rating'>): Promise<DeliveryPersonnel> => {
    try {
      const res = await apiClient.post('/delivery/riders', rider);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend addRider fallback:', err);
    }
    const riders = getStorageData<DeliveryPersonnel[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
    const newRider: DeliveryPersonnel = {
      ...rider,
      id: `rider-${Date.now()}`,
      currentOrdersCount: 0,
      rating: 5.0
    };
    riders.push(newRider);
    setStorageData(STORAGE_KEYS.RIDERS, riders);
    return newRider;
  },

  updateRider: async (id: string, updates: Partial<DeliveryPersonnel>): Promise<DeliveryPersonnel> => {
    try {
      const res = await apiClient.put(`/delivery/riders/${id}`, updates);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateRider fallback:', err);
    }
    const riders = getStorageData<DeliveryPersonnel[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
    const index = riders.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Rider not found');
    const updated = { ...riders[index], ...updates };
    riders[index] = updated;
    setStorageData(STORAGE_KEYS.RIDERS, riders);
    return updated;
  }
};

// 8. PAYMENT SERVICE
export const paymentService = {
  getTransactions: async (params?: { status?: string; search?: string }): Promise<PaymentTransaction[]> => {
    try {
      const res = await apiClient.get('/payments/transactions', { params });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.TRANSACTIONS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getTransactions fallback:', err);
    }
    return getStorageData<PaymentTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },

  updateTransactionStatus: async (txId: string, status: PaymentStatus): Promise<PaymentTransaction> => {
    try {
      const res = await apiClient.patch(`/payments/transactions/${txId}/status`, { status });
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateTransactionStatus fallback:', err);
    }
    const txs = getStorageData<PaymentTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const index = txs.findIndex(t => t.id === txId || t.transactionId === txId);
    if (index === -1) throw new Error('Transaction not found');
    const updated = { ...txs[index], status };
    txs[index] = updated;
    setStorageData(STORAGE_KEYS.TRANSACTIONS, txs);
    return updated;
  },

  processCheckout: async (payload: any): Promise<PaymentTransaction> => {
    try {
      const res = await apiClient.post('/payments/checkout', payload);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend checkout fallback:', err);
    }
    const txs = getStorageData<PaymentTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN_${Date.now().toString().slice(-8)}`,
      orderOrSubId: payload.orderOrSubId || `ord-${Date.now()}`,
      type: payload.type || 'order',
      customerName: payload.customerName || 'Customer',
      customerPhone: payload.customerPhone || '+91 98765 43210',
      amount: payload.amount || 150,
      paymentMethod: payload.paymentMethod || 'upi',
      status: 'paid',
      date: new Date().toISOString()
    };
    txs.unshift(newTx);
    setStorageData(STORAGE_KEYS.TRANSACTIONS, txs);
    return newTx;
  }
};

// 9. EXPENSE SERVICE
export const expenseService = {
  getExpenses: async (params?: { category?: string; search?: string }): Promise<ExpenseItem[]> => {
    try {
      const res = await apiClient.get('/expenses', { params });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.EXPENSES, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getExpenses fallback:', err);
    }
    return getStorageData<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  },

  addExpense: async (expense: Omit<ExpenseItem, 'id'>): Promise<ExpenseItem> => {
    try {
      const res = await apiClient.post('/expenses', expense);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend addExpense fallback:', err);
    }
    const expenses = getStorageData<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const newExpense: ExpenseItem = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    expenses.unshift(newExpense);
    setStorageData(STORAGE_KEYS.EXPENSES, expenses);
    return newExpense;
  },

  deleteExpense: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/expenses/${id}`);
    } catch (err) {
      console.warn('Backend deleteExpense fallback:', err);
    }
    const expenses = getStorageData<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const filtered = expenses.filter(e => e.id !== id);
    setStorageData(STORAGE_KEYS.EXPENSES, filtered);
  }
};

// 10. INVENTORY SERVICE
export const inventoryService = {
  getInventory: async (params?: { status?: string; search?: string }): Promise<InventoryItem[]> => {
    try {
      const res = await apiClient.get('/inventory', { params });
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.INVENTORY, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getInventory fallback:', err);
    }
    return getStorageData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  },

  addInventoryItem: async (item: Omit<InventoryItem, 'id' | 'status'>): Promise<InventoryItem> => {
    try {
      const res = await apiClient.post('/inventory', item);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend addInventoryItem fallback:', err);
    }
    const items = getStorageData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    const status = item.currentStock <= item.minThreshold ? 'low_stock' : 'in_stock';
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      status
    };
    items.unshift(newItem);
    setStorageData(STORAGE_KEYS.INVENTORY, items);
    return newItem;
  },

  updateStock: async (id: string, newStock: number): Promise<InventoryItem> => {
    try {
      const res = await apiClient.put(`/inventory/${id}/stock`, { newStock });
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend updateStock fallback:', err);
    }
    const items = getStorageData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inventory item not found');

    const item = items[index];
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (newStock <= 0) status = 'out_of_stock';
    else if (newStock <= item.minThreshold) status = 'low_stock';

    const updated = {
      ...item,
      currentStock: newStock,
      status,
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    items[index] = updated;
    setStorageData(STORAGE_KEYS.INVENTORY, items);
    return updated;
  }
};

// 11. REVIEW SERVICE
export const reviewService = {
  getReviews: async (): Promise<Review[]> => {
    try {
      const res = await apiClient.get('/reviews');
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.REVIEWS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getReviews fallback:', err);
    }
    return getStorageData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  addReview: async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    try {
      const res = await apiClient.post('/reviews', review);
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend addReview fallback:', err);
    }
    const reviews = getStorageData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    reviews.unshift(newRev);
    setStorageData(STORAGE_KEYS.REVIEWS, reviews);
    return newRev;
  }
};

// 12. SETTINGS SERVICE
export const settingsService = {
  getSettings: async (): Promise<BusinessSettings> => {
    try {
      const res = await apiClient.get('/settings');
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.SETTINGS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend getSettings fallback:', err);
    }
    return getStorageData<BusinessSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings: async (settings: Partial<BusinessSettings>): Promise<BusinessSettings> => {
    try {
      const res = await apiClient.put('/settings', settings);
      if (res.data.data) {
        setStorageData(STORAGE_KEYS.SETTINGS, res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend updateSettings fallback:', err);
    }
    const current = getStorageData<BusinessSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const updated = { ...current, ...settings };
    setStorageData(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }
};

// 13. REPORT SERVICE
export const reportService = {
  getSummary: async () => {
    try {
      const res = await apiClient.get('/reports/summary');
      if (res.data.data) return res.data.data;
    } catch (err) {
      console.warn('Backend getSummary fallback:', err);
    }
    return {
      totalRevenue: 284500,
      totalOrderRevenue: 142500,
      totalSubRevenue: 142000,
      totalExpenses: 78900,
      netProfit: 205600,
      profitMargin: '72.3',
      activeSubsCount: 68,
      totalCustomers: 120,
      totalVendors: 4,
      totalDeliveredOrders: 320,
      totalOrdersCount: 350
    };
  }
};
