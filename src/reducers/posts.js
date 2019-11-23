
import C from "../constants";
import initialState from "../initialStore";
var  _ = require("lodash");


const postsReducer = (currentState, action) => {
	var newstate;
  switch(action.type){
    case 'RECEIVE_NEW_COMMENT_RESPONSE':
      const postIndex = currentState.data.findIndex((el) => {
        return el.id === action.postId
      });
      let post = Object.assign({}, currentState.data[postIndex], {});// NOTE - doesn't register change in view unless do object assign
      if (post) {
        let comments = post.Comments;
        comments.push(action.comment);
        post.Comments = comments;
        let nextItems = currentState.data;
        nextItems.splice(postIndex, 1, post);
        return Object.assign({}, currentState, {
          data: nextItems
        });
      }
    case 'GET_POSTS_REQUEST':
      return Object.assign({}, currentState, {
        data: [],
        loading: true,
        error: null
      });
    case 'GET_POSTS_SUCCESS':
			return Object.assign({},currentState,{
        data: action.posts,
        loading: false,
        error: null
      });

    case 'GET_POSTS_ERROR':
			return Object.assign({},currentState,{
        loading: false,
        error: action.error
      });
    case 'APPLAUD_POST_SUCCESS':
      var newItems = currentState.data.map((item, i) => {
        if (item.id === action.applause.PostId) {
          const updatedApplause = item.Applause ? item.Applause : [];
          updatedApplause.push(action.applause);

          return Object.assign({}, item, {
            Applause: updatedApplause
          })
        }
        return item;
      });
      return Object.assign({}, currentState, {data: newItems})
    case 'APPLAUD_POST_REMOVE':
      var newItems = currentState.data.map((item, i) => {
        if (item.id === action.applause.PostId) {
          const updatedApplause = item.Applause ? item.Applause : [];
          const index = updatedApplause.indexOf(action.applause);
          updatedApplause.splice(index, 1)
          if (index > -1 ) {
            return Object.assign({}, item, {
              Applause: updatedApplause
            })
          }
        }
        return item;
      });
      return Object.assign({}, currentState, {data: newItems})
    case 'UPDATE_COMMENT_SUCCESS':
      var newItems = currentState.data.map((item, i) => {
        if (item.id === action.comment.PostId) {
          let comments = item.Comments ? item.Comments: [];
          const updatedCommentIndex = comments.findIndex((comment) => comment.id == action.comment.id);
          comments.splice(updatedCommentIndex, 1, action.comment);
          return Object.assign({}, item, {
            Comments: comments
          })
        } else {
          console.log(item);
        }
        return item;
      });
      return Object.assign({}, currentState, { data: newItems })
    default:
      return currentState || initialState.posts;
	}
};

export default postsReducer;
