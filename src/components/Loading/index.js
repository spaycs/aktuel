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
        // AsyncStorage'dan daha önce kaydedilmiş auth bilgileri alınır
        const storedAuthData = await AsyncStorage.getItem('authData');

        if (storedAuthData) {
          // Eğer auth verisi varsa JSON formatından obje formatına çevrilir
          const parsedAuthData = JSON.parse(storedAuthData);
          // Her bir auth verisi context'e aktarılır 
          Object.keys(parsedAuthData).forEach((key) => {
            updateAuthData(key, parsedAuthData[key]);
          });
          setTimeout(() => {
            navigation.navigate('GetStarted');
          }, gifDuration);
        } else {
          setTimeout(() => {
            navigation.navigate('Login');
          }, gifDuration);
        }
      } catch (error) {
        // AsyncStorage'dan veri alınamazsa hata yönetimi yapılır ve Login ekranına yönlendirilir
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

  // Yükleme durumu devam ediyorsa ekranda dönen bir yüklenme animasyonu gösterilir
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
