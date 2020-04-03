import React from 'react';


import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import TabsStack from './TabStack';


const DrawerN = createDrawerNavigator()


const DrawerStack = () => {
    return (
        <DrawerN.Navigator
            lazy={false}
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
            <DrawerN.Screen name='Test' component={TabsStack} />
        </DrawerN.Navigator>
    )
}

export default DrawerStack;