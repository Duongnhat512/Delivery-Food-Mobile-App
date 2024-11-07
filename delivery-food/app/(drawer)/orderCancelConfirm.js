import { router } from 'expo-router';
import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/customheader';

const OrderCancelConfirm = () => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const navigation = useNavigation();

  const handleToggleReason = (reason) => {
    setSelectedReasons(prevReasons =>
      prevReasons.includes(reason)
        ? prevReasons.filter(r => r !== reason)
        : [...prevReasons, reason]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="" />
      <Image source={require('../../assets/CancelSequence.png')} style={styles.cancelSequence} />
      <Text style={styles.cancelTitle}>Đã Hủy Đơn Hàng</Text>
      <Text style={styles.cancelDescription}>Bạn đã hủy đơn hàng thành công!</Text>
      <View style={styles.cancelFooter}>
        <Text style={styles.cancelDescription}>Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ đến chăm sóc khách hàng!</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5CB58',
    alignItems: 'center',
    padding: 20,
  },
    cancelSequence: {
        marginTop: 50,
        marginBottom: 20,
    },
    cancelTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cancelDescription: {
        fontSize: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    cancelFooter: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 50
    },
})

export default OrderCancelConfirm;