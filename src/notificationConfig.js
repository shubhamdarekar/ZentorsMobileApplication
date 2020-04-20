

import React from 'react';
import { Text, View, Button, Vibration, Platform } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class AppContainer extends React.Component {
    state = {
        expoPushToken: '',
        notification: {},
    };

    localNotif = {
        title: "Hii",
        body: "How are you",
        android: {
            categoryId: "myCategoryName2",
            channelId: "default"
        }
    }

    registerForPushNotificationsAsync = async () => {
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
            console.log(token);
            this.setState({ expoPushToken: token });
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('default', {
                name: 'Default',
                sound: true,
                priority: 'max',
                vibrate: [500, 250, 250, 500],
            });
        }
    };

    componentDidMount() {
        Notifications.createCategoryAsync('myCategoryName2', [
            {
                actionId: 'requiredAuthenticationButton',
                buttonTitle: 'Click to Authenticate',
            }])
        this.registerForPushNotificationsAsync();
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = notification => {
        Vibration.vibrate();
        console.log(notification);
        this.setState({ notification: notification });
    };

    sendPushNotification = async () => {
        const message = {
            to: this.state.expoPushToken,
            sound: 'default',
            title: 'Hii There',
            body: 'Kiggifhdh',
            data: { data: 'Me' },
            _displayInForeground: true,
        };
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Origin: {this.state.notification.origin}</Text>
                    <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
                </View>
                <Button title={'Press to Send Notification'} onPress={() => Notifications.presentLocalNotificationAsync(this.localNotif).then(id => console.log(id))} />
            </View>
        );
    }
}