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
import SatinAlmaTalepFisiProductModal from './SatinAlmaTalepFisiProductModal';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const SatinAlmaTalepFisiProductList = () => {
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
    { label: 'Masraf', value: 'Masraf', tip: 8 },
    { label: 'Hizmet', value: 'Hizmet', tip: 9 },
    { label: 'Demirbas', value: 'Demirbas', tip: 10 },
  ];

  const getTipForValue = (value) => {
    const selectedItem = pickerItems.find((item) => item.value === value);
    return selectedItem ? selectedItem.tip : 1;
  };

  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      const tip = getTipForValue(searchCriteria);
      const depo = defaults[0]?.IQ_CikisDepoNo || '';

      const url = `/Api/Stok/StokListesiEvraklarV2?cari=&deger=${searchTerm}&tip=${tip}&depo=${depo}&iskcaridengelsin=${defaults[0]?.IQ_OPCaridenGelsin}`;
      console.log(url);
      const response = await axiosLinkMain.get(url);

      const data = response.data || [];
      const filtered = data.map(item => ({
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
        HareketTipi: item.HareketTipi, // Yeni eklendi
      }));

      setFilteredData(filtered);
    } catch (err) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [searchCriteria, searchTerm, defaults, faturaBilgileri]);
  

  const handlePickerChange = (itemValue) => {
    setSearchCriteria(itemValue);
    fetchProductData(); // Kriter değişince API çağrısı yap
  };
  
  const handleItemClick = (item) => {
    const existingProductCount = addedProducts.filter(product => product.Stok_Kod === item.Stok_Kod).length;
  
    // HareketTipi değerini modalId olarak doğrudan kullanıyoruz
    const modalId = item.HareketTipi;
  
    setSelectedProduct({
      ...item,
      sth_vergi_pntr: item.sth_vergi_pntr, // Değeri ekliyoruz
      modalId, // HareketTipi'ni modalId olarak ekliyoruz
    });
  
      setModalVisible(true); // Özel modal göster
    
  };
  

 

  useEffect(() => {
    // Eğer daha önce bir timeout varsa, onu temizler
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  
    // Yeni bir timeout ayarla
    searchTimeoutRef.current = setTimeout(() => {
      fetchProductData(searchTerm); // `searchTerm` dolu ya da boş olabilir
    }, 2200); // 500 ms sonra çalıştır
  
    return () => {
      clearTimeout(searchTimeoutRef.current); // Cleanup
    };
  }, [searchTerm]); // Sadece searchTerm değiştiğinde tetiklenir
  
  const handleSearchTermChange = (text) => {
    setSearchTerm(text); // TextInput değişiminde `searchTerm` state'ini günceller
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
    fetchProductData();
  }, [searchCriteria]); 
  

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
                  <Picker.Item label="Demirbas" value="Demirbas" style={MainStyles.textStyle}  />
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
          <Picker.Item label="Demirbas" value="Demirbas" style={MainStyles.textStyle}  />
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
      <SatinAlmaTalepFisiProductModal
        selectedProduct={selectedProduct}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAddedProducts={setAddedProducts}
        modalId={selectedProduct?.modalId }
      />
    </View>
  );
};


export default SatinAlmaTalepFisiProductList;
