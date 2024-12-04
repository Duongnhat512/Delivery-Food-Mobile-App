import { Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { Alert } from 'react-native';
const FoodDetails = () => {
    const {user} = useContext(UserContext);
    const link = process.env.REACT_APP_BACKEND_URL;
    
    
    const token = user ? user.accessToken : null;
    const router = useRouter();
    const { item } = useLocalSearchParams();
    const parsedItem = JSON.parse(item);
    const initialPrice = parseFloat(parsedItem.price) * 1000;
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(parsedItem.price);

  
 

const handleAddToCart = async () => {
    const cartItem = {
        item_id: parsedItem.id,
        quantity: quantity,
    };

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/users/add_Cart`, // API endpoint thêm vào giỏ hàng
            cartItem,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Token xác thực
                },
            }
        );

        if (response.status === 200) {
            Alert.alert(
                'Thông báo', 
                'Đã thêm sản phẩm vào giỏ hàng!',
                [{ text: 'OK' }]  // Nút "OK" để đóng thông báo
            );
        } else {
            console.error('Unexpected response:', response);
            Alert.alert(
                'Thông báo',
                'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.',
                [{ text: 'OK' }]
            );
        }
    } catch (error) {
        console.error('Error adding to cart:', error.response || error.message);
        Alert.alert(
            'Thông báo',
            'Không thể thêm sản phẩm vào giỏ hàng.',
            [{ text: 'OK' }]
        );
    }
};

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleIncreaseQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(quantity + 1);
        setTotalPrice(initialPrice * newQuantity);
    }

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            setTotalPrice(initialPrice * newQuantity);
        }
    }

    useEffect(() => {
        setTotalPrice(initialPrice * quantity);
    }, [quantity]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5CB58" }}>
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
                <View style={{ gap: 30 }}>
                    <Image
                        source={{ uri: parsedItem.image }}
                        style={{ width: '100%', height: 250, borderRadius: 20 }}
                        resizeMode="cover"
                    />
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#FFD8C7", paddingBottom: 20 }}>
                            <Text style={{ fontSize: 25, fontFamily: "LeagueSpartan-Bold", color: "#E95322" }}>{formatPrice(totalPrice)}</Text>
                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                <TouchableOpacity
                                    style={{ width: 30, height: 30, borderRadius: 40, backgroundColor: quantity == 1 ? "#FFEFE8" : "#E95322", alignItems: "center" }}
                                    onPress={handleDecreaseQuantity}
                                >
                                    <Text style={{ fontSize: 20, color: "#fff" }}>-</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 20, fontFamily: "LeagueSpartan-Regular" }}>{quantity}</Text>
                                <TouchableOpacity
                                    style={{ width: 30, height: 30, borderRadius: 40, backgroundColor: "#E95322", alignItems: "center" }}
                                    onPress={handleIncreaseQuantity}
                                >
                                    <Text style={{ fontSize: 20, color: "#fff" }}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {parsedItem.description ? (<>
                            <Text style={{ fontSize: 20, color: "#000", fontFamily: "LeagueSpartan-SemiBold", paddingTop: 20 }}>Mô tả</Text>
                            <Text style={{ fontSize: 16, color: "#000", fontFamily: "LeagueSpartan-Regular" }}>{parsedItem.description}</Text>
                        </>) : (
                            <>
                            </>
                        )}

                    </View>
                </View>
                <View style={{ width: "100%", alignItems: "center" }}>
                    <TouchableOpacity onPress={(handleAddToCart)}
                        style={{ backgroundColor: "#E95322", padding: 5, borderRadius: 20, alignItems: "center", flexDirection: "row", paddingHorizontal: 20, gap: 10 }}
                    >
                        <Image
                            source={require('../../assets/order-white.png')}
                        />
                        <Text style={{ fontSize: 14, color: "#fff" }}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5CB58',
        width: '100%',
        padding: "10%",
        gap: 20
    },
    title: {
        fontSize: 20,
        color: '#000',
        fontFamily: 'LeagueSpartan-SemiBold',
    },
    bodyContent: {
        flex: 4,
        backgroundColor: '#fff',
        width: '100%',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        padding: 30,
        gap: 30,
        justifyContent: 'space-between'
    },
})

export default FoodDetails;