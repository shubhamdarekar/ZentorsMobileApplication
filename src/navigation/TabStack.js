import React, { useState, useEffect } from 'react';
import { Dimensions as dim, Animated, StatusBar, Alert, BackHandler } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable'

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import MessageStack from '../screens/messaging/messageStack';
import HomeScreen from '../screens/appointment/homeScreen'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ListNewServices from '../screens/buyServices/listNewServices';
import MentorDescription from '../screens/buyServices/mentorDescription';
import Purchase from '../screens/buyServices/purchase';





const Tabs = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();


const TabsStack = (props) => {
    const [fragmentVisibility, setFragmentVisibility] = useState(false);

    const [defHeight, setDefHeight] = useState(new Animated.Value(0))
    const [defWidth, setDefWidth] = useState(new Animated.Value(0))

    const [fabBottom, setFabBottom] = useState(new Animated.Value(70))
    const [fabRight, setFabRight] = useState(new Animated.Value(15))


    useEffect(() => {

        if (props.route.state) {
            if (props.route.state.index == 1 && !fragmentVisibility) {
                Animated.parallel([
                    Animated.timing(fabBottom, {
                        toValue: 25,
                        duration: 150
                    }),
                    Animated.timing(fabRight, {
                        toValue: dim.get('window').width / 2 - 40,
                        duration: 150
                    })
                ]).start()



            }
            else if (props.route.state.index == 0 && !fragmentVisibility) {

                Animated.parallel([
                    Animated.timing(fabBottom, {
                        toValue: 70,
                        duration: 150
                    }),
                    Animated.timing(fabRight, {
                        toValue: 15,
                        duration: 150
                    })
                ]).start()

            }

        }
    }, [props.route.state, fragmentVisibility])


    const increaseHeight = () => {


        Animated.parallel([
            Animated.timing(fabBottom, {
                toValue: dim.get('window').height - 30 - StatusBar.currentHeight - 25,
                duration: 300
            }),

            Animated.timing(fabRight, {
                toValue: dim.get('window').width - 55,
                duration: 300
            }),


            Animated.timing(defHeight, {
                toValue: dim.get('window').height - 30 - StatusBar.currentHeight,
                duration: 300
            }),

            Animated.timing(defWidth, {
                toValue: dim.get('window').width - 20,
                duration: 300
            })
        ]).start()

    }

    const BackHandlerCustom = () => {
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
        return true;
    }

    const decreaseHeight = () => {

        BackHandler.removeEventListener('hardwareBackPress', BackHandlerCustom);

        Animated.parallel([
            Animated.timing(fabBottom, {
                toValue: 70,
                duration: 500
            }),
            Animated.timing(fabRight, {
                toValue: 15,
                duration: 500
            })
        ]).start()

        Animated.parallel([

            Animated.timing(defHeight, {
                toValue: 0,
                duration: 300
            }),
            Animated.timing(defWidth, {
                toValue: 0,
                duration: 300
            })
        ]).start();

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
                    component={HomeScreen}
                />
                <Tabs.Screen
                    name='Messages'
                    options={{
                        tabBarBadge: true,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="wechat" color={color} size={26} />
                        )
                    }}
                    component={MessageStack}
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
                            gestureResponseDistance: { horizontal: 500 }
                        }}
                    >
                        <Stack.Screen name="Service List">
                            {props => <ListNewServices {...props}
                                height={dim.get('window').height - 60 - StatusBar.currentHeight}
                                width={dim.get('window').width - 20}
                            />}
                        </Stack.Screen>
                        <Stack.Screen name="Mentors description"
                        >
                            {props => <MentorDescription {...props}
                                height={dim.get('window').height - 60 - StatusBar.currentHeight}
                                width={dim.get('window').width - 20}
                            />}
                            </Stack.Screen>

                            <Stack.Screen name="Purchase"
                            >
                                {props => <Purchase {...props}
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
                                    BackHandler.addEventListener('hardwareBackPress', BackHandlerCustom);
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
                                                    BackHandler.removeEventListener('hardwareBackPress', BackHandlerCustom);
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