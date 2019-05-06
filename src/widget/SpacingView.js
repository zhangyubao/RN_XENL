
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import color from './Color'


class SpacingView extends PureComponent<{}> {
    render() {
        return (
            <View style={styles.container}>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        height: 14,
        backgroundColor: color.paper,
    },
})


export default SpacingView
