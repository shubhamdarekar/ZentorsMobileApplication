import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import DrawerStack from './drawerStack';
import { connect } from 'react-redux';
import Details from '../screens/loginSignupPages/details';





const Stack = createStackNavigator();





const AppStack = (props) => {
    return (
        <Stack.Navigator
        lazy={false}
            screenOptions={{
                headerMode: 'none',
                header: () => null,
                mode: 'card',
                ...TransitionPresets.SlideFromRightIOS,
                gestureDirection: 'horizontal',
            }}
            initialRouteName={props.signup?"Details":"Drawer APP"}
        >
        <Stack.Screen
                name="Details"
                component={Details}
            />
            <Stack.Screen
                name="Drawer APP"
                component={DrawerStack}
            />
        </Stack.Navigator>
    );
}

const mapStateToProps = (state) => {
    return {
        signup : state.basic.signup,
        role : state.basic.role,
    }
}


export default connect(mapStateToProps)(AppStack);