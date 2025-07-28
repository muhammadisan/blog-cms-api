`src/routes/articleRoutes.ts`

import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController';
import { protect } from '../middleware/auth';
import { ensureOwner } from '../middleware/ownership';
import { Article } from '../models/Article';

const router = Router();

// Public: published only
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Authenticated: create and draft read
router.post('/', protect, createArticle);
router.get('/draft/:id', protect, getArticleById);

// Update & delete by owner
router.patch('/:id', protect, ensureOwner(Article), updateArticle);
router.delete('/:id', protect, ensureOwner(Article), deleteArticle);

export default router;