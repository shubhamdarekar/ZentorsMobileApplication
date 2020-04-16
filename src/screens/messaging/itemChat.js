import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import * as firebase from "firebase";

const itemChat = (props) => {
    const [name,setName] = useState("")
    useEffect(()=>{
        const ref = firebase.database().ref("/users/"+props.item+"/name")
        ref.once('value').then(snapshot => setName(snapshot.val()));
        return() =>{
            ref.off();
        }
    },[])
    return (
        <Button title={name} onPress={() => {
            props.navigation.navigate('Chat', { itemId: props.item });
        }} />
    );
}

export default itemChat;