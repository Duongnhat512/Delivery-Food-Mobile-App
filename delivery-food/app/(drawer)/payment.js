import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { useRouter } from 'expo-router';
import { useContext ,useEffect} from 'react';
import { UserContext } from '../contexts/userContext';


const PaymentMethods = () => {
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();
  const[ paymentMethods, setPaymentMethods] = useState([])
  const { user } = useContext(UserContext)
  const token = user ? user.accessToken : null
  const link = process.env.REACT_APP_BACKEND_URL

  // const paymentMethods = [
  //   { id: '1', name: 'PayPal', icon: require('../../assets/Paypal.png') },
  //   { id: '2', name: 'Apple Pay', icon: require('../../assets/Mac.png') },
  //   { id: '3', name: '************34', icon: require('../../assets/card-icon.png') },
  //   { id: '4', name: 'Google', icon: require('../../assets/Google-play.png') },
  // ];
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
        setPaymentMethods(data.payments);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedId(item.cardNumber)}>
      <View style={styles.itemContainer}>
        <Image source={require('../../assets/card-icon.png')} />
        <Text style={styles.itemName}>**** **** **** {item.cardNumber.slice(-4)}</Text>
        <Image
          source={require('../../assets/CheckPoint.png')}
          style={[styles.radio, selectedId === item.cardNumber && styles.selectedRadio]}
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
          keyExtractor={item => item.cardNumber}
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
