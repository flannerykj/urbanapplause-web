import initialstate from "../initialStore";
import C from '../constants';

const authUserReducer = (currentState,action) => {
  switch(action.type){
    case 'GET_AUTH_USER_REQUEST':
      return Object.assign({},currentState, {
        loading: true
      })
    case 'GET_AUTH_USER_SUCCESS':
      return Object.assign({},currentState,{
        loading: false,
        data: action.user,
        error: null
      })
    case 'GET_AUTH_USER_ERROR':
      return Object.assign({},currentState,{
        loading: false,
        error: action.error
      })
    default:
      return currentState || initialstate.auth;
	}
}

export default authUserReducer;
