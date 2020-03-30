import React, { useEffect } from 'react';
import { View } from "react-native";
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';


import AnimatedLoader from 'react-native-animated-loader';


import { setUser, getUser, removeUser, getFirstTimeDone, setFirstTimeDone, loading } from '../reduxFiles/reduxActions';
import  Test  from '../screens/test'
import IntroSlider from '../screens/introSliders/index'

const RootNavigation = (props) => {
    console.log(props);
    // props.retrieve();
    const _setLoading = props.setLoading;
    const _retrieve = props.retrieve;

    useEffect(() => {
        _setLoading(true);
        _retrieve();
    }, []);

    return (
        <View style ={{flex: 1,padding: 0,}}>
        <AnimatedLoader 
        visible={props.loading}
        overlayColor="rgba(255,255,255,1)"
        animationStyle={{width: 100,height: 100,}}
        speed={1}
        source={require("../../assets/animations/loadingAnimation.json")}
        />
        <NavigationContainer>
            {props.user? <Test/>:( props.firstTimeUser ? <IntroSlider/> : <Test/>)}
        </NavigationContainer>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        loading: state.basic.loading,
        user: state.basic.user,
        firstTimeUser: state.basic.firstTimeUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user) => dispatch(setUser(user)),
        retrieve: () => (dispatch(getUser()),dispatch(getFirstTimeDone())),
        logout: () => (dispatch(removeUser())),
        setLoading: (bool) =>(dispatch(loading(bool)))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RootNavigation);