`src/models/PageView.ts`

import { Schema, model, Document, Types } from 'mongoose';

export interface IPageView extends Document {
  article: Types.ObjectId;
  viewedAt: Date;
}

const pageViewSchema = new Schema<IPageView>(
  {
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    viewedAt: { type: Date, default: Date.now },
  }
);

pageViewSchema.index({ article: 1, viewedAt: 1 });

export const PageView = model<IPageView>('PageView', pageViewSchema);