import React, { useState } from 'react';
import { Image,Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { useRouter } from 'expo-router';
import { useContext,useEffect } from 'react';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';


const AddPaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [payments, setPayments] = useState([]);

  const router = useRouter();
  const { user } = useContext(UserContext)
  const token = user ? user.accessToken : null
  const link = process.env.REACT_APP_BACKEND_URL

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${link}/users/get_user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token} `
        }
      });

      const data = await response.json();
      
      if (data && data.payments) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);


  const handleSave = async () => {

    const newPayment = 
      {
        cardNumber: cardNumber,
        cardHolder: cardHolder,
        expiryDate: expiryDate,
        cvv: cvv
      }
    
    // Kiểm tra các trường không được rỗng và không chỉ chứa khoảng trắng
    if (!cardNumber.trim() || !cardHolder.trim() || !expiryDate.trim() || !cvv.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin thẻ!');
      return;
    }
  
    // Regex kiểm tra định dạng số thẻ (16 chữ số)
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumber.trim())) {
      alert('Số thẻ không hợp lệ!');
      return;
    }
  
    // Regex kiểm tra định dạng ngày hết hạn (MM/YY)
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryDateRegex.test(expiryDate.trim())) {
      alert('Ngày hết hạn không hợp lệ!');
      return;
    }
  
    // Regex kiểm tra định dạng CVV 3 chữ số
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv.trim())) {
      alert('CVV không hợp lệ!');
      return;
    }

    // Kiểm tra thẻ đã tồn tại chưa
    const cardExists = payments.some(existingPayment => {
      return existingPayment.cardNumber === cardNumber;
    });
    if (cardExists) {
      alert('Thẻ đã tồn tại!');
      return;
    }
    
    try {
      const response = await axios(`${link}/users/addPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          payment: newPayment
        }
      })
    } catch (error) {
      console.log(error)
    }
    router.push('../(drawer)/payment')

  };


  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Thêm thẻ" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      > 
      
        <View style={styles.form}>
            <View style={{alignItems: 'center',width: '100%', marginBottom: 20}}>
                <Image source={require('../../assets/TheTinDung.png')}  />
            </View>
          <Text style={styles.label}>Số thẻ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số thẻ"
            keyboardType="number-pad"
            maxLength={19}
            value={cardNumber}
            onChangeText={setCardNumber}
          />

          <Text style={styles.label}>Tên chủ thẻ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên chủ thẻ"
            value={cardHolder}
            onChangeText={setCardHolder}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Ngày hết hạn</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}a
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="Nhập CVV"
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
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
  form: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    padding: 20,
  },
  label: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#391713',
  },
  input: {
    backgroundColor: '#F3E9B5', 
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputSmall: {
    backgroundColor: '#F3E9B5', 
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#E95322',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'LeagueSpartan-SemiBold',
    fontSize: 16,
  },
});

export default AddPaymentScreen;
