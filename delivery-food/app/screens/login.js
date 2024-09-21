import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <View>

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
    fontFamily: 'Inter-Bold',
  },
});
export default Login;