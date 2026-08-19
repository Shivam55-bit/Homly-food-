import { Router, Request, Response } from 'express';
import { db } from '../db';
import { DeliveryPersonnel } from '../../src/types';

export const deliveryRouter = Router();

// GET /api/v1/delivery/riders
deliveryRouter.get('/riders', (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let riders = [...db.riders];

    if (status && typeof status === 'string' && status !== 'all') {
      riders = riders.filter(r => r.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      riders = riders.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.assignedArea.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      data: riders,
      total: riders.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/delivery/riders
deliveryRouter.post('/riders', (req: Request, res: Response) => {
  try {
    const riderData = req.body;
    const newRider: DeliveryPersonnel = {
      ...riderData,
      id: `rider-${Date.now()}`,
      currentOrdersCount: 0,
      rating: 5.0,
      status: riderData.status || 'active'
    };

    db.riders.push(newRider);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Delivery rider added successfully',
      data: newRider
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/delivery/riders/:id
deliveryRouter.put('/riders/:id', (req: Request, res: Response) => {
  try {
    const index = db.riders.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    const updated = { ...db.riders[index], ...req.body };
    db.riders[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Rider updated successfully',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
