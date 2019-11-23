import C from "../constants";
import initialState from "../initialStore";
var  _ = require("lodash");


const settingsReducer = (currentState, action) => {
	var newstate;
  switch(action.type){
    case 'INIT_SETTINGS_SUCCESS':
      return Object.assign({}, currentState, {
        isLoaded: true
      });
    case 'SET_LANGUAGE':
      return Object.assign({}, currentState, {
        languagePref: action.languagePref
      });
  default:
      return currentState || initialState.settings;
	}
};

export default settingsReducer;
