import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert, BackHandler, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import CustomHeader from '../../components/customheader';
import { router, useFocusEffect } from 'expo-router';
import IconLogin from '../../components/iconlogin';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from '../contexts/userContext';
import { set } from 'date-fns';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const auth = FIREBASE_AUTH;
  const { setUser } = useContext(UserContext);


  const showPassword = () => {
    setShowPass(!showPass);
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        setUser(response.user);
        router.push('../(drawer)/home');
      }
    } catch (error) {
      setError(error.message);
      Alert.alert('Đăng nhập thất bại', "Hãy kiểm tra lại email hoặc mật khẩu của bạn.");
    } finally {
      setLoading(false);
    }

  }

  const handleBackButton = useCallback(() => {
    if (backPressCount === 0) {
      setBackPressCount(prevCount => prevCount + 1);
      setTimeout(() => setBackPressCount(0), 2000);
      ToastAndroid.show('Nhấn quay lại 1 lần nữa để thoát', ToastAndroid.SHORT);
    } else if (backPressCount === 1) {
      BackHandler.exitApp();
    }
    return true;
  }, [backPressCount]);


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackButton();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    })
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Đăng nhập</Text>
      </View>
      <View style={styles.bodyContent}>
        <Text style={[styles.text, { fontSize: 24 }]}>Xin Chào!</Text>
        {/* Phần điền thông tin đăng nhập */}
        <View style={{ gap: 10 }}>
          <View style={{ gap: 5 }}>
            <Text style={styles.text}>Email hoặc số điện thoại</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.inputText} placeholder='example@example.com' autoCapitalize='none'></TextInput>
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
                autoCapitalize='none'
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
        <View style={{ alignItems: "center", gap: 10, }}>
          {loading ? (
            <ActivityIndicator size="large" color="#E95322" />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
            >
              <Text style={[styles.text, { color: "#fff" }]}>Đăng Nhập</Text>
            </TouchableOpacity>
          )}
          <Text style={{ fontFamily: "LeagueSpartan-Regular" }}>
            hoặc đăng nhập với
          </Text>
          {/* Lựa chọn đăng nhập với tài khoản khác */}
          <IconLogin />
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={{ fontFamily: "LeagueSpartan-Regular" }}>
              Không có tài khoản?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("./registration")}
            >
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
    gap: 15,
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
export default Login;