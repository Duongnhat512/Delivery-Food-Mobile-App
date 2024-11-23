import { Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router';

const FoodDetails = () => {
    const router = useRouter();
    const { item } = useLocalSearchParams();
    const parsedItem = JSON.parse(item);

    useEffect(() => {
        console.log(parsedItem.name)
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#F5CB58" }}>
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Image
                        source={require('../../assets/next-icon.png')}
                        style={{ transform: [{ rotate: '180deg' }, { scale: 1.5 }], }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>{parsedItem.name}</Text>
                <View></View>
            </View>
            <View style={styles.bodyContent}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5CB58',
        justifyContent: 'space-around',
        width: '100%',
        paddingBottom: "10%",
        paddingTop: "10%",
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'LeagueSpartan-Bold',
        height: 40,
    },
    bodyContent: {
        flex: 4,
        backgroundColor: '#fff',
        width: '100%',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        padding: 30,
    },
})

export default FoodDetails;