import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export  const IconLogin = () =>{
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity style={styles.icon}>
                <Image source={require("../assets/Facebook.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
                <Image source={require("../assets/Gmail.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
                <Image source={require("../assets/Mark.png")} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 40,
        height: 40,
        backgroundColor: '#FFEFE8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
})

export default IconLogin