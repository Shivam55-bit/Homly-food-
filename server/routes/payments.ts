import { Router, Request, Response } from 'express';
import { db } from '../db';
import { PaymentStatus, PaymentTransaction } from '../../src/types';

export const paymentRouter = Router();

// GET /api/v1/payments/transactions
paymentRouter.get('/transactions', (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let txs = [...db.transactions];

    if (status && typeof status === 'string' && status !== 'all') {
      txs = txs.filter(t => t.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      txs = txs.filter(t =>
        t.transactionId.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerPhone.includes(q)
      );
    }

    return res.json({
      success: true,
      data: txs,
      total: txs.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/v1/payments/transactions/:id/status
paymentRouter.patch('/transactions/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const index = db.transactions.findIndex(t => t.id === req.params.id || t.transactionId === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    db.transactions[index].status = status as PaymentStatus;
    db.persist();

    return res.json({
      success: true,
      message: `Transaction status updated to ${status}`,
      data: db.transactions[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/payments/checkout
paymentRouter.post('/checkout', (req: Request, res: Response) => {
  try {
    const { amount, customerName, customerPhone, orderOrSubId, type, paymentMethod } = req.body;
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN_${Date.now().toString().slice(-8)}`,
      orderOrSubId: orderOrSubId || `ord-${Date.now()}`,
      type: type || 'order',
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '+91 98765 43210',
      amount: amount || 120,
      paymentMethod: paymentMethod || 'upi',
      status: paymentMethod === 'cod' ? 'pending' : 'paid',
      date: new Date().toISOString(),
      invoiceUrl: `/invoices/INV-${Date.now()}.pdf`
    };

    db.transactions.unshift(newTx);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: newTx
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
