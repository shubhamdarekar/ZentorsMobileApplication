import React from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import Test from '../screens/test';

const Stack = createStackNavigator();

const AppStack = () => {
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
                component={Test}
            />
        </Stack.Navigator>
    );
}

export default AppStack;