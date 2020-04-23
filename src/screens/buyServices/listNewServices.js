import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, Dimensions, SafeAreaView, ImageBackground, StatusBar, Keyboard } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore'
import { PanGestureHandler, State, ScrollView } from 'react-native-gesture-handler';
import { Searchbar, ActivityIndicator, Card, Avatar, Button } from 'react-native-paper';


const RenderItem = (props) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        firebase.firestore().collection('users').doc(props.uid)
        .get().then(doc =>{
            setUser(doc.data())
        })
    }, [])
    return (
        <TouchableWithoutFeedback onPress={() => {
            props.navigation.navigate('Mentors description', { mentorId: props.uid });
        }}>
            <Card elevation={2} style={{ padding: 25 }}>
                <Card.Cover source={{ uri: user ? user.profile_picture : null }} />
                <Card.Title title={user ? user.name : null} subtitle="Card Subtitle" left={(props) => {
                    return (
                        <Avatar.Image size={50} source={{ uri: user ? user.profile_picture : null }} />
                    )
                }} />
            </Card>
        </TouchableWithoutFeedback>
    )
}


export default class App extends React.Component {

    constructor() {
        super()
        this.state = {
            activeImage: null,
            itemList: [],
            searchQuery: '',
            OriginalList: [],
            focus: false,
            mentorList: []
        }
        this.allImages = {}
        this.oldPosition = { x: 0, y: 0 }
        this.position = new Animated.ValueXY(0, 0)
        this.dimensions = new Animated.ValueXY(0, 0)
        this.animation = new Animated.Value(0)
        this.searchBarWidth = new Animated.Value(50)

        this.activeImageStyle = null

        this.finalPosition = { x: 0, y: 0 }
        this.finalDimension = { x: 0, y: 0 }
        this._translateY = new Animated.Value(0);
        this._searchbarRef = React.createRef();
    }

    _onGestureEvent = (event) => {

        this._translateY.setValue(event.nativeEvent.translationY)
        if (event.nativeEvent.translationY < 190 && event.nativeEvent.translationY > 0 && this.state.activeImage) {


            this.position.setValue({
                x: (event.nativeEvent.translationY) * (this.oldPosition.x - 10) / 190,
                y: (event.nativeEvent.translationY) * (this.oldPosition.y - 40) / 190
            })

            this.dimensions.setValue({
                x: event.nativeEvent.translationY * (200) / 190 + this.finalDimension.x,
                y: event.nativeEvent.translationY * (500) / 190 + this.finalDimension.y,
            })

            this.animation.setValue(1 - (event.nativeEvent.translationY / 190))
        }


    }

    componentDidMount() {
        firebase.firestore().collection('ServiceList')
        .onSnapshot(querySnapshot=>{
        var services = [];
        querySnapshot.forEach(function(doc) {
            services.push(doc.data());
        });
        this.setState({itemList:services});
        })
        
    }

    componentWillUnmount() {
        StatusBar.setHidden(false)
    }

