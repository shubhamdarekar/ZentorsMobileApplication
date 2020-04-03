import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    TouchableRipple,
    Switch,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { connect } from 'react-redux';
import { removeUser, loading } from '../reduxFiles/reduxActions';



const DrawerContent = (props) => {
    // debugger;
    const translateX = Animated.interpolate(props.progress, {
        inputRange: [0,0.2, 0.5, 0.7, 0.8, 1],
        outputRange: [100, 35, -45, -120, -125, -0],
});

    return (
        <DrawerContentScrollView {...props}>
            <Animated.View
                style={
                    styles.drawerContent, { transform: [{ translateX }] }
                }
            >
            <Drawer.Section style={styles.drawerSection}>
                <View style={styles.userInfoSection}>

                    <Avatar.Image
                        source={{
                            uri:
                                props.user.photoUrl,
                        }}
                        size={60}
                    />
                    <Title style={styles.title}>{props.user.username}</Title>
                    <Caption style={styles.caption}>{props.user.email}</Caption>
                    <View style={styles.row}>
                        <View style={styles.section}>
                            <Paragraph style={[styles.paragraph, styles.caption]}>
                                Your Credits:
                            </Paragraph>
                            <Caption style={styles.caption}>x</Caption>
                        </View>
                    </View>
                </View>
                </Drawer.Section>
                <Drawer.Section title="Your Paid services">
                {()=>{
                    for(var i = 0;i<5;i++){
                        <Text>Hii</Text>
                    }
                }}

                </Drawer.Section>
                {/* <Drawer.Section style={styles.drawerSection}>
                    <DrawerItemList {...props} />
                </Drawer.Section> */}
                <Drawer.Section title="Preferences">
                    <TouchableRipple onPress={() => { }}>
                        <View style={styles.preference}>
                            <Text>Dark Theme</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => {
                        props.setLoading(true);
                        props.logout();
                        props.navigation.closeDrawer();
                    }}>
                        <View style={styles.preference}>
                            <Text>Not {props.user.username}? Logout</Text>
                        </View>
                    </TouchableRipple>
                </Drawer.Section>
            </Animated.View>
        </DrawerContentScrollView>
    );
}
const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        marginTop: 20,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
const mapStatesToProps = (state) => {
    return {
        user: state.basic.user,
        paidServiceList: state.basic.paidServiceList,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => (dispatch(removeUser())),
        setLoading: (bool) => (dispatch(loading(bool)))
    }
}

export default connect(mapStatesToProps, mapDispatchToProps)(DrawerContent);