import React, { useState, useEffect } from 'react';
import { TouchableOpacity ,Text} from 'react-native';
import * as firebase from "firebase";
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const itemChat = (props) => {
    const [name,setName] = useState("")
    const [avatar,setAvatar] = useState("");
    const navigation = useNavigation();
    useEffect(()=>{
        firebase.firestore().collection('users').doc(props.item).get()
        .then(doc=>{
            setName(doc?doc.data().name:"Unknown");
            setAvatar(doc?doc.data().profile_picture:null);
        })
    },[])
    return (
        <TouchableOpacity  onPress={() => {
            // props.navigation.navigate('Chat', { itemId: props.item });
            navigation.navigate('Chat',{ itemId: props.item,name: name,image:avatar })
        }}>
            <Text>{name?name:"Unknown"}</Text>
        </TouchableOpacity>
    );
}

export default itemChat;