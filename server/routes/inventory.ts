import { Router, Request, Response } from 'express';
import { db } from '../db';
import { InventoryItem } from '../../src/types';

export const inventoryRouter = Router();

// GET /api/v1/inventory
inventoryRouter.get('/', (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let inventory = [...db.inventory];

    if (status && typeof status === 'string' && status !== 'all') {
      inventory = inventory.filter(i => i.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      inventory = inventory.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.supplier.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      data: inventory,
      total: inventory.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/inventory
inventoryRouter.post('/', (req: Request, res: Response) => {
  try {
    const itemData = req.body;
    const status = itemData.currentStock <= itemData.minThreshold ? 'low_stock' : 'in_stock';
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      status,
      lastRestocked: itemData.lastRestocked || new Date().toISOString().split('T')[0]
    };

    db.inventory.unshift(newItem);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Inventory item added',
      data: newItem
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/inventory/:id/stock
inventoryRouter.put('/:id/stock', (req: Request, res: Response) => {
  try {
    const { newStock } = req.body;
    const index = db.inventory.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const item = db.inventory[index];
    const stockVal = Number(newStock);
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (stockVal <= 0) status = 'out_of_stock';
    else if (stockVal <= item.minThreshold) status = 'low_stock';

    const updated: InventoryItem = {
      ...item,
      currentStock: stockVal,
      status,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    db.inventory[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
