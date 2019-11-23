
import C from "../constants";
import initialState from "../initialStore";
var  _ = require("lodash");


const artistsReducer = (currentState, action) => {
	var newstate;
  switch(action.type){
    case 'GET_ARTISTS_REQUEST':
      return Object.assign({}, currentState, {
        data: [],
        loading: true,
        error: null
      });
    case 'GET_ARTISTS_SUCCESS':
			return Object.assign({},currentState,{
        data: action.artists,
        loading: false,
        error: null
      });

    case 'GET_ARTISTS_ERROR':
      return Object.assign({},currentState,{
        data: [],
        loading: false,
        error: action.error
      });
    default:
      return currentState || initialState.artists;
	}
};

export default artistsReducer;
