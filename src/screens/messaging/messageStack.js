import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AllMessages from './allMessages';



const Stack = createStackNavigator();

const messageStack = (props) => {
    return (
        <Stack.Navigator
            lazy={false}
            screenOptions={{
                headerMode: 'float',
                mode: 'card',
                ...TransitionPresets.SlideFromRightIOS,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                gestureResponseDistance: { horizontal: 500 },
                gestureVelocityImpact:0.5
            }}
        >
            <Stack.Screen
                name="AllChats"
                options={{
                headerTitle:"Your Messages",
                }}
                component={AllMessages}
            />
        </Stack.Navigator>
    );
}

export default messageStack;