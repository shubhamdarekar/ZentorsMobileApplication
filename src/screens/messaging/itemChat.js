import React, { useState, useEffect } from 'react';
import * as firebase from "firebase";
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar,TouchableRipple} from 'react-native-paper';


const itemChat = (props) => {
    const [name,setName] = useState("")
    const [avatar,setAvatar] = useState("");
    const [gmail,setGmail] = useState("")
    const navigation = useNavigation();
    useEffect(()=>{
        firebase.firestore().collection('users').doc(props.item).get()
        .then(doc=>{
            setName(doc?doc.data().name:"Unknown");
            setAvatar(doc?doc.data().profile_picture:null);
            setGmail(doc?doc.data().gmail:"Unknown");
        })
    },[])
    return (
        
            <Card style={{ padding: 10 }} onPress={() => {
            // props.navigation.navigate('Chat', { itemId: props.item });
            navigation.navigate('Chat',{ itemId: props.item,name: name,image:avatar })
        }}>
                <Card.Title title={name?name:"Unknown"} subtitle={gmail?gmail:"Unknown"} left={(props) => {
                    return (
                        <Avatar.Image size={45} source={{ uri: avatar?avatar : null }} />
                    )
                }} />
            </Card>
    );
}

export default itemChat;