import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
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
import Button from '../components/Button';
import { useAuthDefault } from '../components/DefaultUser';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const DepolarArasiProductList = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { addedProducts, setAddedProducts } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState('Stok Ad');
  const [markaOptions, setMarkaOptions] = useState([]);
  const [selectedMarka, setSelectedMarka] = useState('');
  const [stokAdOptions, setStokAdOptions] = useState([]);
  const [stokKodOptions, setStokKodOptions] = useState([]);
  const [altGrupOptions, setAltGrupOptions] = useState([]);
  const [anaGrupOptions, setAnaGrupOptions] = useState([]);
  const [reyonOptions, setReyonOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stokListesi, setStokListesi] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchTimeoutRef = useRef(null);

  const pickerItems = [
    { label: 'Stok Adı', value: 'Stok Ad', tip: 1 },
    { label: 'Stok Kodu', value: 'Stok Kod', tip: 2 },
    { label: 'Marka', value: 'Marka', tip: 3 },
    { label: 'Alt Grup', value: 'AltGrup', tip: 4 },
    { label: 'Ana Grup', value: 'AnaGrup', tip: 5 },
    { label: 'Reyon', value: 'Reyon', tip: 6 },
    { label: 'Barkod', value: 'Barkod', tip: 7 },
  ];

  // Function to get label based on selected value
  const getTipForValue = (value) => {
    const selectedItem = pickerItems.find((item) => item.value === value);
    return selectedItem ? selectedItem.tip : 1;
  };


  const fetchProductData = useCallback(
    async (searchTerm = '', searchCriteria = 'Stok Ad') => {
      try {
        const deger = searchTerm || ''; // TextInput'a yazılan değer, boşsa boş olarak gönderilecek
        const tip = getTipForValue(searchCriteria);
  
        const response = await axiosLinkMain.get(
          `/Api/Stok/StokListesiV2?deger=${deger}&tip=${tip}&depo=${defaults[0].IQ_CikisDepoNo}`
        );
  
        const data = response.data;
  
        // Gelen veriyi filteredData formatına dönüştürme
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
          BekleyenSiparis: item.BekleyenSiparis,
          Vade: item.Vade,
        }));
  
        setData(filteredData); // filteredData'yı setData ile ayarlayın
  
        // StokVade ve BekleyenSiparis değerlerini kontrol et
        const stokVadeValue = filteredData.find((item) => item.Vade)?.Vade;
  
        // Vade değerini sadece stok listesi verisi varsa güncelle
        if (stokVadeValue && stokVadeValue !== '0') {
          updatealinanSiparis({
            StokVade: stokVadeValue,
          });
        }
      } catch (err) {
        Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    },
    []
  );

  const handleSearchTermChange = (text) => {
    setSearchTerm(text);
  
    // Eğer daha önceki timeout varsa, onu temizle
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  
    // Yeni bir timeout ayarla
    searchTimeoutRef.current = setTimeout(() => {
      fetchProductData(text, searchCriteria); // Gecikmeli API çağrısı
    }, 500); // 500 ms sonra API çağrısı yapılacak
  };
 
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

  useEffect(() => {
    fetchProductData(searchTerm); // TextInput'a yazıldıkça arama yap
  }, []);

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
          <Text style={MainStyles.itemTextPL}>{item.Depo1Miktar}</Text>
          <Text style={MainStyles.itemTextPL}>{item.Depo2Miktar}</Text>
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
        {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
            {searchCriteria}
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
                  <Picker.Item label="Stok Adı" value="Stok Ad" style={MainStyles.textStyle} />
                  <Picker.Item label="Stok Kodu" value="Stok Kod" style={MainStyles.textStyle} />
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
          <Picker.Item label="Stok Adı" value="Stok Ad" style={MainStyles.textStyle} />
          <Picker.Item label="Stok Kodu" value="Stok Kod" style={MainStyles.textStyle} />
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
