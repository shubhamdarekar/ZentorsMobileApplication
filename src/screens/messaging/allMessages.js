import React, { useState, useEffect } from 'react';
import { Button, View, FlatList, RefreshControl } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ItemChat from './itemChat';

const allMessages = (props) => {
    const [chatList, setChatList] = useState([]);



    useEffect(() => {
        var unsubscribe = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection("recentMessages")
        .doc('sort')
        .onSnapshot((snapshot)=>{
            setChatList(snapshot.data().myArr.reverse())
        })

        return () => {
            unsubscribe();
            setChatList([]);
        }
    }, [])

    const renderItem = ( {item} ) => {
        return (
            <ItemChat item = {item} {...props}/>
        )

    }


    return (
        <View>
            <FlatList
                data={chatList}
                renderItem={renderItem}
                keyExtractor={item => item}
            />
            <Button title='HII' onPress={() => {
                props.navigation.navigate('Chat', { itemId: 'gQZRzULyGAPkL5dlHD1eL3MauKo1' });
            }} />
        </View>
    );
}

export default allMessages;