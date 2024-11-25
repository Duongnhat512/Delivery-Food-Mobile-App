import React, { useState } from 'react';
import { Image,Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { useRouter } from 'expo-router';

const AddPaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const router = useRouter();

  const handleSave = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      alert('Vui lòng nhập đầy đủ thông tin thẻ!');
      return;
    }
    alert('Thêm thẻ thành công!');
    router.back(); 
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
                maxLength={5}
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
