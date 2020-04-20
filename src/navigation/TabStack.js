import React, { useState, useEffect } from 'react';
import { Dimensions as dim, Text, View, Animated, StatusBar, Alert, ScrollView } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable'
import { useIsDrawerOpen } from '@react-navigation/drawer';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import messageStack from '../screens/messaging/messageStack';
import NotificationConfig from '../notificationConfig';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ListNewServices from '../screens/buyServices/listNewServices';





const Tabs = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();


const TabsStack = (props) => {
    const [fragmentVisibility, setFragmentVisibility] = useState(false);

    const [defHeight, setDefHeight] = useState(new Animated.Value(0))
    const [defWidth, setDefWidth] = useState(new Animated.Value(0))

    const [fabBottom, setFabBottom] = useState(new Animated.Value(70))
    const [fabRight, setFabRight] = useState(new Animated.Value(15))

    const drawer = useIsDrawerOpen();

    useEffect(() => {

        if (props.route.state) {
            if (props.route.state.index == 1 && !fragmentVisibility) {
                Animated.timing(fabBottom, {
                    toValue: 25,
                    duration: 150
                }).start()

                Animated.timing(fabRight, {
                    toValue: dim.get('window').width / 2 - 40,
                    duration: 150
                }).start()
            }
            else if (props.route.state.index == 0 && !fragmentVisibility) {
                Animated.timing(fabBottom, {
                    toValue: 70,
                    duration: 150
                }).start()
                Animated.timing(fabRight, {
                    toValue: 15,
                    duration: 150
                }).start()
            }

        }
    }, [props.route.state, fragmentVisibility])


    const increaseHeight = () => {
        Animated.timing(fabBottom, {
            toValue: dim.get('window').height - 30 - StatusBar.currentHeight - 25,
            duration: 300
        }).start()

        Animated.timing(fabRight, {
            toValue: dim.get('window').width - 55,
            duration: 300
        }).start()


        Animated.timing(defHeight, {
            toValue: dim.get('window').height - 30 - StatusBar.currentHeight,
            duration: 300
        }).start()
        Animated.timing(defWidth, {
            toValue: dim.get('window').width - 20,
            duration: 300
        }).start()
    }

    const decreaseHeight = () => {

        Animated.timing(fabBottom, {
            toValue: 70,
            duration: 500
        }).start()
        Animated.timing(fabRight, {
            toValue: 15,
            duration: 500
        }).start()

        Animated.timing(defHeight, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(defWidth, {
            toValue: 0,
            duration: 300
        }).start()
    }



    return (
        <React.Fragment>
            <Tabs.Navigator
                shifting={true}
                lazy
                // labeled ={false}
                activeColor={'#fff'}
                inactiveColor={'#cdcdcd'}
                barStyle={{
                    paddingRight: dim.get('window').width / 2 - 100,
                    paddingLeft: dim.get('window').width / 2 - 100,
                    backgroundColor: '#000',
                    height: 56
                }}
            >
                <Tabs.Screen
                    name='Appointments'
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="calendar" color={color} size={26} />
                        )
                    }}
                    component={NotificationConfig}
                />
                <Tabs.Screen
                    name='Messages'
                    options={{
                        tabBarBadge: true,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="wechat" color={color} size={26} />
                        )
                    }}
                    component={messageStack}
                />
            </Tabs.Navigator>
            <Animated.View
                style={{
                    elevation: 10,
                    position: 'absolute',
                    margin: 10,
                    bottom: 5,
                    right: 0,
                    height: defHeight,
                    width: defWidth,
                    backgroundColor: 'white',
                    borderRadius: 10
                }}
            >
                {fragmentVisibility && <NavigationContainer
                    independent={true}
                >
                    <Stack.Navigator
                        lazy
                        screenOptions={{
                            headerMode: 'none',
                            header: () => null,
                                                        ...TransitionPresets.SlideFromRightIOS,
                            gestureEnabled: true,
                            gestureDirection: 'horizontal',
                        }}
                    >
                        <Stack.Screen name="Service List">
                            {props => <ListNewServices {...props}
                                height={dim.get('window').height - 60 - StatusBar.currentHeight}
                                width={dim.get('window').width - 20}
                            />}
                        </Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>}
            </Animated.View>
            <Animatable.View
                animation='slideInUp'
                isInteraction={true}
                duration={500}
                style={{
                    position: 'absolute',
                    margin: 10,
                    right: fabRight,
                    bottom: fabBottom,
                    elevation: 50
                }}
            >
                <FAB

                    icon={fragmentVisibility ? "close" : "cart-plus"}
                    accessibilityLabel={'Shop Service'}
                    style={{
                        color: 'white'
                    }}
                    theme={{ colors: { accent: '#3d3f42' } }}
                    color={"white"}
                    onPress={() => {
                        if (!fragmentVisibility) {
                            setFragmentVisibility(true)
                            increaseHeight()
                        }
                        else {
                            Alert.alert(
                                'Do you want to really want to leave?',
                                'All the progress will be lost if you leave..',
                                [
                                    {
                                        text: 'Stay',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Leave', onPress: () => {
                                            setFragmentVisibility(false);
                                            decreaseHeight();
                                        }
                                    },
                                ],
                                { cancelable: false }
                            );

                        };
                    }}
                    small={fragmentVisibility}
                />
            </Animatable.View>
        </React.Fragment>

    )
}

export default TabsStack;