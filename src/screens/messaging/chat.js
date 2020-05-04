import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

import * as firebase from 'firebase';
import 'firebase/firestore';

const Chat = (props) => {
    const [messages, setMessages] = useState([]);

    const { itemId } = props.route.params;

    // console.log((firebase.auth().currentUser.uid).localeCompare(itemId) > 0);

    const chatId = ((firebase.auth().currentUser.uid).localeCompare(itemId) > 0) ? firebase.auth().currentUser.uid + '' + itemId : itemId + '' + firebase.auth().currentUser.uid;

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
                read:false
            };

            firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
                .collection("recentMessages").doc("sort").update({
                    myArr: firebase.firestore.FieldValue.arrayRemove(itemId),
                }).then(() => {
                    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
                        .collection("recentMessages").doc("sort").update({
                            myArr: firebase.firestore.FieldValue.arrayUnion(itemId)
                        })
                }).catch((err) => {
                    console.log('err')
                })

            firebase.firestore().collection("users").doc(itemId)
                .collection("recentMessages").doc("sort").update({
                    myArr: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid),
                }).then(() => {
                    firebase.firestore().collection("users").doc(itemId)
                        .collection("recentMessages").doc("sort").update({
                            myArr: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
                        })
                }).catch((err) => {
                    console.log('err')
                })

            firebase.firestore().collection('messages').doc(chatId).collection('messages').doc(new Date().getTime().toString()).set(message)
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
        var unSub = null;
        firebase.firestore().collection('messages').doc(chatId).get().then(doc => {
            if (!doc.data()) {
                firebase.firestore().collection('messages').doc(chatId).set({
                    createdAt:new Date().toISOString(),
                    users:[itemId,firebase.auth().currentUser.uid]
                })
            }
        }).then(() => {
            unSub = firebase.firestore().collection('messages').doc(chatId).collection('messages')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(function (change) {
                        if (change.type === "added") {
                            if(change.doc.data().receiver == firebase.auth().currentUser.uid){
                                change.doc.ref.update({
                                    read:true
                                })
                            }
                            setMessages(mes => GiftedChat.append(mes, parse(change.doc.data())))
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
        
            <GiftedChat
                messages={messages}
                onSend={send}
                user={user()}
                keyboardShouldPersistTaps="handled"
            />
    );

};
export default Chat;