import React from 'react';
import { Dimensions as dim} from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Test from '../screens/test';
import messageStack from '../screens/messaging/messageStack';



const Tabs = createMaterialBottomTabNavigator();


const TabsStack = () => {
    return (
        <React.Fragment>
            <Tabs.Navigator
                shifting={true}
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
                    component={Test}
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
        </React.Fragment>
    )
}

export default TabsStack;