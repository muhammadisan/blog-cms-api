`src/routes/pageViewRoutes.ts`

import { Router } from 'express';
import {
  recordPageView,
  countPageViews,
  aggregatePageViews,
} from '../controllers/pageViewController';
import { protect } from '../middleware/auth';

const router = Router();

// Record view (public)
router.post('/', recordPageView);

// Count views (protected)
router.get('/count', protect, countPageViews);

// Aggregate by interval (protected)
router.get('/aggregate-date', protect, aggregatePageViews);

export default router;