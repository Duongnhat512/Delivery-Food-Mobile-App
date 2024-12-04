import { useLocalSearchParams ,router } from 'expo-router';

import React, { useState,useContext,useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
const OrderCancel = () => {
  // const router = useRouter();
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const {  id,food_id } = useLocalSearchParams()
  
  const link = process.env.REACT_APP_BACKEND_URL;
  const { user } = useContext(UserContext)
  const token = user ? user.accessToken : null

  const handleToggleReason = (reason) => {
    setSelectedReasons(prevReasons =>
      prevReasons.includes(reason)
        ? prevReasons.filter(r => r !== reason)
        : [...prevReasons, reason]
    );
  };

  const handleConfirm = async () => {
    if (selectedReasons.length === 0 && otherReason.trim().length === 0) {
      Alert.alert(
        'Thông báo',
        'Vui lòng chọn hoặc nhập lý do hủy đơn',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const response = await axios.put(`${link}/orders/update_status/${id}/${food_id}`, {
        status: "Đã hủy",
        reason: selectedReasons.concat(otherReason).join(', ')
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        router.push('/orderCancelConfirm');
      } else {
        Alert.alert(
          'Thông báo',
          'Có lỗi xảy ra khi hủy đơn',
          [{ text: 'OK' }]
        );

      }
    }
    catch (error) {
      console.error('Error cancelling order:', error);
    }


    
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Hủy đơn" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.bodyContent}>
            <Text style={styles.question}>Bạn có thể cho chúng tôi biết lý do hủy đơn không?</Text>
            <TouchableOpacity style={styles.cancelSection} onPress={() => handleToggleReason("Thời gian giao hàng lâu")}>
              <View style={styles.radioContainer}>
                <Text style={[styles.cancelTitle, selectedReasons.includes("Thời gian giao hàng lâu") && styles.selectedReason]}>Thời gian giao hàng lâu</Text>
                <Image source={require('../../assets/CheckPoint.png')} style={[styles.radio, selectedReasons.includes("Thời gian giao hàng lâu") && styles.selectedRadio]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelSection} onPress={() => handleToggleReason("Không còn nhu cầu mua")}>
              <View style={styles.radioContainer}>
                <Text style={[styles.cancelTitle, selectedReasons.includes("Không còn nhu cầu mua") && styles.selectedReason]}>Không còn nhu cầu mua</Text>
                <Image source={require('../../assets/CheckPoint.png')} style={[styles.radio, selectedReasons.includes("Không còn nhu cầu mua") && styles.selectedRadio]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelSection} onPress={() => handleToggleReason("Phí vận chuyển cao")}>
              <View style={styles.radioContainer}>
                <Text style={[styles.cancelTitle, selectedReasons.includes("Phí vận chuyển cao") && styles.selectedReason]}>Phí vận chuyển cao</Text>
                <Image source={require('../../assets/CheckPoint.png')} style={[styles.radio, selectedReasons.includes("Phí vận chuyển cao") && styles.selectedRadio]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelSection} onPress={() => handleToggleReason("Hỗ trợ khách hàng kém")}>
              <View style={styles.radioContainer}>
                <Text style={[styles.cancelTitle, selectedReasons.includes("Hỗ trợ khách hàng kém") && styles.selectedReason]}>Hỗ trợ khách hàng kém</Text>
                <Image source={require('../../assets/CheckPoint.png')} style={[styles.radio, selectedReasons.includes("Hỗ trợ khách hàng kém") && styles.selectedRadio]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelSection} onPress={() => handleToggleReason("Lỗi thanh toán")}>
              <View style={styles.radioContainer}>
                <Text style={[styles.cancelTitle, selectedReasons.includes("Lỗi thanh toán") && styles.selectedReason]}>Lỗi thanh toán</Text>
                <Image source={require('../../assets/CheckPoint.png')} style={[styles.radio, selectedReasons.includes("Lỗi thanh toán") && styles.selectedRadio]} />
              </View>
            </TouchableOpacity>
            <View style={[styles.cancelSection, { flex: 1 }]}>
              <View>
                <Text style={styles.cancelTitle}>Khác</Text>
              </View>
              <TextInput
                style={[styles.textArea, { flex: 1 }]}
                placeholder="Lý do khác..."
                placeholderTextColor="#999"
                multiline
                value={otherReason}
                onChangeText={setOtherReason}
              />
            </View>
            <View style={{
              width: "100%",
              alignItems: "center",
            }}>
              <TouchableOpacity style={{
                backgroundColor: "#E95322",
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
                width: "50%"
              }}
                onPress={handleConfirm}
              >
                <Text style={{
                  color: "white", fontWeight: "bold"
                }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

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
  },
  question: {
    fontSize: 15,
    marginBottom: 20,
  },
  cancelSection: {
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD8C7',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  selectedRadio: {
    backgroundColor: '#E95322',
  },
  cancelTitle: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
  selectedReason: {
    fontWeight: 'bold',
    color: '#E95322',
  },
  textArea: {
    backgroundColor: '#F3E9B5',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    textAlignVertical: 'top',
  },
})

export default OrderCancel;