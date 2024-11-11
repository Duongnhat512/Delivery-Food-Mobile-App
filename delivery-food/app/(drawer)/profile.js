import React, { useContext, useEffect, useState } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import CustomHeader from '../../components/customheader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../contexts/userContext';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

const Profile = () => {
  const { user, userData } = useContext(UserContext);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E95322" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Hồ sơ của tôi" />
      {user ? (
        <View style={styles.bodyContent}>
          <View style={{ alignItems: 'center' }}>
            <Image source={{ uri: user.photoURL }} style={{ width: 127, height: 127, borderRadius: 70 }} resizeMode='contain' />
          </View>
          <View style={{ gap: 10 }}>
            <View>
              <Text style={{ fontSize: 18, fontFamily: 'LeagueSpartan-SemiBold', marginBottom: 10 }}>Họ và tên</Text>
              <Text
                style={{
                  backgroundColor: '#F3E9B5',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontFamily: 'LeagueSpartan-Regular',
                  fontSize: 20,
                  borderRadius: 10,
                }}
              >{user.displayName}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontFamily: 'LeagueSpartan-SemiBold', marginBottom: 10 }}>Ngày sinh</Text>
              <Text
                style={{
                  backgroundColor: '#F3E9B5',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontFamily: 'LeagueSpartan-Regular',
                  fontSize: 20,
                  borderRadius: 10,
                }}
              >{userData.birthDate}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontFamily: 'LeagueSpartan-SemiBold', marginBottom: 10 }}>Email</Text>
              <Text
                style={{
                  backgroundColor: '#F3E9B5',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontFamily: 'LeagueSpartan-Regular',
                  fontSize: 20,
                  borderRadius: 10,
                }}
              >{user.email}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontFamily: 'LeagueSpartan-SemiBold', marginBottom: 10 }}>Số điện thoại</Text>
              <Text
                style={{
                  backgroundColor: '#F3E9B5',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontFamily: 'LeagueSpartan-Regular',
                  fontSize: 20,
                  borderRadius: 10,
                }}
              >{userData.phoneNumber}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <TouchableOpacity style={{ backgroundColor: '#E95322', padding: 10, borderRadius: 20, marginTop: 20, alignItems: 'center', width: "50%" }}>
              <Text style={{ color: '#fff', fontFamily: 'LeagueSpartan-SemiBold', fontSize: 16 }}>Cập nhật hồ sơ</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5CB58'
  },
  bodyContent: {
    flex: 4,
    backgroundColor: '#fff',
    width: '100%',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    padding: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Profile;  
