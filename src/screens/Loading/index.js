import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../components/userDetail/Id';

const Loading = ({ navigation }) => {
  const { updateAuthData } = useAuth();
  const [loading, setLoading] = useState(true);
  const gifDuration = 2000;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedAuthData = await AsyncStorage.getItem('authData');
        console.log('storedAuthData', storedAuthData);

        if (storedAuthData) {
          const parsedAuthData = JSON.parse(storedAuthData);
          // Update the auth data in context
          Object.keys(parsedAuthData).forEach((key) => {
            updateAuthData(key, parsedAuthData[key]);
          });

          // Navigate to GetStarted after a delay
          setTimeout(() => {
            navigation.navigate('GetStarted'); // Navigate to GetStarted
          }, gifDuration);
        } else {
          // Navigate to Login if no data is found
          setTimeout(() => {
            navigation.navigate('Login');
          }, gifDuration);
        }
      } catch (error) {
        console.error('Error retrieving stored auth data:', error);
        // Navigate to Login on error
        setTimeout(() => {
          navigation.navigate('Login');
        }, gifDuration);
      } finally {
        // Set loading to false
        setLoading(false);
      }
    };

    checkUser();
  }, []); // No dependencies, runs only once

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Uygulama Başlatılıyor...</Text>
      </View>
    );
  }

  return null; // If loading is false, render nothing
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
