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
