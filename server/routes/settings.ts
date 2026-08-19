import { Router, Request, Response } from 'express';
import { db } from '../db';
import { BusinessSettings } from '../../src/types';

export const settingsRouter = Router();

// GET /api/v1/settings
settingsRouter.get('/', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: db.settings
  });
});

// PUT /api/v1/settings
settingsRouter.put('/', (req: Request, res: Response) => {
  try {
    const updatedSettings: BusinessSettings = {
      ...db.settings,
      ...req.body
    };

    db.settings = updatedSettings;

    return res.json({
      success: true,
      message: 'Business settings updated successfully',
      data: updatedSettings
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
