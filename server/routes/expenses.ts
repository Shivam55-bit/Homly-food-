import { Router, Request, Response } from 'express';
import { db } from '../db';
import { ExpenseItem } from '../../src/types';

export const expenseRouter = Router();

// GET /api/v1/expenses
expenseRouter.get('/', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let expenses = [...db.expenses];

    if (category && typeof category === 'string' && category !== 'all') {
      expenses = expenses.filter(e => e.category === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      expenses = expenses.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.paidTo.toLowerCase().includes(q)
      );
    }

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    return res.json({
      success: true,
      data: expenses,
      totalAmount,
      total: expenses.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/expenses
expenseRouter.post('/', (req: Request, res: Response) => {
  try {
    const expenseData = req.body;
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    };

    db.expenses.unshift(newExpense);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newExpense
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/v1/expenses/:id
expenseRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const index = db.expenses.findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    db.expenses.splice(index, 1);
    db.persist();

    return res.json({
      success: true,
      message: 'Expense deleted successfully',
      id: req.params.id
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
