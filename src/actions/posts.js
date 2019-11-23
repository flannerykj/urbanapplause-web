// @flow

import C from '../constants';
import type { Post } from '../types/post';
import type { ThunkAction, Dispatch, GetState } from '../types/redux';
import apiService from '../services/api-service';

let baseURL = C.SERVER_URL;

function requestPosts() {
  return {
    type: 'GET_POSTS_REQUEST'
  }
}

function receivePosts(data) {
  return {
    type: 'GET_POSTS_SUCCESS',
    posts: data.posts,
    page: data.page,
    pageSize: data.pageSize,
    total: data.total,
    receivedAt: Date.now()
  }
}

function selectPost(post: Post) {
  return {
    type: 'SELECT_POST',
    post
  }
}

function applaudPost(post_id: number, user_id: number) {
  return function(dispatch: Dispatch, getState: GetState) {
    dispatch({type: 'APPLAUD_POST_REQUEST'});
    return fetch(`${baseURL}/api/applause`, {
      body: JSON.stringify({ applause: { UserId: user_id, PostId: post_id }}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    })
      .then((res) => res.json())
      .then((json) => {
          if(json.applause) {
            dispatch({type: 'APPLAUD_POST_SUCCESS', applause: json.applause })
          } else {
            dispatch({ type: 'APPLAUD_POST_REMOVE', applause: json.deleted})
          }
      });
  }

}
function getPosts(values: ?{ string: string }): ThunkAction {
  const token = localStorage.getItem('token');
  const headers = {};
  headers['Content-Type'] = 'application/json';
  headers.Authorization = `Bearer ${token || ''}`;
  const opts = { headers };
  return function(dispatch: Dispatch, getState: GetState) {
    dispatch(requestPosts());
    let qs = "";
    if (values) {
      qs = Object.keys(values).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
      }).join('&');
      qs = "?" + qs;
    }
    console.log('qs: ', qs)
    return fetch(baseURL + "/api/posts" + qs, opts)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        dispatch(receivePosts(json))
      })
      .catch((error) => {
        dispatch({
          type: 'GET_POSTS_ERROR',
          error
        })
      });
  }
}


const deletePost = (id: number) => {
  var error = false;
  return function(dispatch: Dispatch, getState: GetState) {
      return fetch(baseURL + "/api/posts/" + id, {method: "DELETE"})
        .then(res => res.json())
        .then(data => dispatch(getPosts()));
    };
}

const findById = (id: number) => {
  return function(dispatch: Dispatch, getState: GetState) {
    dispatch(requestPost(id));
    return fetch(baseURL + "/api/posts/" + id)
      .then((res) => {
        return res.json()
      })
      .then(data => {
        console.log('data', data);
        dispatch(selectPost(data.post))
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function requestPost(id) {
  return {
    type: 'GET_POST_REQUEST',
  }
}

function receivePost(data) {
  return {
    type: 'GET_POST_SUCCESS',
    post: data,
    didReceiveData: true,
    receivedAt: Date.now()
  }
}

const startPostEdit = (qid: number) => {
		return {type: 'START_POST_EDIT' ,qid};
}

const cancelPostEdit = (qid: number) => {
		return {type:C.FINISH_POST_EDIT,qid};
}

const submitPostEdit = (qid, content) => {
		return function(dispatch,getState){
      /*var state = getState(),
				username = state.auth.username,
        uid = state.auth.uid,*/
      var error = false; //utils.validatePost(content);
			if (error){
				dispatch({type:C.DISPLAY_ERROR,error});
      } else {
        dispatch({type:C.SUBMIT_POST_EDIT,qid});
			}
		}
}

export default {
  getPosts,
  findById,
  startPostEdit,
  cancelPostEdit,
  deletePost,
  applaudPost,
  selectPost
};
