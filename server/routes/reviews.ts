import { Router, Request, Response } from 'express';
import { db } from '../db';
import { Review } from '../../src/types';

export const reviewRouter = Router();

// GET /api/v1/reviews
reviewRouter.get('/', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: db.reviews,
    total: db.reviews.length
  });
});

// POST /api/v1/reviews
reviewRouter.post('/', (req: Request, res: Response) => {
  try {
    const reviewData = req.body;
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    db.reviews.unshift(newReview);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newReview
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
