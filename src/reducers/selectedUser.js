import initialstate from "../initialStore";
import C from '../constants';

const selectedUserReducer = (currentState,action) => {
  switch(action.type){
    case 'SELECT_USER':
      return Object.assign({},currentState, {
        data: action.user
      })
    case 'GET_USER_REQUEST':
      return Object.assign({},currentState, {
        loading: true
      })
    case 'GET_USER_SUCCESS':
      return Object.assign({},currentState,{
        loading: false,
        data: action.user,
        error: null
      })
    case 'GET_USER_ERROR':
      return Object.assign({},currentState,{
        loading: false,
        error: action.error
      })

    case 'GET_USER_APPLAUSE_REQUEST':
      return Object.assign({},currentState, {
        applause: {
          data: [],
          loading: true,
          error: null
        }
      })
    case 'GET_USER_APPLAUSE_SUCCESS':
      return Object.assign({},currentState,{
        applause: {
          loading: false,
          data: action.applause,
          error: null
        }
      })
    case 'GET_USER_APPLAUSE_ERROR':
      return Object.assign({},currentState,{
        applause: {
          loading: false,
          data: [],
          error: action.error
        }
      })

    case 'APPLAUD_POST_SUCCESS':
      if (currentState.data && action.applause.UserId == currentState.data.id) {
      var newItems = currentState.applause.data.map((item, i) => {
        if (item.id === action.applause.PostId) {
          const updatedApplause = item.Applause ? item.Applause : [];
          updatedApplause.push(action.applause);

          return Object.assign({}, item, {
            Applause: updatedApplause
          })
        }
        return item;
      });
        return Object.assign({}, currentState, {
          applause: {
            ...currentState.applause,
            data: newItems
          }
        })
      }

    case 'APPLAUD_POST_REMOVE':
      var newItems = currentState.applause.data.map((item, i) => {
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
      return Object.assign({}, currentState, {
        applause: {
          ...currentState.applause,
          data: newItems
        }
      })
    case 'GET_USER_POSTS_REQUEST':
      return Object.assign({},currentState, {
        posts: {
          data: [],
          loading: true,
          error: null
        }
      })
    case 'GET_USER_POSTS_SUCCESS':
      return Object.assign({},currentState,{
        posts: {
          loading: false,
          data: action.posts,
          error: null
        }
      })
    case 'GET_USER_POSTS_ERROR':
      return Object.assign({},currentState,{
        posts: {
          loading: false,
          data: [],
          error: action.error
        }
      })
    case 'UPDATE_USER_SUCCESS':
      return Object.assign({},currentState,{
        submitting: false,
        data: Object.assign({}, currentState.data ? currentState.data : {}, action.user),
        submissionError: null
      })
    case 'UPDATE_USER_REQUEST':
      return Object.assign({},currentState, {
        submitting: true
      })
    case 'UPDATE_USER_ERROR':
      return Object.assign({},currentState,{
        submitting: false,
        submissionError: action.error
      })
    default:
      return currentState || initialstate.selectedUser;
	}
}

export default selectedUserReducer;
