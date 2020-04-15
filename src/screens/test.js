import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';
import { connect } from 'react-redux';
import {removeUser} from '../reduxFiles/reduxActions'
import * as firebase from 'firebase';

const Test = (props) => {
    console.log(firebase.auth().currentUser);
    return (
        <View style={styles.container}>
        <Button title="Logout" onPress={()=>{
            props.logout();
        }}></Button>
            <Text>Your role is {props.role == 0 ? 'mentee. Send Admin request to change it.' :'mentor.'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
const mapStatesToProps =(state)=>{
    return{
        role: state.basic.role,
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        logout:()=> dispatch(removeUser())
    }
}
export default connect(mapStatesToProps,mapDispatchToProps)(Test);