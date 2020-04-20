import React, { useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import DrawerStack from './drawerStack';
import { connect } from 'react-redux';
import Details from '../screens/loginSignupPages/details';


import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import * as firebase from 'firebase';





const Stack = createStackNavigator();





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

    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = await Notifications.getExpoPushTokenAsync();
            // firebase.database().ref("/users/" + firebase.auth().currentUser.uid+"/expoTokens")
            //     .push({token:token,Device:Constants.deviceName});

            firebase.database().ref("/activeTokens/" + token.slice(18, -1)).update({
                active: "yes",
                expire: Date.now() + 5184000000
            })
        } else {
            alert('Must use physical device for Push Notifications');
        }
    }

    const ref = firebase.database().ref("/messages/");

    const on = (callback) => {
        ref
            .on('child_changed', snapshot => callback(parse(snapshot)))
            ;
    }

    const parse = (snapshot) => {
        console.log(snapshot)
        const { timestamp: numberStamp, text, sender: user } = snapshot.val();
        const { key: _id } = snapshot;

        const timestamp = new Date(numberStamp);

        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message
    }
    

    const listener = (notification)=>{
        console.log(notification);
    }


    useEffect(() => {
        registerForPushNotificationsAsync();
        createChannelCategories();
        var i =0
        on((newMessage) => {
            i+=1
            console.log("Recieved",(i));
        })

        const list = Notifications.addListener(listener);

        return ()=>{
            list.remove();
        }
    }, [])


    return (
        <Stack.Navigator
            lazy={false}
            screenOptions={{
                headerMode: 'none',
                header: () => null,
                mode: 'card',
                ...TransitionPresets.SlideFromRightIOS,
                gestureDirection: 'horizontal',
                gestureEnabled: false
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