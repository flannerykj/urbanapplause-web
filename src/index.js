// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { MapkitProvider } from 'react-mapkit';
import Cookie from 'js-cookie';
import { Provider } from 'react-redux';
import store from './store';
import { router } from './router';
import settingsActions from './actions/settings';
import authActions from './actions/auth';
import './sass/main.scss';
import C from './constants';
import type { Store } from './types/store';

const locale = Cookie.get('locale') || 'en';
// require("react-datepicker/dist/react-datepicker-cssmodules.css");

type Props = {}

class App extends React.Component<Props> {
  render() {
    return (
      <Provider store={store}>
          <div>{router(store)}</div>
      </Provider>
    );
  }
};

store.dispatch(settingsActions.initSettings());
store.dispatch(authActions.checkLocalAuthState());

ReactDOM.render(<App />, document.getElementById("root"));

