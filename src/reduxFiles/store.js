import React from 'react';


import { createStore } from 'redux';

const initialState = {

};

const reducer =(state = initialState, action) =>{
    switch (action.type) {
        default:
            break;
    }
    return state;
};

const store = createStore(reducer);

export default store;