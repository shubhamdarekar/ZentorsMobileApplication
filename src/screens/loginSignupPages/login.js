import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';
import { connect } from 'react-redux';
import {setUser, loading} from '../../reduxFiles/reduxActions'

const Test = (props) => {
    return (
        <View style={styles.container}>
        <Button title="Login" onPress={()=>{
            props.setLoading(true);
            props.login();
        }}></Button>
            <Text>Open up App.js to start working on your app!</Text>
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
const mapDispatchToProps = (dispatch) =>{
    return{
        setLoading : (bool) => dispatch(loading(bool)),
        login:()=> dispatch(setUser({'username':'Shubham','email':'shubham.darekar5@gmail.com','photoUrl':'https://docs.expo.io/static/images/header-logo.png'})),
    }
}
export default connect(null,mapDispatchToProps)(Test);