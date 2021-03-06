import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import './index.css';
import LandingPage from './components/LandingPage';
import reducers from './reducers';
import * as serviceWorker from './serviceWorker';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css'

const store = createStore(
    reducers,
    compose(applyMiddleware(thunk),
        // eslint-disable-next-line no-underscore-dangle
        process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__ ?
        // eslint-disable-next-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION__() : f => f),
);

ReactDOM.render(
    <Provider store={store}>
      <LandingPage/>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
