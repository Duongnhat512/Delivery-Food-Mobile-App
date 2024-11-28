import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import CustomHeader from '../../components/customheader'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { useContext } from 'react'
import { UserContext } from '../contexts/userContext'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'


const AddAddress = () => {
  const [address, setAddress] = useState("");
  const [addressName, setAddressName] = useState("");
  const [addresses, setAddresses] = useState([])
  const route = useRouter()


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
      if (data && data.addresses) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);


  const handleAddAddress = async () => {
    const newAddress = [
      {
        name: addressName,
        address: address
      }
    ]
    if (addressName.trim().length === 0 || address.trim().length === 0) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }


    const addressExists = addresses.some(existingAddress => {

      return existingAddress.address === address;
    });
    
    if (addressExists) {
      alert('Địa chỉ đã tồn tại');
      return;
    } 


    try {
      const response = await axios(`${link}/users/update_address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          newAddress
        }
      })
    } catch (error) {
      console.log(error)
    }
    route.back()

  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={"Thêm địa chỉ"} />
      <View style={styles.bodyContent}>
        <Image
          source={require('../../assets/home_icon.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
          resizeMode='contain'
        />
        <View style={{ gap: 10 }}>
          <Text style={{ fontFamily: "LeagueSpartan-SemiBold", fontSize: 18 }}>Tên</Text>
          <TextInput
            value={addressName}
            onChangeText={setAddressName}
            style={{
              backgroundColor: '#F3E9B5',
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontFamily: 'LeagueSpartan-Regular',
              fontSize: 20,
              borderRadius: 10,
            }}
            placeholder='Nhập tên địa chỉ'
          />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={{ fontFamily: "LeagueSpartan-SemiBold", fontSize: 18 }}>Địa chỉ</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={{
              backgroundColor: '#F3E9B5',
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontFamily: 'LeagueSpartan-Regular',
              fontSize: 20,
              borderRadius: 10,
            }}
            placeholder='Nhập địa chỉ'
          />
        </View>
        <View style={{ width: "100%", alignItems: "center", marginTop: "30%" }}>
          <TouchableOpacity
            style={styles.addButton}
          >
            <Text onPress={handleAddAddress} style={styles.addButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

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
    gap: 20
  },
  addButton: {
    backgroundColor: "#E95322",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "50%",
  },
  addButtonText: {
    color: "#fff",
    fontFamily: "LeagueSpartan-SemiBold",
  },
})

export default AddAddress