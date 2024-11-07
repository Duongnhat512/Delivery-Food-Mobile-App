import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/customheader';

const Rating = () => {
    const [rating, setRating] = useState(0);

    const handleStarPress = (index) => {
        setRating(index + 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Đánh giá" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.bodyContent}>
                        <Image source={require('../../assets/CaRiGa.png')} style={styles.image} />
                        <Text style={styles.title}>Cà Ri Gà</Text>
                        <Text style={styles.description}>Chúng tôi rất vui khi biết được cảm nghĩ của bạn về món ăn!</Text>
                        <View style={styles.rating}>
                            {[...Array(5)].map((_, index) => (
                                <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                                    <Image
                                        source={require('../../assets/bot-star.png')}
                                        style={[
                                            styles.star,
                                            { tintColor: index < rating ? '#FFD700' : '#CCCCCC' },
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={{fontSize:20}}>Hãy để lại bình luận của bạn</Text>
                        <TextInput
                            style={[styles.textArea, { flex: 1 }]}
                            placeholder="Bình luận của bạn..."
                            placeholderTextColor="#999"
                            multiline
                            
                        />
                        <View style={styles.action}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5CB58',
        
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    bodyContent: {
        flex: 4,
        backgroundColor: '#fff',
        width: '100%',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        padding: 20,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 20,
        marginTop: 20
    },
    star: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    textArea: {
        backgroundColor: '#F3E9B5',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        textAlignVertical: 'top',
        width: '100%',
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        color: '#E95322',
    },
    button: {
        backgroundColor: '#FFEFE8',
        borderRadius: 10,
        width: '35%',
        alignItems: 'center',
        padding: 2
    },
});

export default Rating;