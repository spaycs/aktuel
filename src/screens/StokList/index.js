import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../../components/userDetail/Id';
import { useAuthDefault } from '../../components/DefaultUser';
import { ProductContext } from '../../context/ProductContext';
import axiosLinkMain from '../../utils/axiosMain';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { Picker } from '@react-native-picker/picker';
import { RNCamera } from 'react-native-camera';
import { Camera, Nokta, Down } from '../../res/images';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';

const StokList = ({navigation}) => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { addedProducts, setAddedProducts } = useContext(ProductContext);

// State Yönetimi
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState('Stok Ad');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchTimeoutRef = useRef(null);
// State Yönetimi

  // Arama Kriterleri
    const pickerItems = [
      { label: 'Stok Adı', value: 'Stok Ad', tip: 1 },
      { label: 'Stok Kodu', value: 'Stok Kod', tip: 2 },
      { label: 'Marka', value: 'Marka', tip: 3 },
      { label: 'Alt Grup', value: 'AltGrup', tip: 4 },
      { label: 'Ana Grup', value: 'AnaGrup', tip: 5 },
      { label: 'Reyon', value: 'Reyon', tip: 6 },
      { label: 'Barkod', value: 'Barkod', tip: 7 },
    ];
  // Arama Kriterleri

  // Arama Kriterinden Tip Alma
    const getTipForValue = (value) => {
      const selectedItem = pickerItems.find((item) => item.value === value);
      return selectedItem ? selectedItem.tip : 1;
    };
  // Arama Kriterinden Tip Alma

  // API'den Ürün Verilerini Getir
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
  // API'den Ürün Verilerini Getir

  // Arama Gecikmesiyle API'ye Çağrı Yap
    const handleSearchTermChange = (text) => {
      setSearchTerm(text);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchProductData(text, searchCriteria); 
      }, 500); 
    };
  // Arama Gecikmesiyle API'ye Çağrı Yap
  
  // İlk Yükleme
    useEffect(() => {
      fetchProductData(searchTerm); // TextInput'a yazıldıkça arama yap
    }, []);
  // İlk Yükleme

  // Modal İşlemleri
    const openModal = (item) => {
      setSelectedItem(item);
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
      setSelectedItem(null);
    };
  // Modal İşlemleri

  // Kamera İşlemleri
    const handleCameraOpen = () => {setCameraModalVisible(true);};
    const handleCameraClose = () => {setCameraModalVisible(false);};

    const handleBarCodeRead = ({ data }) => {
      setCameraModalVisible(false);
      setSearchCriteria('Barkod');
      setSearchTerm(data);
      fetchProductData(); 
    };
  // Kamera İşlemleri 

  // Stok Raporları
    const navigateToStokHareketFoyu = () => {
      if (selectedItem) {
        navigation.navigate('StokHareketFoyu', { Stok_Kod: selectedItem.Stok_Kod });
      } else {
        Alert.alert('Hata', 'Stok seçimi yapılmadı.');
      }
    };
    const navigateToStokDepoDurum = () => {
      if (selectedItem) {
        navigation.navigate('StokDepoDurum', { Stok_Kod: selectedItem.Stok_Kod });
      } else {
        Alert.alert('Hata', 'Stok seçimi yapılmadı.');
      }
    };
  // Stok Raporları

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

      {loading ? ( 
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
      
      <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal} animationType="slide">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={MainStyles.modalCariContainer}>
            <View style={MainStyles.modalCariContent}>
              <View style={MainStyles.buttonCariModalDetail}>
                <Text style={MainStyles.buttonCariTitle}>Hızlı Erişim</Text>
              </View>
              <TouchableOpacity style={MainStyles.buttonCariModalDetail} onPress={navigateToStokHareketFoyu}>
                <Text style={MainStyles.cariButtonText}>Stok Hareket Föyü</Text>
              </TouchableOpacity>
              <TouchableOpacity style={MainStyles.buttonCariModalDetail} onPress={navigateToStokDepoDurum}>
                <Text style={MainStyles.cariButtonText}>Stok Depo Durum</Text>
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
