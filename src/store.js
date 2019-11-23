// @flow
import {createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';
import initialStore from './initialStore';

var middleware = [thunk];
if(process.env.NODE_ENV=="development"){
  middleware = [...middleware, logger]
}
const store = applyMiddleware(...middleware)(createStore)(rootReducer,initialStore);

export default store;

