import React from 'react';


import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import TabsStack from './TabStack';
import Details from '../screens/loginSignupPages/details';


const DrawerN = createDrawerNavigator()


const DrawerStack = () => {
    return (
        <DrawerN.Navigator
            lazy={true}
            edgeWidth={500}
            minSwipeDistance={100}
            drawerType = {'back'}
            drawerStyle={{
                backgroundColor: '#cbcbcb',
                width: 300,
            }}
            drawerContent={(props) => <DrawerContent {...props}
                drawerContentOptions={{
                    activeTintColor: '#d0d055',
                }}
            />
            }
        >
            <DrawerN.Screen name='Home' component={TabsStack} />
            <DrawerN.Screen name='Settings' component={Details} />
        </DrawerN.Navigator>
    )
}

export default DrawerStack;