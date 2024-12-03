import React, { useState } from 'react';
import { TextInput, Button, Text, StyleSheet, Alert, View } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { TouchableOpacity } from 'react-native';

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Quên mật khẩu" />
            <View style={styles.bodyContent}>
                <Text
                    style={{fontSize: 16, fontFamily: 'LeagueSpartan-Bold'}}
                >Bạn quên mật khẩu?</Text>
                <TextInput
                    style={styles.inputText}
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handlePasswordReset}
                    >
                        <Text style={styles.text}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{fontSize: 14, fontFamily: 'LeagueSpartan-Regular'}}>Nếu không nhận được email, hãy kiểm tra thư rác hoặc thư spam để lấy được link.</Text>
                {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5CB58',
        alignItems: 'center',
    },
    bodyContent: {
        flex: 4,
        backgroundColor: '#fff',
        width: '100%',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        padding: 30,
        gap: 15,
    },
    text: {
        fontFamily: 'LeagueSpartan-SemiBold',
        fontSize: 16,
        color: '#fff',
    },
    inputText: {
        padding: 15,
        backgroundColor: "#F3E9B5",
        fontFamily: 'LeagueSpartan-SemiBold',
        borderRadius: 10,
        fontSize: 20,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        width: '60%',
        padding: 10,
        backgroundColor: '#E95322',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
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
});
export default Forgot;