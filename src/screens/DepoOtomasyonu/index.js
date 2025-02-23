import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../../components/userDetail/Id';
import { useAuthDefault } from '../../components/DefaultUser';
import { ProductContext } from '../../context/ProductContext';
import axiosLinkMain from '../../utils/axiosMain';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { Picker } from '@react-native-picker/picker';
import { RNCamera } from 'react-native-camera';
import { Camera, Nokta, Down } from '../../res/images';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const DepoOtomasyonu = () => {
    const { authData } = useAuth();
    const { defaults } = useAuthDefault();
    const [cameraModalVisible, setCameraModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
  

  // Modal İşlemleri
    const openModal = (item) => {
      setSelectedItem(item);
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
      setSelectedItem(null);
    };
  // Modal İşlemleri

  // Kamera İşlemleri
    const handleCameraOpen = () => {setCameraModalVisible(true);};
    const handleCameraClose = () => {setCameraModalVisible(false);};

    const handleBarCodeRead = ({ data }) => {
      setCameraModalVisible(false);
    };
  // Kamera İşlemleri 

  return (
    <View style={MainStyles.slContainer}>
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.slinputUrunAra}
          placeholder="Evrak Seri Sıra Okut"
          placeholderTextColor={colors.placeholderTextColor}
        />
        <TouchableOpacity onPress={handleCameraOpen} style={MainStyles.slbuttonUrunAra}>
          <Camera/>
        </TouchableOpacity>
      </View>

      <Modal visible={cameraModalVisible} animationType="slide">
        <View style={MainStyles.cameraContainer}>
        <Text style={MainStyles.barcodeTitle}>Barkodu Okutunuz</Text>
        <View style={MainStyles.cameraWrapper}>
            <RNCamera
              style={{ flex: 1 }}
              onBarCodeRead={handleBarCodeRead}
              captureAudio={false}
              androidCameraPermissionOptions={{
                title: 'Kamera İzni',
                message: 'Barkod okutmak için kameranıza erişim izni vermelisiniz.',
                buttonPositive: 'Tamam',
                buttonNegative: 'İptal',
              }}
            />
            <View style={MainStyles.overlay}>
                <View style={MainStyles.overlayMask} />
                  <View style={MainStyles.overlayBox}>
                    <View style={MainStyles.overlayLine} />
                  </View>
                </View>
            </View>
            </View>
        <TouchableOpacity onPress={handleCameraClose} style={MainStyles.kapat}>
        <Text style={MainStyles.kapatTitle}>Kapat</Text>
        </TouchableOpacity>
      </Modal>

     
    </View>
  );
};

export default DepoOtomasyonu;
