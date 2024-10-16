import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../components/CustomHeader';


const Login = () => {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const showPassword = () => {
    setShowPass(!showPass);
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Đăng nhập" />
      <View style={styles.bodyContent}>
        <Text style={[styles.text, { fontSize: 24 }]}>Xin Chào!</Text>
        {/* Phần điền thông tin đăng nhập */}
        <View style={{ gap: 20 }}>
          <View style={{ gap: 5 }}>
            <Text style={styles.text}>Email hoặc số điện thoại</Text>
            <TextInput style={styles.inputText} placeholder='example@example.com'></TextInput>
          </View>
          <View style={{ gap: 5 }}>
            <Text style={styles.text}>Mật khẩu</Text>

            <View style={styles.inputText}>
              <TextInput
                style={[styles.text, { flex: 1 }]}
                placeholder='***********'
                secureTextEntry={showPass} // Ẩn hiện mật khẩu
                value={password}
                onChangeText={setPassword}
              ></TextInput>
              <TouchableOpacity
                onPress={showPassword}
              >
                <Image source={require("../../assets/Show_Off.png")} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ color: "#E95322", alignItems: "flex-end" }}>
          <Text style={{ color: "#E95322" }}>Quên mật khẩu?</Text>
        </View>
        <View style={{ alignItems: "center", gap: 25, marginTop: "10%" }}>
          <TouchableOpacity
            style={styles.button}
          >
            <Text style={[styles.text, { color: "#fff" }]}>Đăng Nhập</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: "LeagueSpartan-Regular" }}>
            hoặc đăng nhập với
          </Text>
          {/* Lựa chọn đăng nhập với tài khoản khác */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity style={styles.icon}>
              <Image source={require("../../assets/Facebook.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Image source={require("../../assets/Gmail.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Image source={require("../../assets/Mark.png")} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={{ fontFamily: "LeagueSpartan-Regular" }}>
              Không có tài khoản?
            </Text>
            <TouchableOpacity>
              <Text style={{ color: "#E95322" }}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5CB58',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'LeagueSpartan-Regular',
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
  icon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFEFE8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});
export default Login;