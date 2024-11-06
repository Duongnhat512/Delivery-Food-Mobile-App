import { router } from 'expo-router';
import React, { useState } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/customheader';

const Orders = () => {
  const [select, setSelect] = useState("Đã đặt")
  const navigation = useNavigation();
  const handleSelect = (status) => {
    setSelect(status);
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Đơn hàng" />
      <View style={styles.bodyContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:30,marginHorizontal:30 }}>
          <TouchableOpacity onPress={() => handleSelect("Đã đặt")}>
            <Text style={[styles.filterBtn, select === "Đã đặt" && styles.selectedBtn, {fontFamily: 'LeagueSpartan-Regular'}]}>Đã đặt</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đang giao")}>
            <Text style={[styles.filterBtn, select === "Đang giao" && styles.selectedBtn, {fontFamily: 'LeagueSpartan-Regular'}]}>Đang giao</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đã giao")}>
            <Text style={[styles.filterBtn, select === "Đã giao" && styles.selectedBtn, {fontFamily: 'LeagueSpartan-Regular'}]}>Đã giao</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đã hủy")}>
            <Text style={[styles.filterBtn, select === "Đã hủy" && styles.selectedBtn, {fontFamily: 'LeagueSpartan-Regular'}]}>Đã hủy</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../assets/TransferDocument.png')} />
            <Text style={{fontFamily:'LeagueSpartan-Regular', fontSize: 30, textAlign: 'center', width: '70%', color:'#E95322'}}>Bạn không có đơn hàng nào</Text>
          </ScrollView>
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
  },
  menuItem: {
    backgroundColor: "#F3E9B5",
    height: 62,
    width: 49,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  filterBtn: {
    fontSize: 14,
    color: "#E95322",
    backgroundColor: "#FFEFE8",
    borderRadius: 20,
    width: 75,
    textAlign: "center",
    paddingVertical: 4,
  },
  selectedBtn: {
    backgroundColor: "#E95322",
    color: "#FFEFE8",
  },
  footer: {
    backgroundColor: '#E95322',
    width: '100%',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  }
})


export default Orders;



