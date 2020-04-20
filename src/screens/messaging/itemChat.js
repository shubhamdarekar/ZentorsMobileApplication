import React, { useState, useEffect } from 'react';
import { TouchableOpacity ,Text} from 'react-native';
import * as firebase from "firebase";

const itemChat = (props) => {
    const [name,setName] = useState("")
    const [avatar,setAvatar] = useState("");
    useEffect(()=>{
        const ref = firebase.database().ref("/users/"+props.item)
        ref.once('value').then(snapshot =>{ 
            setName(snapshot.val().name);
            setAvatar(snapshot.val().profile_picture);
        });
        return() =>{
            ref.off();
        }
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