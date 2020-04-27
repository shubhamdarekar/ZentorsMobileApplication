import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

import * as firebase from 'firebase';
import 'firebase/firestore';

const Chat = (props) => {
    const [messages, setMessages] = useState([]);

    const { itemId } ='gQZRzULyGAPkL5dlHD1eL3MauKo1';

    // console.log(("gQZRzULyGAPkL5dlHD1eL3MauKo1").localeCompare(itemId) > 0);

    const chatId = (("gQZRzULyGAPkL5dlHD1eL3MauKo1").localeCompare(itemId) > 0) ? "gQZRzULyGAPkL5dlHD1eL3MauKo1" + '' + itemId : itemId + '' + "gQZRzULyGAPkL5dlHD1eL3MauKo1";

    // const ref = firebase.database().ref('/messages/' + chatId);





    const parse = (snapshot) => {
        const { createdAt: numberStamp, text, sender: user ,_id} = snapshot;

        const createdAt = Date.parse(numberStamp);

        const message = {
            _id,
            createdAt,
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
                _id: Date.now(),
                text,
                sender: user,
                receiver: itemId,
                createdAt: new Date().toISOString(),
            };

            firebase.firestore().collection("users").doc("gQZRzULyGAPkL5dlHD1eL3MauKo1")
                .collection("recentMessages").doc("sort").update({
                    myArr: firebase.firestore.FieldValue.arrayRemove(itemId),
                }).then(() => {
                    firebase.firestore().collection("users").doc("gQZRzULyGAPkL5dlHD1eL3MauKo1")
                        .collection("recentMessages").doc("sort").update({
                            myArr: firebase.firestore.FieldValue.arrayUnion(itemId)
                        })
                }).catch((err) => {
                    console.log('err')
                })

            firebase.firestore().collection("users").doc(itemId)
                .collection("recentMessages").doc("sort").update({
                    myArr: firebase.firestore.FieldValue.arrayRemove("gQZRzULyGAPkL5dlHD1eL3MauKo1"),
                }).then(() => {
                    firebase.firestore().collection("users").doc(itemId)
                        .collection("recentMessages").doc("sort").update({
                            myArr: firebase.firestore.FieldValue.arrayUnion("gQZRzULyGAPkL5dlHD1eL3MauKo1")
                        })
                }).catch((err) => {
                    console.log('err')
                })

            firebase.firestore().collection('messages').doc(chatId).collection('messages').doc(new Date().getTime().toString()).set(message)
        }
    }

    const user = () => {
        return {
            name: "shubham",
            _id: "gQZRzULyGAPkL5dlHD1eL3MauKo1",
            avatar: "Hii"
        }
    }

    useEffect(() => {
        var unSub = null;
        firebase.firestore().collection('messages').doc(chatId).get().then(doc => {
            if (!doc.data()) {
                firebase.firestore().collection('messages').doc(chatId).set({
                    createdAt:new Date().toISOString()
                })
            }
        }).then(() => {
            unSub = firebase.firestore().collection('messages').doc(chatId).collection('messages')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(function (change) {
                        if (change.type === "added") {
                            
                            setMessages(mes => GiftedChat.append(mes, parse(change.doc.data()),true))
                        }
                    }
                    )
                })
        })


        return () => {
            try{
                unSub();
            }catch{
            }
        }
    }, [])


    return (
        <View style={{ flex: 1 }}>
        
            <GiftedChat
                messages={messages}
                
                user={user()}
                renderUsernameOnMessage
                scrollToBottom
                textInputProps={{blurOnSubmit:false}}
                keyboardShouldPersistTaps={'never'}
            />
        </View>
    );

};
export default Chat;