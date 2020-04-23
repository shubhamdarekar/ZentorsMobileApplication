

import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    Animated
} from 'react-native';

import * as firebase from 'firebase';
import 'firebase/firestore'

HEADER_MAX_HEIGHT = 200;
HEADER_MIN_HEIGHT = 50;
PROFILE_IMAGE_MAX_HEIGHT = 200;
PROFILE_IMAGE_MIN_HEIGHT = 100;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),
            mentorDetails: null,
        };
    }



    componentDidMount() {

        firebase.firestore().collection('users').doc(this.props.route.params.mentorId)
        .get().then(doc=>{
            this.setState({ mentorDetails: doc.data() })
        })
    }



    componentWillUnmount() {
    }




    render() {
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        });
        const profileImageHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
            extrapolate: 'clamp'
        });

        const opacityText = this.state.scrollY.interpolate({
            inputRange: [
                0,
                HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
                HEADER_MAX_HEIGHT -
                HEADER_MIN_HEIGHT +
                5 +
                PROFILE_IMAGE_MIN_HEIGHT +
                26
            ],
            outputRange: [0, 0, 0, 1],
            extrapolate: 'clamp'
        });

        const profileImageMarginTop = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [
                HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_HEIGHT / 2,
                HEADER_MAX_HEIGHT + 5
            ],
            extrapolate: 'clamp'
        });
        const headerZindex = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 200],
            outputRange: [0, 0, 1000],
            extrapolate: 'clamp'
        });

        const headerTitleBottom = this.state.scrollY.interpolate({
            inputRange: [
                0,
                HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
                HEADER_MAX_HEIGHT -
                HEADER_MIN_HEIGHT +
                5 +
                PROFILE_IMAGE_MIN_HEIGHT +
                26
            ],
            outputRange: [-30, -30, -30, 0],
            extrapolate: 'clamp'
        });


        return (
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#cbcbcb',
                        height: headerHeight,
                        zIndex: headerZindex,
                        elevation: headerZindex, //required for android
                        alignItems: 'center'
                    }}
                >
                    <Animated.View
                        style={{ position: 'absolute', bottom: headerTitleBottom,opacity:opacityText }}
                    >
                        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}>
                        {this.state.mentorDetails?this.state.mentorDetails.name:''}
            </Text>
                    </Animated.View>
                </Animated.View>

                <ScrollView
                    style={{ flex: 1 }}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([
                        { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
                    ])}
                    contentContainerStyle={{
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Animated.View
                        style={{
                            height: profileImageHeight,
                            width: profileImageHeight,
                            borderRadius: PROFILE_IMAGE_MAX_HEIGHT / 2,
                            borderColor: 'white',
                            borderWidth: 3,
                            overflow: 'hidden',
                            marginTop: profileImageMarginTop,
                            marginLeft: 10,
                            backgroundColor:'#cbcbcb'
                        }}
                    >
                        <Image
                            source={{uri:this.state.mentorDetails?this.state.mentorDetails.profile_picture:null}}
                            style={{ flex: 1, width: null, height: null }}
                        />
                    </Animated.View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 26, paddingLeft: 10 }}>
                            {this.state.mentorDetails?this.state.mentorDetails.name:''}
                        </Text>
                    </View>

                    <View style={{ height: 1000 }} />
                </ScrollView>
            </View>
        );
    }
}
export default App;