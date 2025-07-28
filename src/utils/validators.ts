`src/utils/validators.ts`

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Validasi payload untuk User
export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  password: Joi.string().min(6),
});

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

// Validasi payload untuk Article
export const articleSchema = Joi.object({
  status: Joi.string().valid('draft', 'published').required(),
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required(),
});

export const updateArticleSchema = Joi.object({
  status: Joi.string().valid('draft', 'published'),
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10),
});

// Middleware validateBody
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      return res.status(400).json({ error: messages });
    }
    next();
  };
};