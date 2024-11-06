import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { Component, useState, useCallback, useEffect } from 'react'
import { useNavigation } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'

export default HomeHeader = () => {
  const [search, setSearch] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')
  const navigation = useNavigation()

  const getTimeOfDay = useCallback(() => {
    const date = new Date()
    const hour = date.getHours()

    if (hour < 12) {
      setTimeOfDay('Buổi Sáng')
    } else if (hour < 18) {
      setTimeOfDay('Buổi Chiều')
    } else {
      setTimeOfDay('Buổi Tối')
    }
  })

  useEffect(() => {
    getTimeOfDay()
  })

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  return (
    <View style={styles.wrapper}>
      <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around" }}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder='Tìm Kiếm'
            value={search}
            onChangeText={setSearch}
            style={{ fontFamily: 'LeagueSpartan-Regular', fontSize: 16, flex: 1 }}
          />
          <TouchableOpacity>
            <Image
              source={require('../assets/filter.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 7 }}>
          <TouchableOpacity
            style={styles.btn}
          >
            <Image
              source={require('../assets/cart.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
          >
            <Image
              source={require('../assets/bell.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={onToggle}
          >
            <Image
              source={require('../assets/user.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{fontFamily: "LeagueSpartan-Bold", color: "#fff", fontSize: 30, paddingHorizontal: 15}}>
        Chào {timeOfDay}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F5CB58',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'LeagueSpartan-Bold',
    height: 40,
  },
  searchBar: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    height: 30,
  },
  btn: {
    backgroundColor: "#fff",
    width: 26,
    height: 26,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
})