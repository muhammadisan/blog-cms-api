`src/controllers/articleController.ts`

import { Request, Response, NextFunction } from 'express';
import { Article, IArticle } from '../models/Article';
import { articleSchema, updateArticleSchema } from '../utils/validators';

// Helper function to extract validation error
function getValidationError(schema: any, data: any): string | null {
  const { error } = schema.validate(data);
  return error ? error.message : null;
}

// GET /articles - List published articles (or drafts if logged in)
export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = req.user ? { author: req.user._id } : { status: 'published' };
    const articles = await Article.find(filter).populate('author', 'name username');
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

// GET /articles/:id - Get single article with access control
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name username');

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const isDraft = article.status === 'draft';
    const isOwner = req.user && article.author && article.author._id.equals(req.user._id);

    if (isDraft && !isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(article);
  } catch (err) {
    next(err);
  }
};

// POST /articles - Create new article (auth required)
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationError = getValidationError(articleSchema, req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const data = { ...req.body, author: req.user!._id };
    const newArticle = await Article.create(data as IArticle);
    res.status(201).json(newArticle);
  } catch (err) {
    next(err);
  }
};

// PATCH /articles/:id - Update article (auth + ownership required)
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationError = getValidationError(updateArticleSchema, req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const isOwner = req.user && article.author && article.author._id.equals(req.user._id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /articles/:id - Delete article (auth + ownership required)
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const isOwner = req.user && article.author && article.author._id.equals(req.user._id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
