import initialstate from "../initialStore";
import C from '../constants';

const authReducer = (currentState,action) => {
  switch(action.type){
    case 'RESET_AUTH_FORM':
      return initialstate.auth;
    case 'AUTH_REQUEST':
      return Object.assign({},currentState, {
        loading: true
      })
    case 'AUTH_SUCCESS':
      return Object.assign({},currentState,{
        role: action.role,
        loggedIn: true,
        loading: false,
        sessionExpires: action.expires,
        error: null
      })
    case 'AUTH_ERROR':
      return Object.assign({},currentState,{
        loggedIn: false,
        loading: false,
        error: action.error
      })
		case 'LOGOUT':
			return Object.assign({},currentState,{
        loggedIn: false,
        loading: false,
        error: null,
        sessionExpires: null
      });
		case 'GET_PASSWORD_CHECK_SUCCESS':
			return Object.assign({},currentState,{
        passwordCheck: action.check
			});
    default:
      return currentState || initialstate.auth;
	}
}

export default authReducer;
