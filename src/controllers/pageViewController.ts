`src/controllers/pageViewController.ts`

import { Request, Response, NextFunction } from 'express';
import { PageView } from '../models/PageView';
import { Types } from 'mongoose';

// Helper: membangun filter query berdasarkan query parameter
function buildPageViewFilter(query: any): Record<string, any> {
  const { article, startAt, endAt } = query;
  const filter: any = {};

  if (article && Types.ObjectId.isValid(article)) {
    filter.article = Types.ObjectId.createFromHexString(article);
  }

  if (startAt || endAt) {
    filter.viewedAt = {};
    if (startAt) filter.viewedAt.$gte = new Date(startAt);
    if (endAt) filter.viewedAt.$lte = new Date(endAt);
  }

  return filter;
}

// Helper: menentukan grouping berdasarkan interval
function getGroupIdByInterval(interval: string) {
  switch (interval) {
    case 'hourly':
      return {
        year: { $year: '$viewedAt' },
        month: { $month: '$viewedAt' },
        day: { $dayOfMonth: '$viewedAt' },
        hour: { $hour: '$viewedAt' }
      };
    case 'monthly':
      return {
        year: { $year: '$viewedAt' },
        month: { $month: '$viewedAt' }
      };
    default:
      return {
        year: { $year: '$viewedAt' },
        month: { $month: '$viewedAt' },
        day: { $dayOfMonth: '$viewedAt' }
      };
  }
}

// Helper: format label hasil aggregasi
function formatIntervalLabel(_id: any, interval: string): string {
  const { year, month, day, hour } = _id;
  if (interval === 'hourly') return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:00`;
  if (interval === 'monthly') return `${year}-${pad(month)}`;
  return `${year}-${pad(month)}-${pad(day)}`;
}

// Helper: padding angka
function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

// Controller: Record a page view
export const recordPageView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { article } = req.body;
    if (!Types.ObjectId.isValid(article)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    await PageView.create({ article });
    res.status(201).end();
  } catch (err) {
    next(err);
  }
};

// Controller: Count total page views
export const countPageViews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = buildPageViewFilter(req.query);
    const count = await PageView.countDocuments(filter);
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// Controller: Aggregate views by time interval
export const aggregatePageViews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const interval = (req.query.interval as string) || 'daily';
    const filter = buildPageViewFilter(req.query);
    const groupId = getGroupIdByInterval(interval);

    const results = await PageView.aggregate([
      { $match: filter },
      { $group: { _id: groupId, count: { $sum: 1 } } },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          ...(interval === 'hourly' && { '_id.hour': 1 })
        }
      }
    ]);

    const formatted = results.map(r => ({
      interval: formatIntervalLabel(r._id, interval),
      count: r.count
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};
