import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image, Modal } from 'react-native';
import { MainStyles } from '../res/style';
import axiosLinkMain from '../utils/axiosMain';
import { ProductContext } from '../context/ProductContext';
import { useAuth } from '../components/userDetail/Id';
import ProductModal from '../context/ProductModal';
import SatisFaturasiProductModal from '../context/SatisFaturasiProductModal';
import { colors } from '../res/colors';
import { Picker } from '@react-native-picker/picker';
import { RNCamera } from 'react-native-camera';
import { Camera, Nokta } from '../res/images';
import FastImage from 'react-native-fast-image';
import Button from '../components/Button';
import { useAuthDefault } from '../components/DefaultUser';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const SatisFaturasiProductList = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { addedProducts, setAddedProducts, faturaBilgileri } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false); // Yeni state
  const [searchCriteria, setSearchCriteria] = useState('Stok_Ad');
  const [markaOptions, setMarkaOptions] = useState([]);
  const [selectedMarka, setSelectedMarka] = useState('');
  const [stokAdOptions, setStokAdOptions] = useState([]);
  const [stokKodOptions, setStokKodOptions] = useState([]);
  const [altGrupOptions, setAltGrupOptions] = useState([]);
  const [anaGrupOptions, setAnaGrupOptions] = useState([]);
  const [reyonOptions, setReyonOptions] = useState([]);
  const [loading, setLoading] = useState(false); 

  const [stokListData, setStokListData] = useState([]); // Stok Listesi verisi
  const [hizmetData, setHizmetData] = useState([]); // Hizmet verisi
  const [masrafData, setMasrafData] = useState([]); // Masraf verisi
  const [barkodData, setBarkodData] = useState([]); // Barkod verisi
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veriler
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
    { label: 'Hizmet', value: 'Hizmet', tip: 8 },
    { label: 'Masraf', value: 'Masraf', tip: 9 },
  ];

  const getTipForValue = (value) => {
    const selectedItem = pickerItems.find((item) => item.value === value);
    return selectedItem ? selectedItem.tip : 1;
  };

  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      let url;
      // Seçilen kritere göre API URL'si belirleniyor
      const tip = getTipForValue(searchCriteria);
      const depo = defaults[0].IQ_CikisDepoNo;
  
      if (tip >= 1 && tip <= 7) {
        // Tip 1-7: StokListesiEvraklar API'si
        url = `/Api/Stok/StokListesiEvraklar?cari=${faturaBilgileri.sip_musteri_kod}&deger=${searchTerm}&tip=${tip}&depo=${depo}&iskcaridengelsin=${defaults[0].IQ_OPCaridenGelsin}`;
        console.log('url', url)
      } else if (tip === 8) {
        // Tip 8: HizmetHesaplari API'si
        url = '/Api/Stok/HizmetHesaplari';
      } else if (tip === 9) {
        // Tip 9: MasrafHesaplari API'si
        url = '/Api/Stok/MasrafHesaplari';
      }
  
      if (url) {
        const response = await axiosLinkMain.get(url);
        const data = response.data;
  
        // Filtreleme ve gösterim mantığı
        let dataToFilter = [];
  
        if (tip === 8) {
          dataToFilter = hizmetData.length > 0 ? hizmetData : data;
          setHizmetData(dataToFilter); // Hizmet verisini kaydediyoruz
        } else if (tip === 9) {
          dataToFilter = masrafData.length > 0 ? masrafData : data;
          setMasrafData(dataToFilter); // Masraf verisini kaydediyoruz
        } else {
          dataToFilter = stokListData.length > 0 ? stokListData : data;
          setStokListData(dataToFilter); // Stok verisini kaydediyoruz
        }
  
        // Gelen veriyi filtreleyip düzenleme
        const normalizedSearchTerm = normalizeText(searchTerm).toLowerCase().split(' ');
        const filteredData = dataToFilter
          .filter(item => {
            const normalizedItemText = normalizeText(item.Isim || item[searchCriteria] || '').toLowerCase();
            const matchesSearchTerm = normalizedSearchTerm.every(term => normalizedItemText.includes(term));
            const matchesMarka = selectedMarka ? item.Marka === selectedMarka : true;
            return matchesSearchTerm && matchesMarka;
          })
          .map(item => ({
            Stok_Ad: item.Stok_Ad || item.Isim,
            Stok_Kod: item.Stok_Kod || item.Kod,
            sth_vergi: item.Vergi,
            sth_vergi_pntr: item.Vergipntr,
            Liste_Fiyatı: item.Liste_Fiyatı,
            Birim: item.Birim,
            Marka: item.Marka,
            AltGrup: item.AltGrup,
            AnaGrup: item.AnaGrup,
            Reyon: item.Reyon,
          }));
  
        // Filtrelenmiş veriyi ekrana gösterim için ayarla
        setFilteredData(filteredData);
      }
    } catch (err) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [searchCriteria, searchTerm, selectedMarka, hizmetData, masrafData, stokListData]);
  

  const handlePickerChange = (itemValue) => {
    setSearchCriteria(itemValue);
    fetchProductData(); // Kriter değişince API çağrısı yap
  };
  
  useEffect(() => {
    // Picker'dan yeni bir değer seçildiğinde veya ilk yüklemede fetchProductData çalıştırılır
    fetchProductData();
  }, [fetchProductData, searchCriteria]);

  const handleItemClick = (item) => {
    const existingProductCount = addedProducts.filter(product => product.Stok_Kod === item.Stok_Kod).length;

    let modalId;
    if (searchCriteria === 'Hizmet') {
      modalId = 1;
    } else if (searchCriteria === 'Masraf') {
      modalId = 2;
    } else {
      modalId = 0;
    }

    setSelectedProduct({
      ...item,
      sth_vergi_pntr: item.sth_vergi_pntr, // Değeri ekliyoruz
    });

    setSelectedProduct(item);

    if (searchCriteria === 'Hizmet' || searchCriteria === 'Masraf') {
      setModalVisible(true); // SatisFaturasiProductModal göster
    } else {
      setProductModalVisible(true); // ProductModal göster
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
    }, 500); // 500 ms sonra API çağrısı yapılacak
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



  const renderItem = ({ item }) => {
    const isHizmetOrMasraf = searchCriteria === 'Hizmet' || searchCriteria === 'Masraf'; // Picker kontrolü
  
    return (
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
  };
  

  return (
    <View style={MainStyles.irsaliyeContainer}>
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
                  <Picker.Item label="Stok Adı" value="Stok_Ad" style={MainStyles.textStyle} />
                  <Picker.Item label="Stok Kodu" value="Stok_Kod" style={MainStyles.textStyle} />
                  <Picker.Item label="Marka" value="Marka" style={MainStyles.textStyle} />
                  <Picker.Item label="Alt Grup" value="AltGrup" style={MainStyles.textStyle} />
                  <Picker.Item label="Ana Grup" value="AnaGrup" style={MainStyles.textStyle} />
                  <Picker.Item label="Reyon" value="Reyon" style={MainStyles.textStyle} />
                  <Picker.Item label="Barkod" value="Barkod" style={MainStyles.textStyle} />
                  <Picker.Item label="Hizmet" value="Hizmet" style={MainStyles.textStyle}  />
                  <Picker.Item label="Masraf" value="Masraf" style={MainStyles.textStyle}  />
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
          <Picker.Item label="Hizmet" value="Hizmet" style={MainStyles.textStyle}  />
          <Picker.Item label="Masraf" value="Masraf" style={MainStyles.textStyle}  />
        </Picker>
      )}
        </View>
      </View>
      <View style={MainStyles.inputContainer}>
      <TextInput
        style={MainStyles.slinputUrunAra}
         placeholder="Ürün kodu veya adı ile ara"
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
      
      {loading ? (
            <FastImage
              style={MainStyles.loadingGif}
              source={require('../res/images/image/pageloading.gif')}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item.Stok_Kod}-${index}`} // index ile birleştirerek benzersiz key sağlıyoruz
            renderItem={renderItem}
            contentContainerStyle={MainStyles.listContainer}
          />
          
          )}
      <ProductModal
        selectedProduct={selectedProduct}
        modalVisible={productModalVisible}
        setModalVisible={setProductModalVisible}
        setAddedProducts={setAddedProducts}
      />

      <SatisFaturasiProductModal
        selectedProduct={selectedProduct}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAddedProducts={setAddedProducts}
        modalId={searchCriteria === 'Hizmet' ? 1 : searchCriteria === 'Masraf' ? 2 : 0}
      />
    </View>
  );
};

export default SatisFaturasiProductList;