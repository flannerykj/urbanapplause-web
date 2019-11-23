import Comment from './comment';
import { PostImage } from './postImage';
import { User } from './user';
import { Location, GoogleMapsPlace, googlemapsAddressComponent } from './location';

export type Post = {
  id: number,
  title: string,
  createdAt: Date,
  updatedAt: Date,
  Comments: Array<Comment>,
  PostImages: Array<PostImage>,
  User: User
}

export type NewPost = {
  UserId: ?number,
  description: string,
  google_place: ?GoogleMapsPlace,
  photo_date: string,
  ArtistId: ?number,
  artist_signing_name: string,
  artistInputType: 'select' | 'create' | 'unknown',
  location: ?Location
}
