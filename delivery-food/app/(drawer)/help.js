import React from 'react';
import { StyleSheet } from 'react-native';
import ChatBot from '../../components/chatBot';
import { SafeAreaView } from 'react-native-safe-area-context';

const Help = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ChatBot />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Help;