import { Router, Request, Response } from 'express';
import { db } from '../db';
import { MenuItem } from '../../src/types';

export const menuRouter = Router();

// GET /api/v1/menu
menuRouter.get('/', (req: Request, res: Response) => {
  try {
    const { mealType, dietaryType, day, search } = req.query;
    let menu = [...db.menu];

    if (mealType && typeof mealType === 'string' && mealType !== 'all') {
      menu = menu.filter(m => m.mealType === mealType);
    }

    if (dietaryType && typeof dietaryType === 'string' && dietaryType !== 'all') {
      menu = menu.filter(m => m.dietaryType === dietaryType);
    }

    if (day && typeof day === 'string' && day !== 'all') {
      menu = menu.filter(m => !m.dayOfWeek || m.dayOfWeek === day);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      menu = menu.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.description.toLowerCase().includes(q) ||
        m.itemsIncluded?.some(item => item.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      data: menu,
      total: menu.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/menu/:id
menuRouter.get('/:id', (req: Request, res: Response) => {
  const item = db.menu.find(m => m.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  return res.json({ success: true, data: item });
});

// POST /api/v1/menu
menuRouter.post('/', (req: Request, res: Response) => {
  try {
    const itemData = req.body;
    const newItem: MenuItem = {
      ...itemData,
      id: `menu-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      available: itemData.available ?? true
    };

    db.menu.unshift(newItem);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/menu/:id
menuRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const index = db.menu.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const updated = { ...db.menu[index], ...req.body };
    db.menu[index] = updated;
    db.persist();

    return res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/v1/menu/:id
menuRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const index = db.menu.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    db.menu.splice(index, 1);
    db.persist();

    return res.json({
      success: true,
      message: 'Menu item deleted successfully',
      id: req.params.id
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
