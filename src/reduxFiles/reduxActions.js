import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const FIRST_TIME_DONE = 'FIRST_TIME_DONE';
export const CHANGE_LOADING_STATE = 'CHANGE_LOADING_STATE';


export const loading = (loadingState) =>(
    {
        type: CHANGE_LOADING_STATE,
        loadingState:loadingState
    }
)

export const loginUpdate = (user) =>(
    {
        type:LOGIN,
        user:user
    }
);

export const logout = () =>(
    {
        type:LOGOUT
    }
)

export const firstTimeDoneUpdate = () =>(
    {
        type:FIRST_TIME_DONE,
        value: false
    }
)

export const setUser = (user) => dispatch =>{
    AsyncStorage.setItem('user', JSON.stringify(user)).then(()=>{
        dispatch(loading(false));
        dispatch(loginUpdate(user));
    })
    .catch((err) =>{
        dispatch(loading(false));
        console.log(err);
    })
}

export const getUser = () => dispatch =>{
    // console.log('3');
    AsyncStorage.getItem('user').then((user)=>{
        dispatch(loading(false));
        dispatch(loginUpdate(JSON.parse(user)));
    })
    .catch((err) =>{
        dispatch(loading(false));
        console.log(err);
    })
}

export const removeUser = () => dispatch =>{
    firebase.auth().signOut();
    AsyncStorage.removeItem('user').then(()=>{
        dispatch(loading(false));
        dispatch(logout());
    })
    .catch((err)=>{
        dispatch(loading(false));
        console.log(err);
    })
}

export const getFirstTimeDone = () => dispatch =>{
    AsyncStorage.getItem('FIRST_TIME_USER').then((bool)=>{
        if(bool == 'false'){
            dispatch(firstTimeDoneUpdate());
        }
        dispatch(loading(false));
    })
    .catch((err) =>{
        dispatch(loading(false));
        console.log(err);
    })
}

export const setFirstTimeDone = () => dispatch =>{
    AsyncStorage.setItem('FIRST_TIME_USER','false').then(()=>{
        dispatch(firstTimeDoneUpdate());
        dispatch(loading(false));
    })
    .catch((err) =>{
        dispatch(loading(false));
        console.log(err);
    })
}

