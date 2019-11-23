import C from "../constants";
import initialState from "../initialStore";
var  _ = require("lodash");


const usersReducer = (currentstate,action) => {
	var newstate;
  switch(action.type){
    case 'GET_USERS_SUCCESS':
      return Object.assign({},currentstate,{
        data: action.items,
        page: action.page,
        pageSize: action.pageSize,
        total: action.total,
        receivedAt: action.receivedAt
      });
    case '':
      return Object.assign({},currentstate,{
        selectedUser: {
          hasrreceiveddata: action.didReceiveData,
          user: action.user,
          receivedAt: action.receivedAt}
      });
    case C.AWAIT_NEW_USER_RESPONSE:
			return Object.assign({},currentstate,{
				submittingnew: true
			});
		case C.RECEIVE_NEW_USER_RESPONSE:
			return Object.assign({},currentstate,{
				submittingnew: false
			});
		case C.START_USER_EDIT:
			newstate = _.cloneDeep(currentstate);
			newstate.states[action.qid] = C.EDITING_USER;
			return newstate;
		case C.FINISH_USER_EDIT:
			newstate = _.cloneDeep(currentstate);
			delete newstate.states[action.qid];
      return newstate;
  case C.SUBMIT_USER_EDIT:
      var selectedUser = currentstate.selectedUser.user;
      Object.keys(action.values).map((key, i) => {
        selectedUser[key] = action.values[key];
          return;
        });
      return Object.assign({},currentstate,{
				selectedUser: {user: selectedUser}
			});
    default:
      return currentstate || initialState.users;
	}
};

export default usersReducer;
