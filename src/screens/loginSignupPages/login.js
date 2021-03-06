import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { setUser, loading,signupState } from '../../reduxFiles/reduxActions';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {
    FirebaseRecaptchaVerifier,
    FirebaseRecaptcha
} from 'expo-firebase-recaptcha';
import * as Google from 'expo-google-app-auth';



const Test = (props) => {
    const [verification, setVerification] = useState('');
    const [custom, setCustom] = useState('');
    const [code, setCode] = useState('');
    const [number, setNumber] = useState('');
    const [visible, setVisible] = useState(false);

    const firestoreDB = firebase.firestore();

    const isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.user.id) {
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
                firebase.auth().signInWithCredential(credential)
                    .then((result) => {
                        props.setLoading(true);
                        if (result.additionalUserInfo.isNewUser) {
                            firestoreDB.collection('users').doc(result.user.id).set({
                                gmail: result.user.email,
                                profile_picture: result.additionalUserInfo.profile.picture,
                                locale: result.additionalUserInfo.profile.locale,
                                first_name: result.additionalUserInfo.profile.given_name,
                                family_name: result.additionalUserInfo.profile.family_name,
                                signup: true,
                                role: 0,
                                created_at: Date.now()
                            })
                                .then(function (snapshot) {
                                    props.setSignup();
                                    props.login(firebase.auth().currentUser);
                                })
                                .catch(function (error) {
                                    props.setLoading(false);
                                    console.log(error);
                                })

                            firestoreDB.collection('users').doc(result.user.uid)
                                .collection('recentMessages').doc("sort").set({
                                    myArr: []
                                })
                        }
                        else {
                            firestoreDB.collection('users').doc(result.user.uid)
                                .update({
                                    last_logged_in: Date.now()
                                })
                                .then(function () {
                                    props.login(firebase.auth().currentUser);
                                })
                                .catch(function (error) {
                                    props.setLoading(false);
                                    console.log(error);
                                })
                        }
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
                ToastAndroid.show('User already signed-in Firebase.', ToastAndroid.LONG);
                props.setLoading(true);
                console.log('User already signed-in Firebase.');
                props.login(firebase.auth().currentUser);
            }
        });
    }

    const signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: '907414218364-j9loh2sb7buvllmrnfkq2gjc58s4nos2.apps.googleusercontent.com',
                iosClientId: '907414218364-d677aq24p4un9s6m6u9rs9sav7nk9494.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });
            console.log(result);
            if (result.type === 'success') {
                console.log(result)
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
        const phoneNumber = number;

        const verifi = custom;
        if (!verifi) return ToastAndroid.show('Captcha Pending', ToastAndroid.LONG);
        const applicationVerifier = new FirebaseRecaptchaVerifier(verifi);
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
            phoneNumber,
            applicationVerifier,
        );
        setVerification(verificationId);
        setVisible(true);
        console.log(verificationId);
    };

    const onPressConfirmVerificationCode = async () => {
        const verificationId = verification;
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        const result = await firebase.auth().signInWithCredential(credential);
        console.log(result);
        props.setLoading(true);
        if (result.additionalUserInfo.isNewUser) {
            firestoreDB.collection('users').doc(result.user.uid)
                .set({
                    phone: result.user.phoneNumber,
                    gmail: result.user.email,
                    profile_picture: result.user.photoURL,
                    signup: true,
                    role: 0,
                    created_at: Date.now()
                }
                )
                .then(function (snapshot) {
                    props.setSignup();
                })
            firestoreDB.collection('users').doc(result.user.uid)
                .collection('recentMessages').doc("sort").set({
                    myArr: []
                })
            props.login(firebase.auth().currentUser);
        }
        else {

            firestoreDB.collection('users').doc(result.user.uid)
                .update({
                    last_logged_in: Date.now()
                }).then(() => {
                    props.login(firebase.auth().currentUser);
                })
                .catch(err => {
                    console.log(err)
                })
        }

    };

    return (
        <View style={styles.container}>
            <TextInput
                keyboardType='phone-pad'
                autoCompleteType='tel'
                placeholder='Number with code'
                style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                value={number}
                onChangeText={value => setNumber(value)}
            />
            <View style={{ height: 100, width: 320, }}>
                <FirebaseRecaptcha
                    style={{ height: 300, width: 350 }}
                    firebaseConfig={firebase.app().options}
                    onVerify={(value) => setCustom(value)}
                /></View>
            <Button title="Submit" onPress={() => {
                onPressSendVerificationCode();
                // props.setLoading(true);
                // props.login();
            }}></Button>

            {visible ? <View>
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
                /></View> : <></>}
            <Button title="SignIn With Google" onPress={() => {
                props.setLoading(true);
                signInWithGoogleAsync()
            }}></Button>
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
const mapDispatchToProps = (dispatch) => {
    return {
        setLoading: (bool) => dispatch(loading(bool)),
        login: (user) => dispatch(setUser(user)),
        setSignup: () => dispatch(signupState(true)),
    }
}
export default connect(null, mapDispatchToProps)(Test);