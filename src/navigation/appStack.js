import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import DrawerStack from './drawerStack';
import TabStack from './TabStack';





const Stack = createStackNavigator();





const AppStack = () => {
    return (
        <Stack.Navigator
        lazy={false}
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
                component={DrawerStack}
            />
        </Stack.Navigator>
    );
}

export default AppStack;