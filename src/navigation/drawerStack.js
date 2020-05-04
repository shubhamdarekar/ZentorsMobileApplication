import React, { useEffect } from 'react';


import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import TabsStack from './TabStack';
import Details from '../screens/loginSignupPages/details';
import {useNavigation} from '@react-navigation/native';


import { Notifications } from 'expo';
import * as firebase from 'firebase';


const DrawerN = createDrawerNavigator()




const DrawerStack = () => {

    useEffect(()=>{
        
        firebase.firestore().collection('messages').where('users', 'array-contains',firebase.auth().currentUser.uid).get().then(snap=>{
            snap.forEach((doc)=>{
                sub = doc.ref.collection('messages').where('receiver','==',firebase.auth().currentUser.uid).onSnapshot(snap=>{
                    snap.docChanges().forEach(change=>{
                        if (change.type === "added" && !change.doc.data().read) {
                            
                            Notifications.presentLocalNotificationAsync( {
                                title: change.doc.data().sender.name,
                                body: change.doc.data().text,
                                android: {
                                    categoryId: "Messages",
                                    channelId: "Messages"
                                },
                                data:change.doc.data()
                            })
                        }
                    })
                })
            })
        })
        return () => {
        }
    },[])


    return (
        <DrawerN.Navigator
            lazy={true}
            edgeWidth={500}
            minSwipeDistance={100}
            drawerType = {'back'}
            drawerStyle={{
                backgroundColor: '#cbcbcb',
                width: 280,
            }}
            drawerContent={(props) => <DrawerContent {...props}
                drawerContentOptions={{
                    activeTintColor: '#d0d055',
                }}
            />
            }
        >
            <DrawerN.Screen name='Home' component={TabsStack}/>
            <DrawerN.Screen name='Settings' component={Details} />            
        </DrawerN.Navigator>
    )
}

export default DrawerStack;