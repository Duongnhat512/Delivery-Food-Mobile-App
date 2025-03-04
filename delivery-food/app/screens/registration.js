import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import CustomHeader from "../../components/customheader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import IconLogin from "../../components/iconlogin";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { router } from "expo-router";
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import axios from "axios";
import Toast from "react-native-toast-message";



const Registration = () => {
    // Khai báo state
    //Khai báo password và showPass
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(true);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;

    const URL_AVT = "https://i.ibb.co/sRzQXsw/marcille.png";


    // Khai báo phoneNumber và formattedPhoneNumber
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const phoneInput = useRef(null);

    // Khai báo ngày sinh
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const validate = () => {
        if (!name) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập tên của bạn',
            });
            return false;
        }
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập email của bạn',
            });
            return false;
        }
        if (!password) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập mật khẩu của bạn',
            });
            return false;
        }
        if (!phoneNumber) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập số điện thoại của bạn',
            });
            return false;
        }
        return true;
    }

    // xử lý đăng ký
    const handleSignUp = async () => {
        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;

            await updateProfile(user, {
                displayName: name,
                photoURL: URL_AVT,
            });

            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    birthDate: format(date, 'dd/MM/yyyy'),
                    photoURL: URL_AVT,
                    time_created: new Date(),
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            Toast.show({
                type: 'success',
                text1: 'Đăng ký thành công',
                text2: 'Chúc mừng bạn đã đăng ký thành công tài khoản.',
            });

        } catch (error) {
            let errorMessage = 'Đã xảy ra lỗi';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email đã được sử dụng';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email không hợp lệ';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Mật khẩu quá yếu';
            }else if (error.code === 'auth/missing-password') {
                errorMessage = 'Vui lòng nhập mật khẩu';
            }
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} >
            <CustomHeader title="Tài khoản mới" />
            <View style={styles.bodyContent}>
                {/* Phần nhập thông tin */}
                <View style={{ gap: 5 }}>
                    {/* Họ và tên */}
                    <View>
                        <Text style={styles.text}>Họ và tên</Text>
                        <TextInput value={name} onChangeText={setName} style={styles.inputText} placeholder='Nguyễn Văn A' autoCapitalize="words" />
                    </View>
                    {/* Mật khẩu */}
                    <View>
                        <Text style={styles.text}>Mật khẩu</Text>
                        <View style={styles.inputText}>
                            <TextInput
                                style={[styles.text, { flex: 1 }]}
                                placeholder='***********'
                                secureTextEntry={showPass}
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPass(!showPass)}
                            >
                                <Image source={require("../../assets/Show_Off.png")} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Email */}
                    <View>
                        <Text style={styles.text}>Email</Text>
                        <TextInput
                            style={styles.inputText}
                            value={email}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            placeholder="example@example.com"
                            keyboardType="email-address"
                        />
                    </View>
                    {/* Số điện thoại */}
                    <View>
                        <Text style={styles.text}>Số điện thoại</Text>
                        <TextInput
                            style={[styles.inputText]}
                            placeholder='Nhập số điện thoại'
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            autoCapitalize="none"
                            keyboardType="phone-pad"
                        />
                    </View>
                    {/* Ngày sinh */}
                    <View>
                        <Text style={styles.text}>Ngày sinh</Text>
                        <Pressable
                            onPress={() => setOpen(true)}
                            style={[styles.inputText, { marginVertical: 0, }]}
                        >
                            <Text style={[styles.inputText, { paddingVertical: 0 }]}>{format(date, 'dd/MM/yyyy')}</Text>
                        </Pressable>
                        <DateTimePickerModal
                            isVisible={open}
                            mode="date"
                            onConfirm={(date) => {
                                setOpen(false);
                                setDate(date);
                            }}
                            dateStringFormat="dd/MM/yyyy"
                            onCancel={() => setOpen(false)}
                        />
                    </View>
                </View>
                {/* Phần đăng ký */}
                <View style={{ alignItems: "center", gap: 10 }}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontFamily: "LeagueSpartan-Regular" }}>
                            Để tiếp tục, bạn cần đồng ý
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <TouchableOpacity>
                                <Text
                                    style={{ fontSize: 16, fontFamily: 'LeagueSpartan-SemiBold', color: '#E95322' }}
                                >Điều khoản sử dụng</Text>
                            </TouchableOpacity>
                            <Text
                                style={{ fontSize: 16, fontFamily: 'LeagueSpartan-Regular' }}
                            >và</Text>
                            <TouchableOpacity>
                                <Text
                                    style={{ fontSize: 16, fontFamily: 'LeagueSpartan-SemiBold', color: '#E95322' }}
                                >Chính sách bảo mật.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color="#E95322" />
                    ) : (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignUp}
                        >
                            <Text style={[styles.text, { color: "#fff" }]}>Đăng Ký</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={{ fontFamily: "LeagueSpartan-Regular" }}>hoặc đăng ký với</Text>
                    <IconLogin />
                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                        <Text style={{ fontFamily: "LeagueSpartan-Regular" }}>
                            Đã có tài khoản?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("./login")}
                        >
                            <Text style={{ color: "#E95322" }}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5CB58',
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
        fontSize: 20,
    },
    inputText: {
        padding: 10,
        backgroundColor: "#F3E9B5",
        fontFamily: 'LeagueSpartan-SemiBold',
        borderRadius: 10,
        fontSize: 20,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: '60%',
        padding: 10,
        backgroundColor: '#E95322',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
});

export default Registration;