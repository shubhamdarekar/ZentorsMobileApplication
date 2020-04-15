import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
import {
    FirebaseRecaptchaVerifier,
    FirebaseRecaptcha
} from 'expo-firebase-recaptcha';
import { Avatar, TouchableRipple } from 'react-native-paper'
import 'firebase/auth';
import { setUser, loading } from '../../reduxFiles/reduxActions';
import * as Google from 'expo-google-app-auth';

import * as ImagePicker from 'expo-image-picker';

const Details = (props) => {
    const [mobile, setMobile] = useState(firebase.auth().currentUser.phoneNumber);
    const [mobileVerified, setMobileVerified] = useState(firebase.auth().currentUser.phoneNumber);
    const [email, setEmail] = useState(firebase.auth().currentUser.email);
    const [emailVerified, setEmailVerified] = useState(firebase.auth().currentUser.emailVerified);
    const [name, setName] = useState(firebase.auth().currentUser.displayName);
    const [profilePicture, setProfilePicture] = useState(firebase.auth().currentUser.profilePicture);


    const [verification, setVerification] = useState('');
    const [custom, setCustom] = useState('');
    const [code, setCode] = useState('');
    const [visible, setVisible] = useState(false);



    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if(!pickerResult.cancelled){
            props.setLoading(true)
            uploadImage(pickerResult.uri)
            .then((url)=>{
                setProfilePicture(url);
                props.setLoading(false);
            })
            .catch((error)=>{
                console.log(error);
                props.setLoading(false);
            })
        }
    }

    const uploadImage = async(uri) =>{
        const response = await fetch(uri);
        
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("profilePics/" + firebase.auth().currentUser.uid);

        await ref.put(blob)
        return ref.getDownloadURL()
        
    }




    const updateDetails = () => {
        firebase.auth().currentUser.updateProfile({
            displayName: name,
            photoURL: profilePicture,
            signup: false,
        }).then(() => {
            setMobile(firebase.auth().currentUser.phoneNumber);
            setMobileVerified(firebase.auth().currentUser.phoneNumber)
            setEmail(firebase.auth().currentUser.email);
            setEmailVerified(firebase.auth().currentUser.emailVerified);

            var result = firebase.auth().currentUser;

            firebase
                .database()
                .ref('/users/' + firebase.auth().currentUser.uid)
                .update({
                    phone: result.phoneNumber,
                    gmail: result.email,
                    profile_picture: result.photoURL,
                    name: result.displayName,
                })
            props.setUser(firebase.auth().currentUser);
            props.setLoading(false);
        })
            .catch(() => {
                props.setLoading(false);
            })

    }

    const isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.user.id) {
                    props.setLoading(false);
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    const onSignIn = (googleUser) => {
        // console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        // console.log(props)
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken
                );
                // Sign in with credential from the Google user.
                firebase.auth().currentUser.linkWithCredential(credential)
                    .then((result) => {
                        // firebase.auth().currentUser.reload()
                        console.log(firebase.auth().currentUser.providerData[0].photoURL)
                        setName(firebase.auth().currentUser.providerData[0].displayName);
                        setProfilePicture(firebase.auth().currentUser.providerData[0].photoURL);
                        updateDetails();
                        props.setLoading(false);
                    })
                    .catch(function (error) {
                        props.setLoading(false);
                        console.log(error)
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        // ...
                    });
            } else {
                props.setLoading(false);
                ToastAndroid.show('User already signed-in Firebase.', ToastAndroid.LONG);
                console.log('User already signed-in Firebase.');
            }
        });
    }





    const _emailVerify = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: '258755030225-bj9r4a89oh5tom9alr8h74eca8rk0arj.apps.googleusercontent.com',
                // iosClientId: '258755030225-bj9r4a89oh5tom9alr8h74eca8rk0arj.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });
            console.log(result);
            if (result.type === 'success') {
                onSignIn(result);
                return result.accessToken;
            } else {
                props.setLoading(false);
                ToastAndroid.show('Something went wrong \n Please Try again..', ToastAndroid.LONG);
                return { cancelled: true };
            }
        } catch (e) {
            props.setLoading(false);
            return { error: true };
        }
    }

    const onPressSendVerificationCode = async () => {
        const phoneNumber = mobile;

        const verifi = custom;
        if (!verifi) return ToastAndroid.show('Captcha', ToastAndroid.LONG);
        const applicationVerifier = new FirebaseRecaptchaVerifier(verifi);
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
            phoneNumber,
            applicationVerifier,
        );
        setVerification(verificationId);
        console.log(verificationId);
        setVisible(true);
    };

    const onPressConfirmVerificationCode = async () => {
        const verificationId = verification;
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        const result = await firebase.auth().currentUser.linkWithCredential(credential);
        updateDetails();
        console.log(result);
    };


    console.log(firebase.auth().currentUser)
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                openImagePickerAsync();
            }}>
                <Avatar.Image
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,

                        elevation: 12,
                    }}
                    source={{
                        uri: profilePicture,
                    }}
                    size={100}
                />
            </TouchableOpacity>
            {profilePicture && <Button title = 'Remove Picture' onPress={()=>{
                setProfilePicture(null);
            }} />
            }
            <Text>Welcome New User Enter Details</Text>
            <TextInput
                editable={!mobileVerified}
                keyboardType='phone-pad'
                autoCompleteType='tel'
                placeholder='Number with code'
                style={[{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }, mobileVerified ? { color: 'gray' } : { color: 'black' }]}
                value={mobile}
                onChangeText={value => setMobile(value)}
            />
            {!mobileVerified ?
                <>
                    <View style={{ height: 100, width: 320, }}>
                        <FirebaseRecaptcha
                            style={{ height: 300, width: 350 }}
                            firebaseConfig={firebase.app().options}
                            onVerify={(value) => { setCustom(value) }}
                        />
                    </View>
                    <Button title="Send OTP" onPress={() => {
                        onPressSendVerificationCode();
                    }}></Button>
                    {visible && <View>
                        <TextInput
                            placeholder='OTP'
                            style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                            value={code}
                            onChangeText={value => setCode(value)}
                        />
                        <Button title="done"
                            onPress={() => {
                                onPressConfirmVerificationCode();
                            }}
                        /></View>}
                </> : <></>}
            <TextInput
                editable={false}
                autoCompleteType='email'
                placeholder='Email Id'
                style={[{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }, emailVerified ? { color: 'gray' } : { color: 'black' }]}
                value={email}
                onChangeText={value => setEmail(value)}
            />
            {
                !emailVerified ?
                    <Button title="Add Google mail"
                        onPress={() => {
                            props.setLoading(true);
                            _emailVerify();
                        }}
                    />
                    :
                    <></>
            }

            <TextInput
                autoCompleteType='name'
                placeholder='Full Name'
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, margin: 10 }}
                value={name}
                onChangeText={value => setName(value)}
            />
            {((name != '') && mobileVerified && emailVerified) && <Button title="Press this Update Button to see changes in profile" onPress={() => {
                props.setLoading(true);
                props.setUser(firebase.auth().currentUser);
                updateDetails();
                firebase
                .database()
                .ref('/users/' + firebase.auth().currentUser.uid)
                .update({
                    signup:false,
                });
                props.navigation.navigate('Drawer APP')
            }}></Button>}
            {mobileVerified && emailVerified && <Button title="Skip" onPress={() => {
                props.setUser(firebase.auth().currentUser);
                props.navigation.navigate('Drawer APP')
            }}></Button>}
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

const mapStateToProps = (state) => {
    return {
        user: state.basic.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLoading: (bool) => (dispatch(loading(bool))),
        setUser: (user) => (dispatch(setUser(user)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);