import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const FIRST_TIME_DONE = 'FIRST_TIME_DONE';
export const CHANGE_LOADING_STATE = 'CHANGE_LOADING_STATE';
export const CHANGE_SIGNUP_STATE = 'CHANGE_SIGNUP_STATE';
export const GET_ROLE = 'GET_ROLE';


export const loading = (loadingState) => (
    {
        type: CHANGE_LOADING_STATE,
        loadingState: loadingState
    }
)

export const loginUpdate = (user) => (
    {
        type: LOGIN,
        user: user,
    }
);

export const logout = () => (
    {
        type: LOGOUT
    }
)

export const firstTimeDoneUpdate = () => (
    {
        type: FIRST_TIME_DONE,
        value: false
    }
)

export const signupState = (bool) => (
    {
        type: CHANGE_SIGNUP_STATE,
        value: bool
    }
)

export const setRole = ( role )=>(
    {
        type: GET_ROLE,
        value: role
    }
)

export const setUser = (user) => dispatch => {
    dispatch(loading(true));
    AsyncStorage.setItem('user', JSON.stringify(user)).then(() => {
        firebase.database().ref("user/" + user.uid + '/signup').once('value').then((snapshot) => {
            console.log('Set called')
            dispatch(signupState(snapshot.val()))
            dispatch(loginUpdate(user))
            dispatch(loading(false));
        }).catch(error => {
            console.log(error)
        })
    })
        .catch((err) => {
            dispatch(loading(false));
            console.log(err);
        })
}

export const getUser = () => dispatch => {
    // console.log('3');
    console.log('get called')
    dispatch(loading(true));
    AsyncStorage.getItem('user').then((user) => {
        if (user) {
            firebase.database().ref("/users/" + JSON.parse(user).uid).once('value').then((snapshot) => {
                dispatch(signupState(snapshot.val().signup))
                dispatch(setRole(snapshot.val().role || 0))
                dispatch(loginUpdate(JSON.parse(user)));
                dispatch(loading(false));
            })
        }
        else{
            dispatch(loading(false));
        }

    })
        .catch((err) => {
            dispatch(loading(false));
            console.log(err);
        })
}

export const removeUser = () => dispatch => {
    firebase.auth().signOut();
    AsyncStorage.removeItem('user').then(() => {
        dispatch(loading(false));
        dispatch(logout());
    })
        .catch((err) => {
            dispatch(loading(false));
            console.log(err);
        })
}

export const getFirstTimeDone = () => dispatch => {
    AsyncStorage.getItem('FIRST_TIME_USER').then((bool) => {
        if (bool == 'false') {
            dispatch(firstTimeDoneUpdate());
        }
        // dispatch(loading(false));
    })
        .catch((err) => {
            dispatch(loading(false));
            console.log(err);
        })
}

export const setFirstTimeDone = () => dispatch => {
    AsyncStorage.setItem('FIRST_TIME_USER', 'false').then(() => {
        dispatch(firstTimeDoneUpdate());
        dispatch(loading(false));
    })
        .catch((err) => {
            dispatch(loading(false));
            console.log(err);
        })
}