import { createStore, applyMiddleware, compose } from 'redux';
import * as reducers from './reducers/index';
import { combineReducers } from 'redux-immutablejs';
import { Map, fromJS } from 'immutable';
import promiseMiddleware from 'redux-promise';
import * as types from './actions/types';
import createLogger from 'redux-logger';

/*
 * Creates the Redux Store, with some middlewares for good measure.
 * The promise middleware allows dispatching Promises to the store, which
 * will be resolved before the reducers are called.
 */

const reducer = combineReducers(reducers);
const state = fromJS({});
const store = createStore(
    reducer,
    state,
    applyMiddleware(promiseMiddleware, createLogger({ stateTransformer: state => state.toJS() })));
export default store;
