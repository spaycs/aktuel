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

        if (storedAuthData) {
          const parsedAuthData = JSON.parse(storedAuthData);
          // Auth verilerini güncelleyin
          Object.keys(parsedAuthData).forEach((key) => {
            updateAuthData(key, parsedAuthData[key]);
          });
          // Kullanıcı varsa GetStarted'a yönlendir
          setTimeout(() => {
            navigation.navigate('GetStarted');
          }, gifDuration);
        } else {
          // Kullanıcı yoksa Login sayfasına yönlendir
          setTimeout(() => {
            navigation.navigate('Login');
          }, gifDuration);
        }
      } catch (error) {
        console.error('Error retrieving stored auth data:', error);
        setTimeout(() => {
          navigation.navigate('Login');
        }, gifDuration);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
