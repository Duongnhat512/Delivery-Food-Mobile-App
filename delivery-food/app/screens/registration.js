import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, Pressable } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import PhoneInput from 'react-native-phone-number-input';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';


const Registration = () => {
    // Khai báo state
    //Khai báo password và showPass
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(true);

    // Khai báo phoneNumber và formattedPhoneNumber
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const phoneInput = useRef(null);

    // Khai báo ngày sinh
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    // 

    return (
        <SafeAreaView style={styles.container} >
            <CustomHeader title="Tài khoản mới" />
            <View style={styles.bodyContent}>
                {/* Phần nhập thông tin */}
                <View style={{ gap: 10 }}>
                    <View>
                        <Text style={styles.text}>Họ và tên</Text>
                        <TextInput style={styles.inputText} placeholder='Nguyễn Văn A' />
                    </View>
                    <View>
                        <Text style={styles.text}>Mật khẩu</Text>
                        <View style={styles.inputText}>
                            <TextInput
                                style={[styles.text, { flex: 1 }]}
                                placeholder='***********'
                                secureTextEntry={showPass}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPass(!showPass)}
                            >
                                <Image source={require("../../assets/Show_Off.png")} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.text}>Email</Text>
                        <TextInput style={styles.inputText} placeholder="example@example.com" />
                    </View>
                    <View>
                        <Text style={styles.text}>Số điện thoại</Text>
                        <PhoneInput
                            ref={phoneInput}
                            defaultValue={phoneNumber}
                            defaultCode="VN"
                            layout="first"
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                            }}
                            onChangeFormattedText={(text) => {
                                setFormattedPhoneNumber(text);
                            }}
                            countryPickerProps={{ withAlphaFilter: true }}
                            containerStyle={[styles.inputText, { padding: 0, height: 50 }]}
                            textInputStyle={[styles.text, { paddingVertical: 0, paddingHorizontal: 8 }]}
                            textContainerStyle={{ backgroundColor: "#F3E9B5", paddingVertical: 0, paddingHorizontal: 8 }}
                        />
                    </View>
                    <View>
                        <Text style={styles.text}>Ngày sinh</Text>
                        <Pressable
                            onPress={() => setOpen(true)}
                            style={[styles.inputText, {marginVertical: 0}]}
                        >
                            <Text style={styles.inputText}>{format(date, 'dd/MM/yyyy')}</Text>
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
        gap: 30,
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
});

export default Registration;