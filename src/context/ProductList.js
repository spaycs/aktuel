import React, { useState, useCallback, useEffect, useContext } from 'react';
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

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const ProductList = () => {
  const { authData } = useAuth();
  const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
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
          BekleyenSiparis: item.BekleyenSiparis,
          Vade: item.Vade,
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
            BekleyenSiparis: item.BekleyenSiparis,
            Vade: item.Vade,
          }));
  
        setData(filteredData);
      }
    } catch (err) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, [stokListesi]);
  const updateFaturaBilgileri = useCallback((newValues) => {
    setFaturaBilgileri(prev => ({
      ...prev,
      ...newValues,
    }));
  }, [setFaturaBilgileri]);
  // Stok listesini API'den çek ve belleğe al
  const fetchStokListesi = useCallback(async () => {
    if (!faturaBilgileri.sip_musteri_kod) return; // Müşteri kodu olmadan isteği yapma
  
    try {
      const response = await axiosLinkMain.get(
        `/Api/Stok/StokListesiEvraklar?cari=${faturaBilgileri.sip_musteri_kod}`
      );
  
      const data = response.data;
      setStokListesi(data);
  
      // StokVade ve BekleyenSiparis değerlerini kontrol et
      const stokVadeValue = data.find(item => item.Vade !== undefined)?.Vade;
      const bekleyenSiparisValue = data.find(item => item.BekleyenSiparis !== undefined)
        ? data.find(item => item.BekleyenSiparis !== undefined).BekleyenSiparis
        : 0; // Varsayılan değer olarak 0 atandı
  
      updateFaturaBilgileri({
        StokVade: stokVadeValue && stokVadeValue !== "0" ? stokVadeValue : faturaBilgileri.StokVade,
        BekleyenSiparis: bekleyenSiparisValue,
      });
    
    } catch (err) {
      Alert.alert('Hata', 'Stok verileri yüklenirken bir hata oluştu.');
    }
  }, [faturaBilgileri.sip_musteri_kod, updateFaturaBilgileri]);
  

  

  
  useEffect(() => {
    if (faturaBilgileri.sip_musteri_kod) {
      fetchStokListesi(); // Sadece müşteri kodu varsa stok listesini API'den çek
    }
  }, [fetchStokListesi, faturaBilgileri.sip_musteri_kod]);
  
  useEffect(() => {
    fetchProductData(searchTerm, searchCriteria, selectedMarka); // TextInput'a yazıldıkça arama yap
  }, [searchTerm, searchCriteria, selectedMarka, fetchProductData]);

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

  const handleItemClick = (item) => {
    const existingProductCount = addedProducts.filter(product => product.Stok_Kod === item.Stok_Kod).length;

    if (existingProductCount >= 2) {
      Alert.alert('Uyarı', 'Bu ürün zaten 2 kez eklenmiştir, daha fazla ekleyemezsiniz.');
      return;
    }

    setSelectedProduct(item);
    setModalVisible(true);
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

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Stok_Kod}-${index}`}
      />

      <ProductModal
        selectedProduct={selectedProduct}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAddedProducts={setAddedProducts}
      />
    </View>
  );
};

export default ProductList;
