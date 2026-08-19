# Tiffin Customer Web App 🍱

Production-ready, Swiggy/Zomato-style mobile-first PWA for daily Indian tiffin deliveries and meal pass subscriptions.

## Tech Stack
- **React.js 19 + TypeScript**
- **Vite**
- **Tailwind CSS**
- **Redux Toolkit** (Global state & meal cart)
- **React Router DOM v7**
- **Axios** (API client with interceptors & localStorage persistence)
- **Lucide Icons**
- **Canvas Confetti**
- **PWA Ready**

## Folder Structure & Pages
```
Tiffin-customer-web/
├── src/
│   ├── components/
│   │   ├── CustomerNavbar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── MealCard.tsx
│   │   ├── DietaryBadge.tsx
│   │   ├── PwaInstallBanner.tsx
│   │   └── InvoiceDownloadModal.tsx
│   ├── pages/
│   │   ├── Authentication:
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── OTPVerification.tsx
│   │   ├── Main:
│   │   │   ├── Home.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Plans.tsx
│   │   │   └── OrderNow.tsx
│   │   └── Customer:
│   │       ├── Profile.tsx
│   │       ├── MySubscription.tsx
│   │       ├── MyOrders.tsx
│   │       ├── PaymentHistory.tsx
│   │       ├── PauseDelivery.tsx
│   │       └── Feedback.tsx
│   ├── store/
│   ├── services/
│   └── types/
```

## Features Included
1. **Home Screen**:
   - Tiffin Logo & Personalized greeting
   - Today's Fresh Menu with live countdowns
   - Active Subscription widget with Pause/Resume quick access
   - Order Now CTA button
   - Promotional Offers banner carousel (FLAT 25% OFF, Weekend sweet)
   - Customer ratings & review testimonials
2. **Bottom Navigation**:
   - Home, Menu, Plans, Orders (with live badge count), Profile
3. **Order Screen**:
   - Meal Selection (Breakfast, Lunch, Dinner)
   - Plan Selection (Daily, Weekly, Monthly)
   - Calendar Date Picker & Slot Selector (Morning, Afternoon, Evening)
   - Delivery Address Selector (+ Add new address)
   - Quantity stepper & add-ons
   - Total amount breakdown (Subtotal, GST, Delivery Fee, Coupon code)
   - Confirm Order Button with celebratory confetti
4. **Subscription UI**:
   - Monthly Plan, Weekly Trial Plan, Custom Pass
   - Price, duration, discount badge, savings calculation, checklist of benefits
5. **Payment Screen & Invoicing**:
   - Payment summary, mode selector (UPI/Card/Wallet/COD), digital GST Tax Invoice print/download
6. **Pause Delivery**:
   - Interactive multi-day calendar UI
   - Date picker, meal slot picker (Breakfast/Lunch/Dinner/All), reason dropdown, credit rollover counter
7. **Customer Feedback**:
   - Food taste, delivery punctuality, packaging hygiene ratings & review submission
