import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { MainStyles } from '../../res/style';
import axiosLinkMain from '../../utils/axiosMain';
import { ProductContext } from '../../context/ProductContext';
import { useAuth } from '../../components/userDetail/Id';
import ProductModal from '../../context/ProductModal';
import { colors } from '../../res/colors';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { RNCamera } from 'react-native-camera';
import { Camera, Nokta, Down } from '../../res/images';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const StokList = ({navigation}) => {
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
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const pickerItems = [
    { label: 'Stok Adı', value: 'Stok_Ad' },
    { label: 'Stok Kodu', value: 'Stok_Kod' },
    { label: 'Marka', value: 'Marka' },
    { label: 'Alt Grup', value: 'AltGrup' },
    { label: 'Ana Grup', value: 'AnaGrup' },
    { label: 'Reyon', value: 'Reyon' },
    { label: 'Barkod', value: 'Barkod' },
  ];

  // Function to get label based on selected value
  const getLabelForValue = (value) => {
    const selectedItem = pickerItems.find((item) => item.value === value);
    return selectedItem ? selectedItem.label : 'Kriter Seçin';
  };


  const fetchProductData = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await axiosLinkMain.get('/Api/Stok/StokListesi');
      const data = response.data;

      // Save all data to state
      setAllData(data);

      const filteredData = data.map(item => ({
        Stok_Ad: item.Stok_Ad,
        Stok_Kod: item.Stok_Kod,
        Liste_Fiyatı: item.Liste_Fiyatı,
        Depodaki_Miktar: item.Depodaki_Miktar,
        Depo1Miktar: item.Depo1Miktar,
        Depo2Miktar: item.Depo2Miktar,
        Vergi: item.Vergi,
        Doviz: item.Doviz,
        Birim: item.Birim,
        Marka: item.Marka,
        AltGrup: item.AltGrup,
        AnaGrup: item.AnaGrup,
        Reyon: item.Reyon,
      }));

      setData(filteredData);
    } catch (err) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false); // Stop loading
    }
  }, []);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const filterData = async () => {
    const normalizedSearchTerm = normalizeText(searchTerm).toLowerCase().split(' ');
  
    if (searchCriteria === 'Barkod') {
      // Barkod araması için API çağrısı yap
      try {
        const response = await axiosLinkMain.get(`/Api/Barkod/BarkodAra?barkod=${searchTerm}`);
        const data = response.data;
  
        setData(data);
      } catch (err) {
        Alert.alert('Hata', 'Barkod ile ürün bulma sırasında hata oluştu.');
      }
    } else {
      const filteredData = allData.filter(item => {
        const normalizedItemText = normalizeText(item[searchCriteria] || '').toLowerCase();
        return normalizedSearchTerm.every(term => normalizedItemText.includes(term));
      });
  
      setData(filteredData);
    }
  };
  
  useEffect(() => {
    filterData(); 
  }, [searchTerm]);

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
    fetchProductData(); // Barkodla birlikte tüm ürünleri getir
  };

   const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={MainStyles.itemContainerPL}>
      <View style={MainStyles.itemContentPL}>
      <View style={MainStyles.itemHeaderPL}>
        <Text style={MainStyles.headerTextPL}>Stok Kodu: {item.Stok_Kod}</Text>
        <Text style={MainStyles.headerTextPL2}>
        <Nokta /> Liste Fiyatı: {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.Liste_Fiyatı)}
        </Text>
      </View>
      <View style={MainStyles.itemStokPL}>
      <Text style={MainStyles.itemTitlePL}>{item.Stok_Ad}</Text>
      <Text style={MainStyles.itemSubTitlePL}>Marka: {item.Marka}</Text>
      <Text style={MainStyles.itemSubTitlePL}>Miktar: {item.Depodaki_Miktar}</Text>
      </View>
      {/* Detay alanları */}
      <View style={MainStyles.itemContainerDetailPL}>
        <View style={MainStyles.leftDetails}>
          <Text style={MainStyles.itemTextPL}>Birim: {item.Birim}</Text>
          <Text style={MainStyles.itemTextPL}>Depo 1 Miktar: {item.Depo1Miktar}</Text>
          <Text style={MainStyles.itemTextPL}>Depo 2 Miktar: {item.Depo2Miktar}</Text>
        </View>
        <View style={MainStyles.rightDetails}>
          <Text style={MainStyles.itemTextPL}>Vergi: {item.sth_vergi}</Text>
          <Text style={MainStyles.itemTextPL}>Ana Grup: {item.AnaGrup}</Text>
          <Text style={MainStyles.itemTextPL}>Alt Grup: {item.AltGrup}</Text>
          <Text style={MainStyles.itemTextPL}>Reyon: {item.Reyon}</Text>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );

  const navigateToStokHareketFoyu = () => {
    if (selectedItem) {
      navigation.navigate('StokHareketFoyu', { Stok_Kod: selectedItem.Stok_Kod });
    } else {
      Alert.alert('Hata', 'Stok seçimi yapılmadı.');
    }
  };
  

  return (
    <View style={MainStyles.slContainer}>
      <View style={MainStyles.pageTop}>
        <View style={MainStyles.inputStyle}>
        {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
            {getLabelForValue(searchCriteria)}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal */}
          <Modal visible={isModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={searchCriteria}
                  onValueChange={(itemValue) => {
                    setSearchCriteria(itemValue);
                  }}
                >
                  <Picker.Item label="Stok Adı" value="Stok_Ad" style={MainStyles.textStyle} />
                  <Picker.Item label="Stok Kodu" value="Stok_Kod" style={MainStyles.textStyle} />
                  <Picker.Item label="Marka" value="Marka" style={MainStyles.textStyle} />
                  <Picker.Item label="Alt Grup" value="AltGrup" style={MainStyles.textStyle} />
                  <Picker.Item label="Ana Grup" value="AnaGrup" style={MainStyles.textStyle} />
                  <Picker.Item label="Reyon" value="Reyon" style={MainStyles.textStyle} />
                  <Picker.Item label="Barkod" value="Barkod" style={MainStyles.textStyle} />
                </Picker>
                <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android Picker renders directly without modal
        <Picker
          selectedValue={searchCriteria}
          onValueChange={(itemValue) => setSearchCriteria(itemValue)}
          itemStyle={{ height: 40, fontSize: 12 }}
          style={{ marginHorizontal: -10 }}
        >
          <Picker.Item label="Stok Adı" value="Stok_Ad" style={MainStyles.textStyle} />
          <Picker.Item label="Stok Kodu" value="Stok_Kod" style={MainStyles.textStyle} />
          <Picker.Item label="Marka" value="Marka" style={MainStyles.textStyle} />
          <Picker.Item label="Alt Grup" value="AltGrup" style={MainStyles.textStyle} />
          <Picker.Item label="Ana Grup" value="AnaGrup" style={MainStyles.textStyle} />
          <Picker.Item label="Reyon" value="Reyon" style={MainStyles.textStyle} />
          <Picker.Item label="Barkod" value="Barkod" style={MainStyles.textStyle} />
        </Picker>
      )}
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

      {loading ? ( // Show loading indicator if loading
       <FastImage
        style={MainStyles.loadingGif}
        source={require('../../res/images/image/pageloading.gif')}
        resizeMode={FastImage.resizeMode.contain}
     />
      ) : (
        <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.Stok_Kod}
      />
      </>
      )}

      
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={MainStyles.modalCariContainer}>
              <View style={MainStyles.modalCariContent}>
                <View style={MainStyles.buttonCariModalDetail}>
                  <Text style={MainStyles.buttonCariTitle}>Hızlı Erişim</Text>
                </View>
                <TouchableOpacity style={MainStyles.buttonCariModalDetail} onPress={navigateToStokHareketFoyu}>
                  <Text style={MainStyles.cariButtonText}>Stok Hareket Föyü</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={MainStyles.buttonCariModalDetail}>
                  <Text style={MainStyles.buttonTextKapat}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
     
    </View>
  );
};

export default StokList;
