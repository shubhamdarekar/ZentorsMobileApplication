import React from 'react';

import { Text ,View} from 'react-native';

const purchase = (props) => {
    return (
        <View style={{flex:1}}>
        <Text >{props.route.params.item}</Text>
        </View>
    );
}

export default purchase;