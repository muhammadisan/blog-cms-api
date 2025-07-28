`src/middleware/errorHandler.ts`

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status,
    },
  });
};