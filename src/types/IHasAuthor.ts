`src/types/IHasAuthor.ts`

import { Types } from 'mongoose';

export interface IHasAuthor {
  author: Types.ObjectId;
}