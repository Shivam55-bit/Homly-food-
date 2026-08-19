import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testBackend() {
  console.log('Testing Homly Food Backend API Endpoints...\n');

  try {
    // 1. Health
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data.status, health.data.service);

    // 2. Menu
    const menu = await axios.get(`${BASE_URL}/menu`);
    console.log(`✅ Menu Items: ${menu.data.data.length} items loaded`);

    // 3. Subscriptions Plans
    const plans = await axios.get(`${BASE_URL}/subscriptions/plans`);
    console.log(`✅ Subscription Plans: ${plans.data.data.length} plans`);

    // 4. Orders
    const orders = await axios.get(`${BASE_URL}/orders`);
    console.log(`✅ Orders: ${orders.data.data.length} active/past orders`);

    // 5. Vendors
    const vendors = await axios.get(`${BASE_URL}/vendors`);
    console.log(`✅ Kitchen Vendors: ${vendors.data.data.length} cloud kitchens`);

    // 6. Delivery Fleet
    const delivery = await axios.get(`${BASE_URL}/delivery/riders`);
    console.log(`✅ Delivery Riders: ${delivery.data.data.length} riders`);

    // 7. Customers
    const customers = await axios.get(`${BASE_URL}/customers`);
    console.log(`✅ Customers: ${customers.data.data.length} registered customers`);

    // 8. Financial Reports
    const reports = await axios.get(`${BASE_URL}/reports/summary`);
    console.log(`✅ Business Reports: Revenue ₹${reports.data.data.totalRevenue}, Net Profit ₹${reports.data.data.netProfit}`);

    // 9. Test Order Placement
    const newOrderPayload = {
      userId: 'usr-1',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98765 43210',
      items: [
        {
          menuItemId: 'item-lunch',
          name: 'LUNCH Executive Thali Combo',
          mealType: 'lunch',
          dietaryType: 'veg',
          quantity: 2,
          price: 139
        }
      ],
      planType: 'daily',
      selectedMeals: ['lunch'],
      scheduledDate: '2026-08-20',
      deliverySlot: 'afternoon',
      deliveryAddress: {
        id: 'addr-1',
        label: 'Home',
        street: 'Flat 402, Sunshine Residency, 14th Main',
        area: 'Indiranagar',
        city: 'Bangalore',
        pincode: '560038',
        isDefault: true
      },
      status: 'placed',
      subtotal: 278,
      deliveryFee: 0,
      discount: 20,
      tax: 14,
      totalAmount: 272,
      paymentMethod: 'upi',
      paymentStatus: 'paid'
    };

    const placedOrder = await axios.post(`${BASE_URL}/orders`, newOrderPayload);
    console.log(`✅ Placed Order Created: #${placedOrder.data.data.orderNumber} (ID: ${placedOrder.data.data.id})`);

    // 10. Update Order Status
    const updatedOrder = await axios.patch(`${BASE_URL}/orders/${placedOrder.data.data.id}/status`, {
      status: 'preparing'
    });
    console.log(`✅ Order Status Transition: ${updatedOrder.data.data.status}`);

    console.log('\n🎉 ALL BACKEND API ENDPOINTS VERIFIED & WORKING PERFECTLY!');
  } catch (err: any) {
    console.error('❌ Test failed:', err.response?.data || err.message);
  }
}

testBackend();
