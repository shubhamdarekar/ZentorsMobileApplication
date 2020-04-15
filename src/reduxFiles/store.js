import React from 'react';
import { LOGIN, FIRST_TIME_DONE, CHANGE_LOADING_STATE, LOGOUT, CHANGE_SIGNUP_STATE, GET_ROLE } from './reduxActions';

import { createStore,combineReducers,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    loading : true,
    user : null,
    firstTimeUser : true,
    signup: false,
    role: 0,
    paidServiceList : [],
};

const basicReducer =(state = initialState, action) =>{
    switch (action.type) {
        case CHANGE_LOADING_STATE:
            return {
                ...state,
                loading:action.loadingState
            }
            break;
        case LOGIN:
            return {
                ...state,
                user : action.user,
            }
            break;
        case LOGOUT:
            return{
                ...state,
                user : null
            }
        case FIRST_TIME_DONE:
            return {
                ...state,
                firstTimeUser : action.value
            }
            break;
        case CHANGE_SIGNUP_STATE:
            return {
                ...state,
                signup: action.value
            }
            break;
        case GET_ROLE:
            return{
                ...state,
                role: action.value
            }
        
        default:
            break;
    }
    return state;
};

const reducer = combineReducers({
    basic : basicReducer,
})

const store = createStore(reducer,applyMiddleware(thunk));

export default store;