import { Router, Request, Response } from 'express';
import { db } from '../db';
import { Order, PaymentTransaction, OrderStatus } from '../../src/types';

export const orderRouter = Router();

// GET /api/v1/orders
orderRouter.get('/', (req: Request, res: Response) => {
  try {
    const { status, slot, search, vendorId, userId } = req.query;
    let orders = [...db.orders];

    if (userId && typeof userId === 'string') {
      orders = orders.filter(o => o.userId === userId || o.userId === 'usr-1');
    }

    if (vendorId && typeof vendorId === 'string' && vendorId !== 'all') {
      orders = orders.filter(o => o.vendorId === vendorId);
    }

    if (status && typeof status === 'string' && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    if (slot && typeof slot === 'string' && slot !== 'all') {
      orders = orders.filter(o => o.deliverySlot === slot);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.deliveryAddress?.area?.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      data: orders,
      total: orders.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/orders/user/:userId
orderRouter.get('/user/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userOrders = db.orders.filter(o => o.userId === userId || o.userId === 'usr-1');
  return res.json({
    success: true,
    data: userOrders
  });
});

// GET /api/v1/orders/:id
orderRouter.get('/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  return res.json({ success: true, data: order });
});

// POST /api/v1/orders
orderRouter.post('/', (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `HF-2026-${randSuffix}`,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'placed'
    };

    db.orders.unshift(newOrder);

    // Create payment transaction
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN_ORD_${Date.now().toString().slice(-8)}`,
      orderOrSubId: newOrder.id,
      type: 'order',
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      amount: newOrder.totalAmount,
      paymentMethod: newOrder.paymentMethod,
      status: newOrder.paymentStatus,
      date: new Date().toISOString(),
      invoiceUrl: `/invoices/INV-${newOrder.orderNumber}.pdf`
    };
    db.transactions.unshift(newTx);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
      transaction: newTx
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/v1/orders/:id/status
orderRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status, riderId } = req.body;
    const index = db.orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let riderName = db.orders[index].deliveryBoyName;
    let riderPhone = db.orders[index].deliveryBoyPhone;

    if (riderId) {
      const rider = db.riders.find(r => r.id === riderId);
      if (rider) {
        riderName = rider.name;
        riderPhone = rider.phone;
      }
    }

    const updated: Order = {
      ...db.orders[index],
      status: status as OrderStatus,
      deliveryBoyId: riderId || db.orders[index].deliveryBoyId,
      deliveryBoyName: riderName,
      deliveryBoyPhone: riderPhone,
      deliveredAt: status === 'delivered' ? new Date().toISOString() : db.orders[index].deliveredAt
    };

    db.orders[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/v1/orders/:id/payment
orderRouter.patch('/:id/payment', (req: Request, res: Response) => {
  try {
    const { paymentStatus } = req.body;
    const index = db.orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    db.orders[index].paymentStatus = paymentStatus;
    db.persist();

    return res.json({
      success: true,
      message: 'Payment status updated',
      data: db.orders[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/orders/:id/assign-rider
orderRouter.post('/:id/assign-rider', (req: Request, res: Response) => {
  try {
    const { riderId } = req.body;
    const index = db.orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const rider = db.riders.find(r => r.id === riderId);
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    const updated: Order = {
      ...db.orders[index],
      status: 'out_for_delivery',
      deliveryBoyId: rider.id,
      deliveryBoyName: rider.name,
      deliveryBoyPhone: rider.phone
    };

    db.orders[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: `Assigned to rider ${rider.name}`,
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
