import React, { useState } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, } from 'react-native'

const Orders = () => {
  const [select, setSelect] = useState("Đã đặt")
  const handleSelect = (status) => {
    setSelect(status);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 150 }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1, padding: 20 }}>
          <TouchableOpacity>

            <Image source={require('../../assets/BackIconArrow.png')} />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: "center", color: "white", fontSize: 25, fontWeight: "bold" }}>Đơn hàng</Text>
        </View>
      </View>
      <View style={styles.bodyContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:30,marginHorizontal:30 }}>
          <TouchableOpacity onPress={() => handleSelect("Đã đặt")}>
            <Text style={[styles.filterBtn, select === "Đã đặt" && styles.selectedBtn]}>Đã đặt</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đang giao")}>
            <Text style={[styles.filterBtn, select === "Đang giao" && styles.selectedBtn]}>Đang giao</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đã giao")}>
            <Text style={[styles.filterBtn, select === "Đã giao" && styles.selectedBtn]}>Đã giao</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đã hủy")}>
            <Text style={[styles.filterBtn, select === "Đã hủy" && styles.selectedBtn]}>Đã hủy</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../assets/TransferDocument.png')} />
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity>
            <Image source={require('../../assets/homeFooter.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/foodFooter.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/heartFooter.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/menuFooter.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/contactFooter.png')} />
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
    borderRadius: 10,
    width: 75,
    textAlign: "center"
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



