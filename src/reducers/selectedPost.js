import initialState from "../initialStore";
var  _ = require("lodash");


const selectedPostReducer = (currentState, action) => {
	var newstate;
  switch(action.type){
    case 'SELECT_POST':
      return Object.assign({}, currentState, {
        data: action.post
      });
    case 'GET_POST_REQUEST':
      return Object.assign({}, currentState, {
        data: null,
        loading: true,
        error: null
      });
    case 'GET_POST_SUCCESS':
			return Object.assign({},currentState,{
        data: action.post,
        loading: false,
        error: null
      });
    case 'GET_POST_ERROR':
			return Object.assign({},currentState,{
        loading: false,
        error: action.error
      });
    default:
      return currentState || initialState.selectedPost;
	}
};

export default selectedPostReducer;
