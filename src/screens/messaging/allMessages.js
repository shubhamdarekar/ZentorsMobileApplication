import React, { useState, useEffect } from 'react';
import { Button, View, FlatList, RefreshControl } from 'react-native';
import * as firebase from 'firebase';
import ItemChat from './itemChat';

const allMessages = (props) => {
    const [chatList, setChatList] = useState([]);

    function wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }


    const ref = firebase.database().ref('/users/' + firebase.auth().currentUser.uid + "/recentMessages");

    const on = (callback) => {
        ref
            .on('child_added', snapshot => callback(snapshot.key, snapshot.val()));
    }


    useEffect(() => {
        on((key, value) => {
            setChatList(mes => {
                var newArr = [value]

                var final = new Set(newArr.concat(mes))

                return [...final]
            });
        })
        return () => {
            ref.off();
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
                props.navigation.navigate('Chat', { itemId: 'eRCb1PTVz0O3ASR8jOoUW8F50m42' });
            }} />
        </View>
    );
}

export default allMessages;