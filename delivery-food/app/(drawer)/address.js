import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/customheader';

const DeliveryAddress = () => {
  const [address, setAddress] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  const dataAddress = [
    { id: '1', name: 'Nguyen Van A', address: '123 Đường ABC, Quận 1, TP.HCM' },
    { id: '2', name: 'Tran Thi B', address: '456 Đường XYZ, Quận 2, TP.HCM' }
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedId(item.id)}>
      <View style={styles.itemContainer}>
        <Image source={require('../../assets/HomeIcon.png')} style={styles.homeIcon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemAddress}>{item.address}</Text>
        </View>
        <Image source={require('../../assets/CheckPoint.png')} style={[styles.radio, selectedId === item.id && styles.selectedRadio]} />
      </View>
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Địa chỉ giao hàng" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.bodyContent}>
          <FlatList
            data={dataAddress}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.flatList}
          />
          <View style={styles.addButtonContainer}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Thêm địa chỉ </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5CB58',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
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
    borderTopWidth: 1,
    borderTopColor: '#FFD8C7',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'justify-between',
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