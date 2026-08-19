import { Router, Request, Response } from 'express';
import { db } from '../db';

export const reportRouter = Router();

// GET /api/v1/reports/summary
reportRouter.get('/summary', (_req: Request, res: Response) => {
  try {
    const orders = db.orders;
    const subscriptions = db.subscriptions;
    const expenses = db.expenses;
    const customers = db.users.filter(u => u.role === 'customer');
    const vendors = db.vendors;

    const totalOrderRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalSubRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amountPaid, 0);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = totalOrderRevenue + totalSubRevenue;
    const netProfit = totalRevenue - totalExpenses;

    const activeSubsCount = subscriptions.filter(s => s.status === 'active').length;
    const totalDeliveredOrders = orders.filter(o => o.status === 'delivered').length;

    return res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrderRevenue,
        totalSubRevenue,
        totalExpenses,
        netProfit,
        profitMargin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0',
        activeSubsCount,
        totalCustomers: customers.length,
        totalVendors: vendors.length,
        totalDeliveredOrders,
        totalOrdersCount: orders.length
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
