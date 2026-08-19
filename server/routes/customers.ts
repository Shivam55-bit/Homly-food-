import { Router, Request, Response } from 'express';
import { db } from '../db';
import { User } from '../../src/types';

export const customerRouter = Router();

// GET /api/v1/customers
customerRouter.get('/', (req: Request, res: Response) => {
  try {
    const { search, dietary } = req.query;
    let customers = db.users.filter(u => u.role === 'customer');

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.phone.includes(q) || 
        c.email.toLowerCase().includes(q)
      );
    }

    if (dietary && typeof dietary === 'string' && dietary !== 'all') {
      customers = customers.filter(c => c.dietaryPreference === dietary);
    }

    return res.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/customers/:id
customerRouter.get('/:id', (req: Request, res: Response) => {
  const customer = db.users.find(u => u.id === req.params.id && u.role === 'customer');
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  return res.json({ success: true, data: customer });
});

// POST /api/v1/customers
customerRouter.post('/', (req: Request, res: Response) => {
  try {
    const customerData = req.body;
    const newCustomer: User = {
      ...customerData,
      id: `usr-${Date.now()}`,
      role: 'customer',
      walletBalance: customerData.walletBalance ?? 0,
      createdAt: new Date().toISOString()
    };

    db.users.unshift(newCustomer);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      data: newCustomer
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/customers/:id
customerRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const updated = { ...db.users[index], ...req.body };
    db.users[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Customer updated successfully',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/v1/customers/:id
customerRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    db.users.splice(index, 1);
    db.persist();

    return res.json({
      success: true,
      message: 'Customer deleted successfully',
      id: req.params.id
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