    _onChangeSearch = (query) => {
        this.setState({ searchQuery: query });
        this.setState({ itemList: this.state.OriginalList.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())) })
    }



    openImage = (index) => {

        this.allImages[index].measure((x, y, width, height, pageX, pageY) => {
            this.oldPosition.x = pageX
            this.oldPosition.y = pageY
            this.oldPosition.width = width
            this.oldPosition.height = height

            this.position.setValue({
                x: pageX - 10,
                y: pageY - 40
            })

            this.dimensions.setValue({
                x: width,
                y: height
            })

            this.setState({
                activeImage: this.state.itemList[index]
            }, () => {
                this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {

                    Animated.parallel([
                        Animated.timing(this.position.x, {
                            toValue: dPageX - 10,
                            duration: 300
                        }),
                        Animated.timing(this.position.y, {
                            toValue: dPageY - 40,
                            duration: 300
                        }),
                        Animated.timing(this.dimensions.x, {
                            toValue: dWidth,
                            duration: 300
                        }),
                        Animated.timing(this.dimensions.y, {
                            toValue: dHeight,
                            duration: 300
                        }),
                        Animated.timing(this.animation, {
                            toValue: 1,
                            duration: 300
                        })
                    ]).start()
                    this.finalPosition.x = dPageX - 10
                    this.finalPosition.y = dPageY - 40
                    this.finalDimension.x = dWidth;
                    this.finalDimension.y = dHeight;
                })
            })
        })
    }
    closeImage = () => {
        Animated.parallel([
            Animated.timing(this.position.x, {
                toValue: this.oldPosition.x - 10,
                duration: 300
            }),
            Animated.timing(this.position.y, {
                toValue: this.oldPosition.y - 40,
                duration: 250
            }),
            Animated.timing(this.dimensions.x, {
                toValue: this.oldPosition.width,
                duration: 250
            }),
            Animated.timing(this.dimensions.y, {
                toValue: this.oldPosition.height,
                duration: 250
            }),
            Animated.timing(this.animation, {
                toValue: 0,
                duration: 250
            })
        ]).start(() => {
            this.setState({
                activeImage: null
            })
        })
    }


    _onHandlerStateChange = event => {

        if (event.nativeEvent.oldState === State.ACTIVE) {

            if (event.nativeEvent.translationY > 50) {
                this.closeImage()
            }
            else {
                this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {

                    Animated.parallel([
                        Animated.timing(this.position.x, {
                            toValue: dPageX - 10,
                            duration: 100
                        }),
                        Animated.timing(this.position.y, {
                            toValue: dPageY - 40,
                            duration: 100
                        }),
                        Animated.timing(this.dimensions.x, {
                            toValue: dWidth,
                            duration: 100
                        }),
                        Animated.timing(this.dimensions.y, {
                            toValue: dHeight,
                            duration: 100
                        }),
                        Animated.timing(this.animation, {
                            toValue: 1,
                            duration: 100
                        })
                    ]).start()

                })
            }
        }
    };

    _searchButtonPressed = () => {
        if (this.searchBarWidth._value == 50) {
            this.setState({ focus: true })
            StatusBar.setHidden(true)
            this._searchbarRef.current.focus()
            Animated.timing(this.searchBarWidth, {
                toValue: this.props.width - 30,
                duration: 300
            }).start()
        }
        else {
            Keyboard.dismiss()
            this.setState({ focus: false })
            this._searchbarRef.current.blur()
            Animated.timing(this.searchBarWidth, {
                toValue: 50,
                duration: 300
            }).start()
            StatusBar.setHidden(false)
        }
    }






    render() {

        const activeImageStyle = {
            width: this.dimensions.x,
            height: this.dimensions.y,
            left: this.position.x,
            top: this.position.y
        }

        const animatedContentY = this.animation.interpolate({
            inputRange: [0, 0.6, 0.7, 0.8, 0.9, 1],
            outputRange: [500, 400, 300, 200, 100, 0]
        })

        const animatedContentOpacity = this.animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 1]
        })

        const reverse = this.animation.interpolate({
            inputRange: [0, 0.1, 0.3, 0.8, 1],
            outputRange: [1, 0.3, 0.2, 0.1, 0]
        })

        const animatedContentStyle = {
            opacity: animatedContentOpacity,
            transform: [{
                translateY: animatedContentY
            }]
        }

        const animatedCrossOpacity = {
            opacity: this.animation
        }

        const animatedReverseOpacity = {
            opacity: reverse
        }

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 0.2, backgroundColor: '#cbcbcb', flexDirection: 'row', justifyContent: 'flex-end', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', width: 250, flexWrap: 'wrap', }}>List of Services to buy</Text>
                    <Searchbar
                        ref={this._searchbarRef}
                        style={{
                            position: 'absolute',
                            width: this.searchBarWidth,
                            height: 50,
                            right: 15,
                            backgroundColor: !this.state.focus ? '#cbcbcb' : '#ffffff',
                            elevation: !this.state.focus ? 0 : 10,
                        }}
                        onIconPress={this._searchButtonPressed}
                        placeholder="Search for a service"
                        onChangeText={this._onChangeSearch}
                        value={this.state.searchQuery}
                    />
                </View>
                <ScrollView style={{ flex: 1 }}>
                    {this.state.itemList.length == 0 &&
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flex: 1 }}>
                            <ActivityIndicator size={100} animating={true} />
                            <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', width: 250, flexWrap: 'wrap', }}>No results found</Text>
                        </View>
                    }
                    {this.state.itemList.map((image, index) => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => this.openImage(index)}
                                key={image.id}>
                                <Animated.View
                                    style={[{ height: this.props.height - 150, width: this.props.width, padding: 15 }, animatedReverseOpacity]}
                                >
                                    <Image
                                        ref={(image) => (this.allImages[index] = image)}
                                        source={{ uri: image.src }}
                                        style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                                    />
                                    <View style={{ position: 'absolute', height: this.props.height - 150, width: this.props.width, padding: 15, justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <View style={{ width: 280 }}>
                                            <Text style={{ fontSize: 50, fontWeight: 'bold', textAlign: 'right', margin: 25, flexWrap: 'wrap', borderColor: 'white' }}>{image.name}</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </ScrollView>
                <PanGestureHandler
                    onGestureEvent={this._onGestureEvent}
                    onHandlerStateChange={this._onHandlerStateChange}
                >
                    <View style={StyleSheet.absoluteFill}
                        pointerEvents={this.state.activeImage ? "auto" : "none"}
                    >
                        <View style={{ flex: 1, zIndex: 1001 }} ref={(view) => (this.viewImage = view)}>
                            <Animated.Image
                                source={{ uri: this.state.activeImage ? this.state.activeImage.src : null }}
                                style={[{ resizeMode: 'cover', top: 0, left: 0, height: null, width: null }, activeImageStyle]}
                            >
                            </Animated.Image>
                            <TouchableWithoutFeedback onPress={() => this.closeImage()}>
                                <Animated.View style={[{ position: 'absolute', top: 30, right: 30 }, animatedCrossOpacity]}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>x</Text>
                                </Animated.View>
                            </TouchableWithoutFeedback>
                        </View>
                        <Animated.View style={[{ flex: 2, zIndex: 1000, backgroundColor: 'white', padding: 20, paddingTop: 50 }, animatedContentStyle]}>
                            <Text style={{ fontSize: 35, paddingBottom: 10 }}>{this.state.activeImage ? this.state.activeImage.name : ""}</Text>
                            <Text style={{ fontSize: 15, paddingBottom: 10 }}>List Of Mentors Available:</Text>
                            <ScrollView >
                                {this.state.activeImage && this.state.activeImage.MentorsList && Object.entries(this.state.activeImage.MentorsList).map((item, index) => {
                                    return (
                                        <RenderItem key={item[0]} uid={item[1]} {...this.props} />
                                    )
                                })}
                            </ScrollView>
                            <Button raised icon="basket" onPress={()=>{
                                this.props.navigation.navigate('Purchase',{item:this.state.activeImage.id})
                            }} style={{backgroundColor:'red'}} mode="contained" >
                                Buy This Service for $
    </Button>
                        </Animated.View>
                    </View>
                </PanGestureHandler>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});