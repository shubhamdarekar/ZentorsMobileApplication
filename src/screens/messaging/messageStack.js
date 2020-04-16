import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Chat from './chat';
import AllMessages from './allMessages';



const Stack = createStackNavigator();

const messageStack = (props) => {
    return (
        <Stack.Navigator
        lazy={false}
            screenOptions={{
                headerMode: 'float',
                mode: 'card',
                ...TransitionPresets.RevealFromBottomAndroid,
                gestureDirection: 'vertical',
                gestureEnabled : true,
                gestureVelocityImpact:0.1
            }}
        >
        <Stack.Screen
                name="AllChats"
                title="Your Messages"
                component={AllMessages}
            />
            <Stack.Screen
                name="Chat"
                
                component={Chat}
            />
        </Stack.Navigator>
    );
}

export default messageStack;