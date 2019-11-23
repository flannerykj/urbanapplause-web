import type { Post } from './post';

export type Applause = {
  id: number,
  PostId: number,
  UserId: number,
  Post: ?Post,
  User: ?User,
  createdAt: Date,
  updatedAt: Date
}
