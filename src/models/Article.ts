`src/models/Article.ts`

import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IArticle extends Document {
  status: 'draft' | 'published';
  title: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

articleSchema.index({ status: 1 });


export const Article = model<IArticle>('Article', articleSchema);