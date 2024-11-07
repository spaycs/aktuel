import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { MainStyles } from '../../res/style';
import axiosLinkMain from '../../utils/axiosMain';
import { ProductContext } from '../../context/ProductContext';
import { useAuth } from '../../components/userDetail/Id';
import ProductModal from '../../context/ProductModal';
import { colors } from '../../res/colors';
import { Picker } from '@react-native-picker/picker';
import { RNCamera } from 'react-native-camera';
import { Camera } from '../../res/images';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const FiyatGor = () => {
  const { authData } = useAuth();
  const { addedProducts, setAddedProducts } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState('Stok_Ad');
  const [markaOptions, setMarkaOptions] = useState([]);
  const [selectedMarka, setSelectedMarka] = useState('');
  const [stokAdOptions, setStokAdOptions] = useState([]);
  const [stokKodOptions, setStokKodOptions] = useState([]);
  const [altGrupOptions, setAltGrupOptions] = useState([]);
  const [anaGrupOptions, setAnaGrupOptions] = useState([]);
  const [reyonOptions, setReyonOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchProductData = useCallback(async (searchTerm = '', searchCriteria = 'Stok_Ad', marka = '') => {
    try {
      let response;

      // Barkod seçildiğinde barkod API'sini çağır
      if (searchCriteria === 'Barkod') {
        response = await axiosLinkMain.get(`/Api/Barkod/BarkodAra?barkod=${searchTerm}`);
        const data = response.data;

        const filteredData = data.map(item => ({
          Stok_Ad: item.Stok_Ad,
          Stok_Kod: item.Stok_Kod,
          Liste_Fiyatı: item.Liste_Fiyatı,
          Depodaki_Miktar: item.Depodaki_Miktar,
          Depo1Miktar: item.Depo1Miktar,
          Depo2Miktar: item.Depo2Miktar,
          Vergi: item.Vergi,
          Birim: item.Birim,
          Marka: item.Marka,
          AltGrup: item.AltGrup,
          AnaGrup: item.AnaGrup,
          Reyon: item.Reyon,
        }));

        setData(filteredData);
      } else {
        // Diğer kriterler için stok API'sini çağır
        response = await axiosLinkMain.get('/Api/Stok/StokListesi');
        const data = response.data;

        const markaSet = new Set(data.map(item => item.Marka).filter(marka => marka));
        const stokAdSet = new Set(data.map(item => item.Stok_Ad).filter(ad => ad));
        const stokKodSet = new Set(data.map(item => item.Stok_Kod).filter(kod => kod));
        const altGrupSet = new Set(data.map(item => item.AltGrup).filter(grup => grup));
        const anaGrupSet = new Set(data.map(item => item.AnaGrup).filter(grup => grup));
        const reyonSet = new Set(data.map(item => item.Reyon).filter(reyon => reyon));

        setMarkaOptions(Array.from(markaSet));
        setStokAdOptions(Array.from(stokAdSet));
        setStokKodOptions(Array.from(stokKodSet));
        setAltGrupOptions(Array.from(altGrupSet));
        setAnaGrupOptions(Array.from(anaGrupSet));
        setReyonOptions(Array.from(reyonSet));

        const normalizedSearchTerm = normalizeText(searchTerm).toLowerCase().split(' ');

        const filteredData = data
          .filter(item => {
            const normalizedItemText = normalizeText(item[searchCriteria] || '').toLowerCase();
            const matchesSearchTerm = normalizedSearchTerm.every(term => normalizedItemText.includes(term));
            const matchesMarka = marka ? item.Marka === marka : true;
            return matchesSearchTerm && matchesMarka;
          })
          .map(item => ({
            Stok_Ad: item.Stok_Ad,
            Stok_Kod: item.Stok_Kod,
            Liste_Fiyatı: item.Liste_Fiyatı,
            Depodaki_Miktar: item.Depodaki_Miktar,
            Depo1Miktar: item.Depo1Miktar,
            Depo2Miktar: item.Depo2Miktar,
            Vergi: item.Vergi,
            Birim: item.Birim,
            Marka: item.Marka,
            AltGrup: item.AltGrup,
            AnaGrup: item.AnaGrup,
            Reyon: item.Reyon,
          }));

        setData(filteredData);
      }
    } catch (err) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, []);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleCameraOpen = () => {
    setCameraModalVisible(true); 
  };

  const handleCameraClose = () => {
    setCameraModalVisible(false); 
  };

  const handleBarCodeRead = ({ data }) => {
    setCameraModalVisible(false);
    setSearchCriteria('Barkod');
    setSearchTerm(data); 
    fetchProductData(data, 'Barkod'); 
  };

   const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={MainStyles.itemContainer}>
      <View style={MainStyles.itemTextContainer}>
        <Text style={MainStyles.itemText}>Stok Kodu: {item.Stok_Kod}</Text>
        <Text style={MainStyles.itemText}>Stok Adı: {item.Stok_Ad}</Text>
        <Text style={MainStyles.itemText}>Liste Fiyatı: {item.Liste_Fiyatı}</Text>
        <Text style={MainStyles.itemText}>Miktar: {item.Depodaki_Miktar}</Text>
        <Text style={MainStyles.itemText}>Depo1Miktar: {item.Depo1Miktar}</Text>
        <Text style={MainStyles.itemText}>Depo2Miktar: {item.Depo2Miktar}</Text>
        <Text style={MainStyles.itemText}>Vergi: {item.Vergi}</Text>
        <Text style={MainStyles.itemText}>Birim: {item.Birim}</Text>
        <Text style={MainStyles.itemText}>Marka: {item.Marka}</Text>
        <Text style={MainStyles.itemText}>AltGrup: {item.AltGrup}</Text>
        <Text style={MainStyles.itemText}>AnaGrup: {item.AnaGrup}</Text>
        <Text style={MainStyles.itemText}>Reyon: {item.Reyon}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={MainStyles.slContainer}>
      <View style={MainStyles.pageTop}>
        <View style={MainStyles.inputStyle}>
          <Picker
            itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
            selectedValue={searchCriteria}
            onValueChange={(itemValue) => setSearchCriteria(itemValue)}
          >
            <Picker.Item label="Stok Adı" value="Stok_Ad" style={MainStyles.textStyle} />
            <Picker.Item label="Stok Kodu" value="Stok_Kod" style={MainStyles.textStyle} />
            <Picker.Item label="Marka" value="Marka" style={MainStyles.textStyle} />
            <Picker.Item label="Alt Grup" value="AltGrup" style={MainStyles.textStyle} />
            <Picker.Item label="Ana Grup" value="AnaGrup" style={MainStyles.textStyle} />
            <Picker.Item label="Reyon" value="Reyon" style={MainStyles.textStyle} />
            <Picker.Item label="Barkod" value="Barkod" style={MainStyles.textStyle} />
          </Picker>
        </View>
      </View>
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.slinputUrunAra}
          placeholder="Ürün kodu veya adı ile ara"
          placeholderTextColor={colors.placeholderTextColor}
          value={searchTerm}
          onChangeText={setSearchTerm}
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

      <TouchableOpacity style={MainStyles.searchButton} onPress={() => fetchProductData(searchTerm, searchCriteria, selectedMarka)}>
        <Text style={MainStyles.modalSearchButtonText}>ARA</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.Stok_Kod}
      />
      {selectedItem && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={closeModal}>
          <View style={MainStyles.modalStokContainer}>
            <View style={MainStyles.modalStokContent}>
              <Text style={MainStyles.modalTitle}>Stok Detayı</Text>
              <Text style={MainStyles.modalText}>Stok Kodu: {selectedItem.Stok_Kod}</Text>
              <Text style={MainStyles.modalText}>Stok Adı: {selectedItem.Stok_Ad}</Text>
              <Text style={MainStyles.modalText}>Depodaki Miktar: {selectedItem.Depodaki_Miktar}</Text>
              <Text style={MainStyles.modalText}>Depodaki Miktar 1: {selectedItem.Depo1Miktar}</Text>
              <Text style={MainStyles.modalText}>Depodaki Miktar 2: {selectedItem.Depo2Miktar}</Text>
              <Text style={MainStyles.modalText}>Liste Fiyatı: {selectedItem.Liste_Fiyatı} ₺</Text>
              <Text style={MainStyles.modalText}>Vergi: {selectedItem.Vergi}</Text>
              <Text style={MainStyles.modalText}>Birim: {selectedItem.Birim}</Text>
              <Text style={MainStyles.modalText}>Marka: {selectedItem.Marka}</Text>
              <Text style={MainStyles.modalText}>AltGrup: {selectedItem.AltGrup}</Text>
              <Text style={MainStyles.modalText}>AnaGrup: {selectedItem.AnaGrup}</Text>
              <Text style={MainStyles.modalText}>Reyon: {selectedItem.Reyon}</Text>
              <TouchableOpacity style={MainStyles.closeButton} onPress={closeModal}>
                <Text style={MainStyles.closeStokDetayiOnizlemeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default FiyatGor;
