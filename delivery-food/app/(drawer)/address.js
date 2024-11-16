import React from 'react'
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';

const Address = () => {
  return (
    <SafeAreaView style={styles.container}>
        <CustomHeader title="Địa chỉ giao hàng"/>
        <View style={styles.bodyContent}>
            
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F5CB58'
  },
  bodyContent: {
    flex: 4,
    backgroundColor: '#fff',
    width: '100%',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    padding: 30,
  },
})

export default Address;  
