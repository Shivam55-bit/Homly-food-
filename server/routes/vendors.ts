import { Router, Request, Response } from 'express';
import { db } from '../db';
import { Vendor } from '../../src/types';

export const vendorRouter = Router();

// GET /api/v1/vendors
vendorRouter.get('/', (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let vendors = [...db.vendors];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      vendors = vendors.filter(v =>
        v.kitchenName.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q) ||
        v.area.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      data: vendors,
      total: vendors.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/vendors/:id
vendorRouter.get('/:id', (req: Request, res: Response) => {
  const vendor = db.vendors.find(v => v.id === req.params.id || v.userId === req.params.id);
  if (!vendor) {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }
  return res.json({ success: true, data: vendor });
});

// GET /api/v1/vendors/:id/stats
vendorRouter.get('/:id/stats', (req: Request, res: Response) => {
  const vendor = db.vendors.find(v => v.id === req.params.id || v.userId === req.params.id);
  if (!vendor) {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }

  const vendorOrders = db.orders.filter(o => o.vendorId === vendor.id);
  const todaysOrders = vendorOrders.filter(o => {
    const today = new Date().toISOString().split('T')[0];
    return o.createdAt.startsWith(today);
  });

  return res.json({
    success: true,
    data: {
      vendor,
      totalOrders: vendorOrders.length || vendor.totalOrdersCompleted,
      todaysOrdersCount: todaysOrders.length || 24,
      todaysEarnings: vendor.todaysEarnings,
      totalEarnings: vendor.totalEarnings,
      activeSubscribers: vendor.activeSubscribers,
      rating: vendor.rating
    }
  });
});

// POST /api/v1/vendors
vendorRouter.post('/', (req: Request, res: Response) => {
  try {
    const vendorData = req.body;
    const newVendor: Vendor = {
      ...vendorData,
      id: `ven-${Date.now()}`,
      userId: vendorData.userId || `usr-vendor-${Date.now()}`,
      status: 'active',
      rating: 5.0,
      totalOrdersCompleted: 0,
      activeSubscribers: 0,
      todaysEarnings: 0,
      totalEarnings: 0,
      commissionPercentage: vendorData.commissionPercentage || 10,
      createdAt: new Date().toISOString(),
      speciality: Array.isArray(vendorData.speciality) ? vendorData.speciality : [vendorData.speciality || 'North Indian Thalis']
    };

    db.vendors.unshift(newVendor);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Vendor added successfully',
      data: newVendor
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/vendors/:id
vendorRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const index = db.vendors.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const updated = { ...db.vendors[index], ...req.body };
    db.vendors[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/v1/vendors/:id
vendorRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const index = db.vendors.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    db.vendors.splice(index, 1);
    db.persist();

    return res.json({
      success: true,
      message: 'Vendor removed successfully',
      id: req.params.id
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
