import initialState from "../initialStore";
var  _ = require("lodash");


const selectedArtistReducer = (currentState, action) => {
	var newstate;
  switch(action.type){
    case 'SELECT_ARTIST':
      return Object.assign({}, currentState, {
        data: action.artist
      });
    case 'GET_ARTIST_REQUEST':
      return Object.assign({}, currentState, {
        data: null,
        loading: true,
        error: null
      });
    case 'GET_ARTIST_SUCCESS':
			return Object.assign({},currentState,{
        data: action.artist,
        loading: false,
        error: null
      });
    case 'GET_ARTIST_ERROR':
			return Object.assign({},currentState,{
        loading: false,
        error: action.error
      });

    case 'GET_ARTIST_POSTS_REQUEST':
      return Object.assign({},currentState, {
        posts: {
          data: [],
          loading: true,
          error: null
        }
      })
    case 'GET_ARTIST_POSTS_SUCCESS':
      return Object.assign({},currentState,{
        posts: {
          loading: false,
          data: action.posts,
          error: null
        }
      })
    case 'GET_ARTIST_POSTS_ERROR':
      return Object.assign({},currentState,{
        posts: {
          loading: false,
          data: [],
          error: action.error
        }
      })
    default:
      return currentState || initialState.selectedArtist;
	}
};

export default selectedArtistReducer;
