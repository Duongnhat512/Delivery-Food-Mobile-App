import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { useRouter } from 'expo-router';

const PaymentMethods = () => {
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  const paymentMethods = [
    { id: '1', name: 'PayPal', icon: require('../../assets/Paypal.png') },
    { id: '2', name: 'Apple Pay', icon: require('../../assets/Mac.png') },
    { id: '3', name: '************34', icon: require('../../assets/card-icon.png') },
    { id: '4', name: 'Google', icon: require('../../assets/Google-play.png') },
  ];



  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedId(item.id)}>
      <View style={styles.itemContainer}>
        <Image source={item.icon}  />
        <Text style={styles.itemName}>{item.name}</Text>
        <Image
          source={require('../../assets/CheckPoint.png')}
          style={[styles.radio, selectedId === item.id && styles.selectedRadio]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Phương thức thanh toán" />
      <View style={styles.bodyContent}>
        <FlatList
          data={paymentMethods}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.paymentList}
        />
        <TouchableOpacity style={styles.paymentButton} onPress={() => router.push('../screens/addPayment')}>
          <Text style={styles.paymentButtonText}>Thêm thẻ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5CB58',
  },
  bodyContent: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    padding: 20,
  },
  paymentList: {
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',
    borderBottomColor: '#FFD8C7',
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
 
  itemName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#391713',
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#E95322',
    borderRadius: 10,
  },
  selectedRadio: {
    backgroundColor: '#E95322',
  },
  paymentButton: {
    backgroundColor: '#E95322',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  paymentButtonText: {
    color: '#fff',
    fontFamily: 'LeagueSpartan-SemiBold',
    fontSize: 16,
  },
});

export default PaymentMethods;
