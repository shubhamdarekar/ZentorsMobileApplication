import React, { useState, useEffect } from 'react';
import { TouchableOpacity ,Text} from 'react-native';
import * as firebase from "firebase";
import 'firebase/firestore'

const itemChat = (props) => {
    const [name,setName] = useState("")
    const [avatar,setAvatar] = useState("");
    useEffect(()=>{
        firebase.firestore().collection('users').doc(props.item).get()
        .then(doc=>{
            setName(doc.data().name);
            setAvatar(doc.data().profile_picture);
        })
    },[])
    return (
        <TouchableOpacity  onPress={() => {
            props.navigation.navigate('Chat', { itemId: props.item });
        }}>
            <Text>{name}</Text>
        </TouchableOpacity>
    );
}

export default itemChat;