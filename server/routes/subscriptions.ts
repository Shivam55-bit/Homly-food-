import { Router, Request, Response } from 'express';
import { db } from '../db';
import { UserSubscription, SubscriptionPlan, PaymentTransaction } from '../../src/types';

export const subscriptionRouter = Router();

// GET /api/v1/plans
subscriptionRouter.get('/plans', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: db.plans
  });
});

// GET /api/v1/subscriptions
subscriptionRouter.get('/', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: db.subscriptions,
    total: db.subscriptions.length
  });
});

// GET /api/v1/subscriptions/user/:userId
subscriptionRouter.get('/user/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userSubs = db.subscriptions.filter(s => s.userId === userId);
  const activeSub = userSubs.find(s => s.status === 'active') || userSubs[0] || null;
  return res.json({
    success: true,
    data: activeSub,
    all: userSubs
  });
});

// POST /api/v1/subscriptions
subscriptionRouter.post('/', (req: Request, res: Response) => {
  try {
    const subData = req.body;
    const newSub: UserSubscription = {
      ...subData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    db.subscriptions.unshift(newSub);

    // Create payment transaction
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN_SUB_${Date.now().toString().slice(-8)}`,
      orderOrSubId: newSub.id,
      type: 'subscription',
      customerName: newSub.customerName,
      customerPhone: newSub.customerPhone,
      amount: newSub.amountPaid,
      paymentMethod: 'upi',
      status: 'paid',
      date: new Date().toISOString(),
      invoiceUrl: `/invoices/INV-${newSub.id}.pdf`
    };
    db.transactions.unshift(newTx);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: newSub,
      transaction: newTx
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/subscriptions/:id/pause
subscriptionRouter.put('/:id/pause', (req: Request, res: Response) => {
  try {
    const { dates } = req.body;
    const index = db.subscriptions.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    const existingDates = db.subscriptions[index].pauseDates || [];
    const updatedPauseDates = Array.from(new Set([...existingDates, ...(dates || [])]));

    const updated: UserSubscription = {
      ...db.subscriptions[index],
      pauseDates: updatedPauseDates,
      status: 'paused'
    };

    db.subscriptions[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Subscription paused for selected dates',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/subscriptions/:id/resume
subscriptionRouter.put('/:id/resume', (req: Request, res: Response) => {
  try {
    const { dateToRemove } = req.body;
    const index = db.subscriptions.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    let updatedDates = db.subscriptions[index].pauseDates || [];
    if (dateToRemove) {
      updatedDates = updatedDates.filter(d => d !== dateToRemove);
    } else {
      updatedDates = [];
    }

    const updated: UserSubscription = {
      ...db.subscriptions[index],
      pauseDates: updatedDates,
      status: updatedDates.length > 0 ? 'paused' : 'active'
    };

    db.subscriptions[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Subscription resumed successfully',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/subscriptions/:id
subscriptionRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const index = db.subscriptions.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    const updated = { ...db.subscriptions[index], ...req.body };
    db.subscriptions[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
