import React, { useState, useEffect } from 'react';
import { Button, View, FlatList, RefreshControl } from 'react-native';
import * as firebase from 'firebase';
import ItemChat from './itemChat';

const allMessages = (props) => {
    const [chatList, setChatList] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    function wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, [refreshing]);


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
                props.navigation.navigate('Chat', { itemId: 'Fg5jNI7Ah0gVpKvWb2u5EmymJAE3' });
            }} />
        </View>
    );
}

export default allMessages;