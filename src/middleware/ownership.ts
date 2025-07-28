`src/middleware/ownership.ts`

import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';

interface IHasAuthor {
  author: Types.ObjectId;
}

export const ensureOwner = <T extends IHasAuthor>(model: Model<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    const user = req.user;
    const { id } = req.params;

    const resource = await model.findById(id).lean();
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    if (resource.author.toString() !== user._id.toString()) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    next();
  };
};
