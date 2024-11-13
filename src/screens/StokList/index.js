import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
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
import debounce from 'lodash.debounce';
import { useAuthDefault } from '../../components/DefaultUser';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const StokList = ({navigation}) => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
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
  const searchTimeoutRef = useRef(null);

  const pickerItems = [
    { label: 'Stok Adı', value: 'Stok_Ad', tip: 1 },
    { label: 'Stok Kodu', value: 'Stok_Kod', tip: 2 },
    { label: 'Marka', value: 'Marka', tip: 3 },
    { label: 'Alt Grup', value: 'AltGrup', tip: 4 },
    { label: 'Ana Grup', value: 'AnaGrup', tip: 5 },
    { label: 'Reyon', value: 'Reyon', tip: 6 },
    { label: 'Barkod', value: 'Barkod', tip: 7 },
  ];

  const getTipForValue = (value) => {
    const selectedItem = pickerItems.find((item) => item.value === value);
    return selectedItem ? selectedItem.tip : 1;
  };

  const fetchProductData = async (term, criteria) => {
    setLoading(true);
    try {
      const tip = getTipForValue(criteria);
      const response = await axiosLinkMain.get(`/Api/Stok/StokListesi?deger=${term}&tip=${tip}&depo=${defaults[0].IQ_CikisDepoNo}`);
      setData(response.data);
    } catch (err) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTermChange = (text) => {
    setSearchTerm(text);

    // Eğer daha önceki timeout varsa, onu temizle
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Yeni bir timeout ayarla
    searchTimeoutRef.current = setTimeout(() => {
      fetchProductData(text, searchCriteria); // Gecikmeli API çağrısı
    }, 500); // 30 salise sonra API çağrısı yapılacak
  };

  useEffect(() => {
    fetchProductData(searchTerm, ); // TextInput'a yazıldıkça arama yap
  }, []);

 


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
                  {pickerItems.find(item => item.value === searchCriteria)?.label || 'Kriter Seçin'}
                </Text>
              </TouchableOpacity>
              <Modal visible={isModalVisible} animationType="slide" transparent>
                <View style={MainStyles.modalContainerPicker}>
                  <View style={MainStyles.modalContentPicker}>
                    <Picker
                      selectedValue={searchCriteria}
                      onValueChange={(itemValue) => setSearchCriteria(itemValue)}
                    >
                      {pickerItems.map((item) => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} style={MainStyles.textStyle} />
                      ))}
                    </Picker>
                    <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Picker
              selectedValue={searchCriteria}
              onValueChange={(itemValue) => setSearchCriteria(itemValue)}
              itemStyle={{ height: 40, fontSize: 12 }}
              style={{ marginHorizontal: -10 }}
            >
              {pickerItems.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} style={MainStyles.textStyle} />
              ))}
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
          onChangeText={handleSearchTermChange}
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
        keyExtractor={(item) => item.Stok_Kod.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text style={MainStyles.emptyText}>Arama sonucuna uygun veri bulunamadı</Text>}
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
