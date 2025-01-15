import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image, Modal, } from 'react-native';
import { MainStyles } from '../res/style';
import axiosLinkMain from '../utils/axiosMain';
import { ProductContext } from '../context/ProductContext';
import { useAuth } from '../components/userDetail/Id';
import ProductModal from '../context/ProductModal';
import { colors } from '../res/colors';
import { Picker } from '@react-native-picker/picker';
import { RNCamera } from 'react-native-camera';
import { Camera, Nokta } from '../res/images';
import Button from '../components/Button';
import AlinanSiparisProductModal from './AlinanSiparisProductModal';
import { useAuthDefault } from '../components/DefaultUser';
import FastImage from 'react-native-fast-image';

const AlinanSiparisProductList = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { addedAlinanSiparisProducts, setAddedAlinanSiparisProducts, alinanSiparis, setAlinanSiparis } = useContext(ProductContext);
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
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Arama kriterleri için seçenekler tanımlanıyor.
  const pickerItems = [
    { label: 'Stok Adı', value: 'Stok Ad', tip: 1 },
    { label: 'Stok Kodu', value: 'Stok Kod', tip: 2 },
    { label: 'Marka', value: 'Marka', tip: 3 },
    { label: 'Alt Grup', value: 'AltGrup', tip: 4 },
    { label: 'Ana Grup', value: 'AnaGrup', tip: 5 },
    { label: 'Reyon', value: 'Reyon', tip: 6 },
    { label: 'Barkod', value: 'Barkod', tip: 7 },
  ];

  // Arama kriterine göre tip değeri belirleniyor.
  const getTipForValue = (value) => {
    const selectedItem = pickerItems.find((item) => item.value === value);
    return selectedItem ? selectedItem.tip : 1;
  };

  // Ürün verisi API'den çekiliyor.
  const fetchProductData = useCallback(
    async (searchTerm = '', searchCriteria = 'Stok Ad') => {
      setLoading(true);
      try {
        const deger = searchTerm || ''; 
        const tip = getTipForValue(searchCriteria);
        const response = await axiosLinkMain.get(
          `/Api/Stok/StokListesiEvraklar?cari=${alinanSiparis.sip_musteri_kod}&deger=${deger}&tip=${tip}&depo=${defaults[0].IQ_CikisDepoNo}&iskcaridengelsin=${defaults[0].IQ_OPCaridenGelsin}`
        );
        
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
          BekleyenSiparis: item.BekleyenSiparis,
          Vade: item.Vade,
          Depo: item.Depo,
        }));
  
        setData(filteredData); 
  
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
      }finally {
        setLoading(false);
      }
    },
    [alinanSiparis.sip_musteri_kod, updatealinanSiparis]
  );
  
  const updatealinanSiparis = useCallback((newValues) => {
    setAlinanSiparis(prev => ({
      ...prev,
      ...newValues,
    }));
  }, [setAlinanSiparis]);
  
  // Arama terimi değiştiğinde API çağrısı yapılır.
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

  useEffect(() => {
    fetchProductData();
  }, [searchCriteria]); 

  // Ürün detayları çekilir.
  const fetchStockDetails = useCallback(async (productCode) => {
    try {
      const response = await axiosLinkMain.get(
        `/Api/Stok/StokListesiEvraklar?cari=${alinanSiparis.sip_musteri_kod}&deger=${productCode}&tip=${getTipForValue(searchCriteria)}&depo=${defaults[0].IQ_CikisDepoNo}&iskcaridengelsin=${defaults[0].IQ_OPCaridenGelsin}`
      );
      const stokData = response.data;
  
      // Gelen veriler arasında productCode ile eşleşeni bul
      const selectedProduct = stokData.find((item) => item.Stok_Kod === productCode);
  
      if (selectedProduct) {
        const vade = selectedProduct.Vade; // Vade değerini al
        return vade; // Vade değerini döndür
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
      Alert.alert('Hata', 'Stok detayları yüklenirken bir hata oluştu.');
      return null;
    }
  }, [alinanSiparis.sip_musteri_kod, defaults, searchCriteria]);
  
  // Ürün seçildiğinde detay modalı açılır.
  const handleItemClick = async (item) => {
    if (!alinanSiparis.sip_musteri_kod) {
      Alert.alert('Hata', 'İlk önce cari seçimi yapmalısınız.');
      return;
    }

    // Stok detaylarını getir ve Vade bilgisini al
    const vade = await fetchStockDetails(item.Stok_Kod);

    if (vade !== null) {
      // Ürün listesinde güncelleme yap
      setAddedAlinanSiparisProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.Stok_Kod === item.Stok_Kod
            ? { ...product, StokVade: vade } // StokVade'yi güncelle
            : product // Diğer ürünleri aynı bırak
        )
      );

      console.log(`Updated product with StokVade: ${vade}`);
    } else {
      console.warn(`Vade bilgisi alınamadı: ${item.Stok_Kod}`);
    }

    // Modalı aç ve seçilen ürünü ayarla
    setSelectedProduct(item);
    setModalVisible(true);
  };

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
  
  // Ürün listesi render edili ekranda görüntülenir
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
          <Text style={MainStyles.itemTextPL}>BekleyenSiparis: {item.BekleyenSiparis}</Text>
          <Text style={MainStyles.itemTextPL}>Vade: {item.Vade}</Text>
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
    <View style={MainStyles.irsaliyeContainer}>

      {/* Üst Alan - Arama Kriteri Seçimi */}
      <View style={MainStyles.pageTop}>
        <View style={MainStyles.inputStyle}>
        {Platform.OS === 'ios' ? (
        <>
          {/* iOS için Arama Kriteri Seçimi (Modal içinde) */}
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

      {/* Ürün Arama Alanı */}
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

      {/* Barkod Okuma Kamerası */}
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
        <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Stok_Kod}-${index}`}
        />
      </>
      )}

      <AlinanSiparisProductModal
        selectedProduct={selectedProduct}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAddedAlinanSiparisProducts={setAddedAlinanSiparisProducts}
      />
    </View>
  );
};

export default AlinanSiparisProductList;
