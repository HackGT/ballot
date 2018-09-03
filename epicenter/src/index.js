import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import './css/index.css';
import AppContainer from './components/containers/AppContainer';

import { createStore } from 'redux';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
);
