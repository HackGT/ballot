import * as React from "react";
import * as ReactDOM from "react-dom";

import Hello from "./containers/Hello";
import { Provider } from 'react-redux';
import { createStore } from "redux";
import { number } from './reducers/index';
import { StoreState } from './types/index';

const store = createStore<StoreState>(number, {
    numberLevel: 12,
    languageName: 'Bobby Dodd',
});

ReactDOM.render(
    <Provider store={store}>
        <Hello />
    </Provider>,
    document.getElementById('app') as HTMLElement
);