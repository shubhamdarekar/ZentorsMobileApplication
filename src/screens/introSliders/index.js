import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { View, Text, ImageBackground, Image, Dimensions as dim } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


//asset imports
const backSlide1 = require('../../../assets/images/introSlider/backSlide1.png');
const backSlide2 = require('../../../assets/images/introSlider/backSlide2.png');
const backSlide3 = require('../../../assets/images/introSlider/backSlide3.png');

const icon = require('../../../assets/icon.png');
const icon2 = require('../../../assets/icon2.png');
const icon3 = require('../../../assets/icon3.png');




const renderer = (props) => {
    console.log(props);
    return (
        <ImageBackground source={props.item.background} style={{ height: props.dimensions.height, width: props.dimensions.width }}>
            {props.index == 0 ?
                <View style={{
                    height: props.dimensions.height - 75,
                    width: props.dimensions.width,
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    <View>
                        <Text style={{ width: 250, flexWrap: 'wrap', textAlign: 'center',fontSize: 30,textShadowColor:'#FFFFFF',textShadowRadius:10,fontWeight:'bold' }}>Welcome to</Text>
                        <Text style={{ 
                            width: 250, 
                            flexWrap: 'wrap', 
                            textAlign: 'center', 
                            fontFamily:'pacifico',
                            fontSize: 80,
                            textShadowColor:'#FFFFFF',
                            textShadowRadius:10,
                             
                            }}>
                                Zentors
                        </Text>
                    </View>
                    <Image source={props.item.icon}></Image>
                    <View>
                        <Text style={{ width: 250, flexWrap: 'wrap', textAlign: 'center',fontSize: 30,fontWeight:'bold' }}>Lets Get Started</Text>
                        <Text style={{ width: 250, flexWrap: 'wrap', textAlign: 'center',fontSize: 25,fontFamily:'karla' }}>Quick setup,</Text>
                        <Text style={{ width: 250, flexWrap: 'wrap', textAlign: 'center',fontSize: 25,fontFamily:'karla' }}>Good defaults.</Text>
                    </View>
                </View>
                :
                <View style={{
                    height: props.dimensions.height - 75,
                    width: props.dimensions.width,
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    <View>
                        <Text style={{ width: 300, flexWrap: 'wrap', textAlign: 'center',fontSize: 40,textShadowColor:'#FFFFFF',fontWeight:'bold',textShadowRadius:10,fontFamily:'karla', }}>
                            {props.item.title}
                        </Text>
                        <Text style={{ width: 300, flexWrap: 'wrap', textAlign: 'center',fontSize: 25,fontFamily:'karla' }}>
                            {props.item.subtitle}
                        </Text>
                    </View>
                    <Image source={props.item.icon} style={{height:250,width:250}}></Image>
                </View>
            }
        </ImageBackground>
    )
}

const slides = [
    {
        key: 'first',
        title: 'Quick setup, good defaults',
        icon: icon,
        background: backSlide1,
    },
    {
        key: 'second',
        title: 'Free Audio Call',
        subtitle: 'Hear tips & tricks directly from students enrolled at your dream school.',
        icon:icon2,
        background: backSlide2,
    },
    {
        key: 'third',
        title: 'Paid Counselling',
        subtitle: 'Resume review, SOP advice and more hands on advice.',
        icon:icon3,
        background: backSlide3,
    },
]

const nextButton = (props) => {
    return (
        <View style={{
            padding: 10,
            paddingLeft: 25,
            paddingRight: 25,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            shadowColor: "#FFF",
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,

            elevation: 24,
        }}>
            <Ionicons
                style={{ backgroundColor: 'transparent' }}
                name='md-arrow-round-forward'
                size={30}
                color="black"
            />
        </View>
    )
}

const doneButton = (props) => {
    return (
        <View style={{
            width: dim.get('window').width - 35,
            padding: 15,
            backgroundColor: '#7EF192',
            borderRadius: 20,
            shadowColor: "#FFF",
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,

            elevation: 24,
            alignItems: 'center',
        }}>
            <Text> Lets Get Started </Text>
        </View>
    )
}

const index = () => {
    return (
        <AppIntroSlider
            dotStyle={{
                width: 8,
                height: 12,
                backgroundColor: 'rgba(255, 255, 0, .9)',
                transform: [
                    { rotate: '45deg' }
                ]
            }}
            activeDotStyle={{
                width: 0,
                height: 0,
                borderTopWidth: 10,
                borderTopColor: '#e8af46',
                borderLeftColor: '#e8af46',
                borderLeftWidth: 10,
                borderRightColor: 'transparent',
                borderRightWidth: 10,
                borderBottomColor: '#e8af46',
                borderBottomWidth: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
            }}

            renderDoneButton={doneButton}
            renderNextButton={nextButton}
            showSkipButton
            slides={slides}
            renderItem={renderer}
        />
    );
}

export default index;