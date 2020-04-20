import React, { useEffect } from 'react';
import { View } from "react-native";
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';


import { getUser, getFirstTimeDone, loading } from '../reduxFiles/reduxActions';
import IntroSlider from '../screens/introSliders/index'
import AuthStack from './authStack';
import AppStack from './appStack';


const RootNavigation = (props) => {
    // props.retrieve();
    const _setLoading = props.setLoading;
    const _retrieve = props.retrieve;

    useEffect(() => {
        _setLoading(true);
        _retrieve();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <AnimatedLoader
                visible={props.loading}
                overlayColor="rgba(255,255,255,1)"
                animationStyle={{ width: 100, height: 100, }}
                speed={1}
                source={require("../../assets/animations/loadingAnimation.json")}
            />
            <NavigationContainer>
                {props.user ? <AppStack /> : (props.firstTimeUser ? <IntroSlider /> : <AuthStack />)}
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
        retrieve: () => (dispatch(getUser()), dispatch(getFirstTimeDone())),
        setLoading: (bool) => (dispatch(loading(bool)))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RootNavigation);