import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { MikroIQLogin } from "../../res/images";
import { useAuth } from "../../components/userDetail/Id";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from "react-native-fast-image";
import axiosLinkMain, { updateAxiosBaseUrl } from '../../utils/axiosMain'; // Make sure to import the update function

const GetStarted = ({ navigation }) => {
  const { authData, updateAuthData } = useAuth();
  const [loading, setLoading] = useState(true);
  const gifDuration = 3000;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedAuthData = await AsyncStorage.getItem('authData');
        if (storedAuthData) {
          const parsedAuthData = JSON.parse(storedAuthData);
          Object.keys(parsedAuthData).forEach((key) => {
            updateAuthData(key, parsedAuthData[key]);
          });

          // Check if FirmaApiUrl exists and update Axios base URL
          if (parsedAuthData.FirmaApiUrl) {
            console.log('FirmaApiUrl mevcut, yönlendiriliyor...');
            // Update the Axios base URL here
            updateAxiosBaseUrl(parsedAuthData.FirmaApiUrl); // Set the FirmaApiUrl as base URL
            console.log('FirmaApiUrl', parsedAuthData.FirmaApiUrl);

            setTimeout(() => {
              navigation.navigate('Login'); // Kullanıcı bilgileri varsa ana sayfaya yönlendir
            }, gifDuration);
          } else {
            console.log("FirmaApiUrl bulunamadı, giriş sayfasına yönlendiriliyor.");
            Alert.alert('Hata', 'Firma URL bulunamadı.');
            setTimeout(() => {
              navigation.navigate('Login'); // Giriş sayfasına yönlendir
            }, gifDuration);
          }
        } else {
          console.log("authData bulunamadı, giriş sayfasına yönlendiriliyor.");
          setTimeout(() => {
            navigation.navigate('Login'); // Giriş sayfasına yönlendir
          }, gifDuration);
        }
      } catch (error) {
        setTimeout(() => {
          navigation.navigate('Login'); // Giriş sayfasına yönlendir
        }, gifDuration);
      } 
    };

    checkUser();
  }, []);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedAuthData = await AsyncStorage.getItem('authData');
        if (storedAuthData) {
          const parsedAuthData = JSON.parse(storedAuthData);
          Object.keys(parsedAuthData).forEach((key) => {
            updateAuthData(key, parsedAuthData[key]);
          });

          // Check if MikroApiUrl exists and update Axios base URL
          if (parsedAuthData.MikroApiUrl) {
            console.log('MikroApiUrl mevcut, yönlendiriliyor...');
            // Update the Axios base URL here
            updateAxiosBaseUrl(parsedAuthData.MikroApiUrl); // Set the FirmaApiUrl as base URL
            console.log('MikroApiUrl', parsedAuthData.MikroApiUrl);

            setTimeout(() => {
              navigation.navigate('Login'); // Kullanıcı bilgileri varsa ana sayfaya yönlendir
            }, gifDuration);
          } else {
            console.log("MikroApiUrl bulunamadı, giriş sayfasına yönlendiriliyor.");
            Alert.alert('Hata', 'MikroApi URL bulunamadı.');
            setTimeout(() => {
              navigation.navigate('Login'); // Giriş sayfasına yönlendir
            }, gifDuration);
          }
        } else {
          console.log("authData bulunamadı, giriş sayfasına yönlendiriliyor.");
          setTimeout(() => {
            navigation.navigate('Login'); // Giriş sayfasına yönlendir
          }, gifDuration);
        }
      } catch (error) {
        setTimeout(() => {
          navigation.navigate('Login'); // Giriş sayfasına yönlendir
        }, gifDuration);
      } 
    };

    checkUser();
  }, []);

  return (
    <View style={styles.screen}>
      <MikroIQLogin width={180} height={50} />
      {loading && (
        <FastImage
          style={styles.loadingGif}
          source={require('../../res/images/image/loading.gif')}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
    </View>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingGif: {
    width: 150,
    height: 100,
  },
});
