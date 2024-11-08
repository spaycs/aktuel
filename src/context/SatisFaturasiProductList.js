import React, { useState, useCallback, useContext, useEffect } from 'react';
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

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const SatisFaturasiProductList = () => {
  const { authData } = useAuth();
  const { addedProducts, setAddedProducts } = useContext(ProductContext);
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

  const pickerItems = [
    { label: 'Stok Adı', value: 'Stok_Ad' },
    { label: 'Stok Kodu', value: 'Stok_Kod' },
    { label: 'Marka', value: 'Marka' },
    { label: 'Alt Grup', value: 'AltGrup' },
    { label: 'Ana Grup', value: 'AnaGrup' },
    { label: 'Reyon', value: 'Reyon' },
    { label: 'Barkod', value: 'Barkod' },
    { label: 'Hizmet', value: 'Hizmet' },
    { label: 'Masraf', value: 'Masraf' },
  ];

  // Function to get label based on selected value
  const getLabelForValue = (value) => {
    const selectedItem = pickerItems.find((item) => item.value === value);
    return selectedItem ? selectedItem.label : 'Kriter Seçin';
  };

  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      let url;
  
      // Seçilen kritere göre API URL'si belirleniyor
      if (searchCriteria === 'Hizmet' && hizmetData.length === 0) {
        url = '/Api/Stok/HizmetHesaplari';
      } else if (searchCriteria === 'Masraf' && masrafData.length === 0) {
        url = '/Api/Stok/MasrafHesaplari';
      } else if (searchCriteria === 'Barkod') {
        // Barkod API'si her seferinde çağrılacak ve searchTerm ile sorgu yapılacak
        url = `/Api/Barkod/BarkodAra?barkod=${searchTerm}`;
      } else if (stokListData.length === 0) {
        url = '/Api/Stok/StokListesi';
      }
  
      if (url) {
        const response = await axiosLinkMain.get(url);
        const data = response.data;
  
        // Gelen veriyi ilgili state'e atıyoruz
        if (searchCriteria === 'Hizmet') {
          setHizmetData(data);
        } else if (searchCriteria === 'Masraf') {
          setMasrafData(data);
        } else if (searchCriteria === 'Barkod') {
          // Barkod verisi her seferinde API'den alınacak
          setBarkodData(data);
          // Barkod verisi doğrudan kullanılacak, filtreleme yapmadan
          setFilteredData(data);
          setLoading(false);  // Barkod için geri dönüş sağlanmışsa işlem tamam
          return;
        } else {
          setStokListData(data);
        }
      }
  
      // Diğer kriterler için veri çekildikten sonra filtreleme işlemi yapılıyor
      let dataToFilter = [];
      if (searchCriteria === 'Hizmet') {
        dataToFilter = hizmetData.length > 0 ? hizmetData : data;
      } else if (searchCriteria === 'Masraf') {
        dataToFilter = masrafData.length > 0 ? masrafData : data;
      } else if (searchCriteria !== 'Barkod') {
        dataToFilter = stokListData.length > 0 ? stokListData : data;
      }
  
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
  
      setFilteredData(filteredData);
    } catch (err) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [searchCriteria, searchTerm, selectedMarka, hizmetData, masrafData, stokListData]);

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
    if (searchCriteria === 'Barkod') {
      // Barkod araması sırasında her seferinde API çağrısı yapılacak
      fetchProductData();
    }
  };

  useEffect(() => {
    if (searchCriteria !== 'Barkod') {
      fetchProductData();
    }
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

  const handlePickerChange = (itemValue) => {
    setSearchCriteria(itemValue);
    fetchProductData(searchTerm, itemValue, selectedMarka); // Yeni kriterle API'yi çağır
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
