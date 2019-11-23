// @flow
import C from '../constants';
import postActions from './posts';
import artistActions from './artists';
import {getValidDate} from '../services/time';
import type { Post } from '../types/post';
//ACTION CREATORS

let baseURL = C.SERVER_URL;

function newPostRequest() {
  return {
    type: 'NEW_POST_REQUEST',
  }
}
function newPostSuccess(post: Post) {
  return {
    type: 'NEW_POST_SUCCESS',
    post
  }
}
function newPostFailure(error: string) {
  return {
    type: 'NEW_POST_FAILURE',
    error
  }
}
function createPost(values: Post, files: Array<File>) {
  console.log('creating post body: ', values);
  return function(dispatch, getState){
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString && JSON.parse(userString);
    dispatch(newPostRequest());
    return fetch(baseURL + "/api/posts", {
      method: "POST",
      body: JSON.stringify({ post: Object.assign({}, values, {
        UserId: user.id
      })}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${token}'
      }})
      .then((res) => res.json())
      .then((json) => {
        if (json.post && json.post.id) {
      } else {
        console.log('json with no post id: ', json);
      }
      })
      .catch((err) => {
          dispatch(newPostFailure(err));
        });
  }
}
function submitNewPost(values: Post, files: Array<File>) {
  console.log('values: ', values);
  return function(dispatch, getState){
    if (values.artistInputType == 'create') {
      console.log('creating new');
      const artist = {
        signing_name: values.artist_signing_name
      };
      return fetch(baseURL + "/api/artists", {
        method: "POST",
        body: JSON.stringify({ artist }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${token}'
        }})
        .then((res) => res.json())
        .then((json) => {
          if (json.artist && json.artist.id) {
            const postBody = { ...values, ArtistId: json.artist.id }
            console.log('post body');
            return dispatch(createPost(postBody, files));
          } else {
            console.log('error whiel creating artist: ', json);
          }
        })
        .catch((err) => { console.log(err) });
    } else {
      return dispatch(createPost(values, files));
    }
  }
}

export default {
  submitNewPost
};
