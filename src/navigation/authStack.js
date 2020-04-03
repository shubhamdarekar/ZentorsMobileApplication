import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import Login from '../screens/loginSignupPages/login';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'none',
                header: () => null,
                mode: 'card',
                ...TransitionPresets.SlideFromRightIOS,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
            }}
        >
            <Stack.Screen
                name="Enter Mobile"
                component={Login}
            />
        </Stack.Navigator>
    );
}

export default AuthStack;