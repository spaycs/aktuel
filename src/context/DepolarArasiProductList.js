import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image, Modal } from 'react-native';
import { MainStyles } from '../res/style';
import axiosLinkMain from '../utils/axiosMain';
import { ProductContext } from '../context/ProductContext';
import { useAuth } from '../components/userDetail/Id';
import ProductModal from '../context/ProductModal';
import { colors } from '../res/colors';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import DepolarArasiProductModal from './DepolarArasiProductModal';
import { RNCamera } from 'react-native-camera';
import { Camera, Nokta, Down } from '../res/images';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const DepolarArasiProductList = () => {
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
  const [stokListesi, setStokListesi] = useState([]);

  const fetchProductData = useCallback(async (searchTerm = '', searchCriteria = 'Stok_Ad', marka = '') => {
    try {
      let response;
  
      // Eğer barkod araması yapılıyorsa barkod API'sine gidiyoruz
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
          sth_vergi: item.Vergi,
          Birim: item.Birim,
          Marka: item.Marka,
          AltGrup: item.AltGrup,
          AnaGrup: item.AnaGrup,
          Reyon: item.Reyon,
        }));
  
        setData(filteredData);
      } else {
        // Bellekteki stok listesinden arama yap
        const normalizedSearchTerm = normalizeText(searchTerm).toLowerCase().split(' ');
  
        const filteredData = stokListesi // stokListesi, bellekte tutulan stok verisi
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
            sth_vergi: item.Vergi,
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
  }, [stokListesi]);

  // Stok listesini API'den çek ve belleğe al
  const fetchStokListesi = useCallback(async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Stok/StokListesi');
      const data = response.data;
  
      setStokListesi(data); // stokListesi belleğe alındı
  
      // Aynı zamanda filtre seçeneklerini de oluşturuyoruz
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
    } catch (err) {
      Alert.alert('Hata', 'Stok verileri yüklenirken bir hata oluştu.');
    }
  }, []);
  
  useEffect(() => {
    fetchStokListesi(); // Uygulama başlarken stok listesini bir kez API'den çek
  }, [fetchStokListesi]);
  
  useEffect(() => {
    fetchProductData(searchTerm, searchCriteria, selectedMarka); // TextInput'a yazıldıkça arama yap
  }, [searchTerm, searchCriteria, selectedMarka, fetchProductData]);

 
  const handleItemClick = (item) => {
    const existingProductCount = addedProducts.filter(product => product.Stok_Kod === item.Stok_Kod).length;

    if (existingProductCount >= 2) {
      Alert.alert('Uyarı', 'Bu ürün zaten 2 kez eklenmiştir, daha fazla ekleyemezsiniz.');
      return;
    }

    setSelectedProduct(item);
    setModalVisible(true);
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
    <TouchableOpacity onPress={() => handleItemClick(item)} style={MainStyles.itemContainerPL}>
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

  return (
    <View style={MainStyles.container}>
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

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.Stok_Kod}
      />

      <DepolarArasiProductModal
        selectedProduct={selectedProduct}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAddedProducts={setAddedProducts}
      />
    </View>
  );
};

export default DepolarArasiProductList;
