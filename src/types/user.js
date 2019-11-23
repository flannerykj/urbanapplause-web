// @flow
import type { Post } from './post';

export type Role = 'anonymous' | 'contributor' | 'artist' | 'admin';

export type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  bio: ?string,
  email: string,
  applaudedPosts: Array<Post>,
  followingUsers: Array<User>,
  followedByUsers: Array<User>,
  createdAt: Date,
  updatedAt: Date,
  role: Role
}

export type AuthForm = {
  email: string,
  password: string
}

