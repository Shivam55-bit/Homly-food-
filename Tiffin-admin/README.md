# Tiffin Admin CRM & Operations Dashboard 🏢

Enterprise CRM and Cloud Kitchen Operations System for Tiffin and Food Subscription Services.

## Tech Stack
- **React.js 19 + TypeScript**
- **Vite**
- **Tailwind CSS**
- **Redux Toolkit**
- **React Router DOM v7**
- **Recharts** (Interactive Area, Bar, and Pie Charts)
- **Axios** (API client with interceptors & localStorage persistence)
- **Lucide Icons**
- **Dark / Light Mode Support**

## Folder Structure & Pages
```
Tiffin-admin/
├── src/
│   ├── components/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── StatCard.tsx
│   │   └── StatusBadge.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── CustomerManagement.tsx
│   │   ├── OrderManagement.tsx
│   │   ├── SubscriptionManagement.tsx
│   │   ├── MenuManagement.tsx
│   │   ├── DeliveryManagement.tsx
│   │   ├── PaymentManagement.tsx
│   │   ├── ExpenseManagement.tsx
│   │   ├── InventoryManagement.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── store/
│   ├── services/
│   └── types/
```

## Admin Pages & Modules Included
1. **Dashboard**:
   - KPIs: Active Subscribers, Today's Orders, Monthly Revenue, Pending Dispatches
   - Recharts Area Chart: Weekly Revenue & Order volume
   - Recharts Bar Chart: Subscriber Growth & 92% retention rate
   - Today's Deliveries dispatch overview & Low-stock alert cards
2. **Customer Management**:
   - Customer Table with columns: Name, Phone, Email, Dietary Preference, Primary Delivery Area, Wallet Balance
   - Search by name, phone, or locality
   - Dietary filter (Pure Veg / Non-Veg / Jain)
   - "+ Add Customer" & "Edit Customer" Modals
   - "Customer 360" View Drawer with lifetime subscriptions and orders history
3. **Order Management**:
   - Real-time Order list with items, delivery slot, and amount
   - Instant Status Update dropdown (Placed -> Preparing -> Out for Delivery -> Delivered -> Cancelled)
   - Filters by status, meal slot (Morning/Lunch/Dinner), and date
   - Order detail modal with customer special instructions
4. **Subscription Management**:
   - Active Subscriptions, Expired Subscriptions, and Plan Configurations
   - Plan manager: Price, duration days, included meals, max pause days
   - Quick Actions: Extend subscription (+7 days), pause on behalf of customer
5. **Menu Management**:
   - Add / Edit Dish Modal with recipe details, calories, proteins, price, and ingredients tags
   - Weekly Menu Planner Calendar matrix (Monday through Sunday x Breakfast, Lunch, Dinner)
   - Availability toggle (In stock vs Out of stock)
6. **Delivery Management**:
   - Delivery dispatch board grouped by slots (Morning, Lunch, Dinner)
   - Assign delivery rider dropdown
   - Fleet Riders Directory: active status, vehicle number, current deliveries, rating
   - One-click Batch Dispatch: "Mark All Lunch Dispatched"
7. **Payment Management**:
   - Payment ledger with transaction ID, mode (UPI/Card/COD/Wallet), status
   - Pending Payments filter with 1-click "Send WhatsApp Payment Reminder"
   - Printable digital GST Tax Invoice generator modal
8. **Expense Management**:
   - Kitchen & operational expense ledger (Groceries, Packaging, Logistics, Utilities, Wages)
   - Recharts Pie Chart for category expense breakdown
   - "+ Add Expense" modal
9. **Inventory Management**:
   - Raw ingredient stock list (Basmati Rice, Malai Paneer, Atta, Desi Ghee, Toor Dal, Meal Boxes, LPG Cylinders)
   - Low Stock Alert banner with reorder threshold warnings
   - Restock Modal with instant replenishment
10. **Reports & Profit/Loss**:
    - Revenue vs Costs vs Net Profit 5-month bar chart
    - Formal Profit & Loss Statement (Gross Revenue - Ingredients COGS - Packaging - Wages - Utilities = Net EBITDA)
    - Export report to CSV & Print Report actions
11. **Settings**:
    - Business Profile (Kitchen name, FSSAI license, GSTIN, Contact, Address)
    - Kitchen Operational Cutoffs (Breakfast cutoff, Lunch cutoff, Dinner cutoff, Pause deadline)
    - Pricing & Tax (GST 5%, standard delivery fee, free delivery threshold)
