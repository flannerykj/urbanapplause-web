
import C from "../constants";
import initialState from "../initialStore";
var  _ = require("lodash");


const newPostsReducer = (currentState, action) => {
	var newstate;
  switch(action.type){
    case 'NEW_POST_REQUEST':
			return Object.assign({},currentState,{
				loading: true
			});
		case 'NEW_POST_SUCCESS':
			return Object.assign({},currentState,{
        loading: false,
        error: null,
        data: action.post
      });
    case 'NEW_POST_ERROR':
			return Object.assign({},currentState,{
        loading: false,
        error: action.error
			});
    default:
      return currentState || initialState.newPost;
	}
};

export default newPostsReducer;
