import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native'
import CustomHeader from '../../components/customheader'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

const AddAddress = () => {
  const [address, setAddress] = useState("");
  const [addressName, setAddressName] = useState("");

  const link = process.env.REACT_APP_BACKEND_URL

  const handleAddAddress = async () => {
    const newAddress = [
      {
        name: addressName,
        address: address
      }
    ]

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