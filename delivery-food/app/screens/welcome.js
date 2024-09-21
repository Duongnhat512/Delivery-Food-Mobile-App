import { Image, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Suspense } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <View
        style={styles.container}
      >
        <View>
          <Image
            source={require('../../assets/logo.png')}
          />
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
            margin: 40,
            fontFamily: 'Inter',
          }}
        >
          Nhanh hơn bạn nghĩ, ngon hơn bạn mong đợi!</Text>
        <TouchableOpacity
          style={[styles.button, { marginBottom: 5, backgroundColor: "#F5CB58" }]}
          onPress={() => {
            router.push("./login");
          }}
        >
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#F3E9B5" }]}
        >
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E95322',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: "60%",
  },
  buttonText: {
    color: '#E95322',
    fontSize: 24,
    fontFamily: 'Inter',
  },
});