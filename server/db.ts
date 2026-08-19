import fs from 'fs';
import path from 'path';
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
  Review, 
  BusinessSettings 
} from '../src/types';
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
} from '../src/services/mockData';

interface DatabaseSchema {
  users: User[];
  vendors: Vendor[];
  menu: MenuItem[];
  plans: SubscriptionPlan[];
  subscriptions: UserSubscription[];
  orders: Order[];
  riders: DeliveryPersonnel[];
  transactions: PaymentTransaction[];
  expenses: ExpenseItem[];
  inventory: InventoryItem[];
  settings: BusinessSettings;
  reviews: Review[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Could not read database file, initializing with default dataset:', err);
    }

    const defaultData: DatabaseSchema = {
      users: [...INITIAL_USERS],
      vendors: [...INITIAL_VENDORS],
      menu: [...INITIAL_MENU_ITEMS],
      plans: [...INITIAL_PLANS],
      subscriptions: [...INITIAL_SUBSCRIPTIONS],
      orders: [...INITIAL_ORDERS],
      riders: [...INITIAL_RIDERS],
      transactions: [...INITIAL_TRANSACTIONS],
      expenses: [...INITIAL_EXPENSES],
      inventory: [...INITIAL_INVENTORY],
      settings: { ...INITIAL_SETTINGS },
      reviews: [...INITIAL_REVIEWS]
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  public persist() {
    this.saveData();
  }

  // Getters
  public get users() { return this.data.users; }
  public get vendors() { return this.data.vendors; }
  public get menu() { return this.data.menu; }
  public get plans() { return this.data.plans; }
  public get subscriptions() { return this.data.subscriptions; }
  public get orders() { return this.data.orders; }
  public get riders() { return this.data.riders; }
  public get transactions() { return this.data.transactions; }
  public get expenses() { return this.data.expenses; }
  public get inventory() { return this.data.inventory; }
  public get settings() { return this.data.settings; }
  public set settings(newSettings: BusinessSettings) { 
    this.data.settings = newSettings; 
    this.persist(); 
  }
  public get reviews() { return this.data.reviews; }
}

export const db = new Database();
