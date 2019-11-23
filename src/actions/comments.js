import C from '../constants';

let baseURL = C.SERVER_URL;

function requestComments(work_id) {
  return {
    type: C.REQUEST_COMMENTS_DATA,
    work_id: work_id
  }
}

function receiveComments(work_id, data) {
  return {
    type: C.RECEIVE_COMMENTS_DATA,
    work_id: work_id,
    items: data.items,
  }
}

function getCommentsForWork(work_id) {
  return function(dispatch){
    dispatch(requestComments(work_id));
    return fetch(baseURL + "/api/comments/" + work_id)
      .then(res => res.json())
      .then(data => dispatch(receiveComments(work_id, data))
      )
  }
}

function submitNewComment(postId, values) {
  return function(dispatch, getState){
    dispatch({type: C.AWAIT_NEW_COMMENT_RESPONSE});
    console.log('values: ', values);
    return fetch(baseURL + `/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {'Content-Type': 'application/json'}
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('json: ', json);
          dispatch({type: C.RECEIVE_NEW_COMMENT_RESPONSE, comment: json.comment, postId });
      })
      .catch ((error) => {
          dispatch({type: C.FAILED_NEW_COMMENT_RESPONSE, errors: [error]});
      })
  }
}

let deleteComment = (id, work_id) => {
  console.log(id, work_id);
  var error = false;
		return function(dispatch,getState){
      return fetch(baseURL + "/api/comments/" + id, {method: "DELETE"})
        .then(res => res.json())
        .then(data =>
          dispatch(getCommentsForWork(work_id))
        );
    };
}

const startCommentEdit = (qid) => {
		return {type:C.START_COMMENT_EDIT,qid};
}

const cancelCommentEdit = (qid) => {
		return {type:C.FINISH_COMMENT_EDIT,qid};
}

const submitCommentEdit = (qid, comment) => {
		return function(dispatch, getState){
      dispatch({type: 'UPDATE_COMMENT_REQUEST', commentId: qid });
      return fetch(baseURL + `/api/comments/${qid}`, {
        method: "PUT",
        body: JSON.stringify({ comment }),
        headers: {'Content-Type': 'application/json'}
      })
      .then((res) => res.json())
      .then((json) => {
          if (json.comment) {
            dispatch({ type: 'UPDATE_COMMENT_SUCCESS', comment: json.comment });
          }
        })
      .catch ((error) => {
          dispatch({ type: 'UPDATE_COMMENT_ERROR', error });
      })
    }
}



export default {getCommentsForWork, submitNewComment, startCommentEdit, cancelCommentEdit, submitCommentEdit, deleteComment};
