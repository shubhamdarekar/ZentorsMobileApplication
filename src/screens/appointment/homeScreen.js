// import React, { useEffect } from 'react';

// import { View, Text, Button, Platform } from 'react-native';
// import * as Calendar from 'expo-calendar';

// const HomeScreen = (props) => {

//     useEffect(() => {
//         // Calendar.deleteCalendarAsync('25')
//         (async () => {
//             const { status } = await Calendar.requestCalendarPermissionsAsync();
//             if (status === 'granted') {
//                 const calendars = await Calendar.getCalendarsAsync();
//                 console.log('Here are all your calendars:');
//             }

//         })();


//     })

//     console.log({
//         calendarsIds: ( Calendar.getCalendarsAsync()).map(x => x.id),
//     });

//     return (
//         <View
//             style={{
//                 flex: 1,
//                 backgroundColor: '#fff',
//                 alignItems: 'center',
//                 justifyContent: 'space-around',
//             }}>
//             <Text>Calendar Module Example</Text>
//             <Button title="Create a new calendar" onPress={createCalendar} />
//         </View>
//     );
// }

// export default HomeScreen;


// async function getDefaultCalendarSource() {
//     const calendars = await Calendar.getCalendarsAsync();
//     const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
//     return defaultCalendars[0].source;
// }

// async function createCalendar() {
//     const defaultCalendarSource =
//         Platform.OS === 'ios'
//             ? await getDefaultCalendarSource()
//             : {
//                 "isLocalAccount": false,
//                 "name": "2017.shubham.darekar@ves.ac.in",
//                 "type": "com.google"
//             };
//     const newCalendarID = await Calendar.createCalendarAsync({
//         title: 'Zentors',
//         color: 'black',
//         allowedAvailabilities: [Calendar.Availability.FREE, Calendar.Availability.BUSY],
//         entityType: Calendar.EntityTypes.EVENT,
//         sourceId: defaultCalendarSource.id,
//         source: defaultCalendarSource,
//         name: 'internalCalendarName',
//         ownerAccount: 'Shubham',
//         accessLevel: Calendar.CalendarAccessLevel.OWNER,
//         isSynced: 'true'
//     });
//     console.log(`Your new calendar ID is: ${newCalendarID}`);
// }








import * as React from 'react';
import { Text, View, StyleSheet, Alert, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import * as firebase from 'firebase'

const getAppointementDate = date =>
    moment(date, "YYYY-MM-DD'T'HH:mm:ss.sssZ").toDate();

export default class App extends React.Component {
    createEvent = async () => {
        const hasCalendarPermission = await Permissions.askAsync(
            Permissions.CALENDAR
        );


        if (hasCalendarPermission.status === 'granted') {
            const startDate = getAppointementDate('2019-06-05T18:00:00+02:00');
            const endDate = getAppointementDate('2019-06-05T18:00:00+02:00');

            
            console.log('tessst');

            // const calendarId = await Calendar.createCalendarAsync({
            //     title: 'test',
            //     color: '#00AAEE',
            //     source: {
            //         isLocalAccount: true,
            //         name: 'shubham.darekar5@gmail.com',
            //         type: 'com.google',
            //     },
            //     name: 'Phone Owner',
            //     ownerAccount: 'shubham.darekar5@gmail.com',
            //     accessLevel: 'owner',
            // });

            // console.log({ calendarId });



            console.log({
                calendarsIds: (await Calendar.getCalendarsAsync()).filter(x => x.id=="3"),
            });

            try {
                const res = await Calendar.createEventAsync("3", {
                    endDate: '2020-04-24T17:00:00.000Z',
                    startDate: '2020-04-24T12:00:00.000Z',
                    title: 'Test your code before releasing',
                });
                console.log(res);
                Alert.alert('Created event #' + res);
                Calendar.openEventInCalendar(res)
            } catch (e) {
                console.log({ e });
            }
        }
    };

    render() {
        console.log(firebase.auth().currentUser)

        return (
            <View style={styles.container}>
                <Button title="Create Event" onPress={this.createEvent} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    }
});
