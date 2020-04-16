import React, { useState, useEffect } from 'react';

import { GiftedChat } from 'react-native-gifted-chat';

import * as firebase from 'firebase';

const Chat = (props) => {
    const [messages, setMessages] = useState([]);
    const [firstTime,setFirstTime] = useState(true);

    const { itemId } = props.route.params;

    const chatId = (firebase.auth().currentUser < itemId) ? firebase.auth().currentUser.uid + '' + itemId : itemId + '' + firebase.auth().currentUser.uid;

    const ref = firebase.database().ref('/messages/' + chatId);

    const off = () => {
        ref.off();
    }

    const on = (callback) => {
        ref
            .on('child_added', snapshot => callback(parse(snapshot)))
            ;
    }

    const parse = (snapshot) => {
        const { timestamp: numberStamp, text, sender: user } = snapshot.val();
        const { key: _id } = snapshot;

        const timestamp = new Date(numberStamp);

        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message
    }

    const send = (messages) => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            // 4.
            const message = {
                text,
                sender: user,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
            };
            if(firstTime){
                firebase.database().ref("/users/"+firebase.auth().currentUser.uid+"/recentMessages").push(itemId);
                firebase.database().ref("/users/"+itemId+"/recentMessages").push(firebase.auth().currentUser.uid);
                setFirstTime(false);
            }
            append(message);
        }
    }

    const user = () => {
        return {
            name: firebase.auth().currentUser.displayName,
            _id: firebase.auth().currentUser.uid,
            avatar: firebase.auth().currentUser.photoURL
        }
    }

    useEffect(() => {
        on((newMessage) => {
            setMessages(mes => GiftedChat.append(mes, newMessage));
        })
        return () => {
            off();
        }
    }, [])

    const append = (message) => {
        ref.push(message)
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={send}
            user={user()}
        />
    );

};
export default Chat;