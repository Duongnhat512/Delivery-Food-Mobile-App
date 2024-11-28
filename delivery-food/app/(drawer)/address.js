import { useRouter } from 'expo-router';
import React, { useEffect, useState, useContext,useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { UserContext } from '../contexts/userContext';
import { useFocusEffect } from '@react-navigation/native';

const DeliveryAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  // Lấy token (có thể từ AsyncStorage hoặc state)
  const { user } = useContext(UserContext);
  const token = user ? user.accessToken : null;
  const link = process.env.REACT_APP_BACKEND_URL;

  // Hàm fetch dữ liệu người dùng
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${link}/users/get_user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Thêm token vào header
        }
      });

      const data = await response.json();
      if (data && data.addresses) {
        setAddresses(data.addresses);  // Cập nhật dữ liệu địa chỉ
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch dữ liệu khi component focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedId(item.address)}>
      <View style={styles.itemContainer}>
        <Image source={require('../../assets/HomeIcon.png')} style={styles.homeIcon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemAddress}>{item.address}</Text>
        </View>
        <Image source={require('../../assets/CheckPoint.png')} style={[styles.radio, selectedId === item.address && styles.selectedRadio]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Địa chỉ giao hàng" />
      <View style={styles.bodyContent}>
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={item => item.address} 
          style={[styles.flatList, { borderTopWidth: addresses.length > 0 ? 1 : 0 }]}
        />
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('../screens/addAddress')}
          >
            <Text style={styles.addButtonText}>Thêm địa chỉ </Text>
          </TouchableOpacity>
        </View>
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
    flex: 4,
    backgroundColor: '#fff',
    width: '100%',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    padding: 30,
  },
  addButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#FFEFE8",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "50%",
  },
  addButtonText: {
    color: "#E95322",
    fontFamily: "LeagueSpartan-SemiBold",
  },
  flatList: {
    marginTop: 20,
    borderTopColor: '#FFD8C7',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#FFD8C7',
    borderBottomWidth: 1,
    paddingVertical: 25,
  },
  homeIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  itemTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemAddress: {
    fontSize: 14,
    color: '#555',
  },
  radio: {
    width: 20,
    height: 20,
  },
  selectedRadio: {
    backgroundColor: '#E95322',
    borderRadius: 10,
  },
});

export default DeliveryAddress;