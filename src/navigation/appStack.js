import React, { useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import DrawerStack from './drawerStack';
import { connect } from 'react-redux';
import Details from '../screens/loginSignupPages/details';


import { Notifications } from 'expo';
import Chat from '../screens/messaging/chat';
import { Avatar, Appbar } from 'react-native-paper';


import { TouchableOpacity } from 'react-native';





const Stack = createStackNavigator();

const Header = ({ scene, previous, navigation }) => {
    const { options } = scene.descriptor;
    const title =
        options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
                ? options.title
                : scene.route.name;

    return (
        <Appbar.Header style={{backgroundColor:'#000000'}}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.pop();
                        }}
                    >
                        <Avatar.Image
                            size={40}
                            source={{
                                uri:
                                    options.image,
                            }}
                        />
                    </TouchableOpacity>
            <Appbar.Content
                title={
                    title
                }
            />
        </Appbar.Header>
    );
};






const AppStack = (props) => {
    const createChannelCategories = async () => {
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('Messages', {
                name: 'Messages',
                sound: true,
                priority: 'max',
                vibrate: [0, 250],
                badge: true
            });
        }

        Notifications.createCategoryAsync('Messages', [
            {
                actionId: 'textResponseButton',
                buttonTitle: 'Reply',
                textInput: { submitButtonTitle: 'Send', placeholder: 'Message..' },
                isDestructive: false,
                isAuthenticationRequired: false,
            },
            {
                actionId: 'highlightedButton',
                buttonTitle: 'Cancel',
                isDestructive: true,
                isAuthenticationRequired: false,
            },
        ])
    }


    useEffect(() => {
        createChannelCategories();
    }, [])


    return (
        <Stack.Navigator
            lazy={false}
            screenOptions={{
                headerMode: 'none',
                headerShown: false,
                mode: 'card',
                ...TransitionPresets.SlideFromRightIOS,
                gestureDirection: 'horizontal',
                gestureEnabled: true,
                gestureResponseDistance: { horizontal: 500 },
                gestureVelocityImpact: 0.5
            }}
            initialRouteName={props.signup ? "Details" : "Drawer APP"}
        >
            <Stack.Screen
                name="Details"
                component={Details}
            />
            <Stack.Screen
                name="Drawer APP"
                component={DrawerStack}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={({ route }) => ({
                    title: route.params.name,
                    image:  route.params.image,
                    headerShown: true,
                    headerTitleAlign: 'center',
                    header: ({ scene, previous, navigation }) => (
                        <Header scene={scene} previous={previous} navigation={navigation} />
                    ),
                })}
            />
        </Stack.Navigator>
    );
}

const mapStateToProps = (state) => {
    return {
        signup: state.basic.signup,
        role: state.basic.role,
    }
}


export default connect(mapStateToProps)(AppStack);