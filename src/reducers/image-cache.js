import initialstate from "../initialStore";
import C from '../constants';

const imageCacheReducer = (currentState,action) => {
  switch(action.type){
    case 'ADD_IMAGES':
      return Object.assign({}, currentState, action.images)
    case 'CLEAR':
      return {}
    default:
      return currentState || initialstate.imageCache;
	}
}

export default imageCacheReducer;
