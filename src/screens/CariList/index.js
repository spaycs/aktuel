import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, TouchableOpacity, Text, FlatList, Modal, TouchableWithoutFeedback, View, Alert, Linking } from 'react-native';
import { MainStyles } from '../../res/style';
import { useAuth } from '../../components/userDetail/Id';
import { useAuthDefault } from '../../components/DefaultUser';
import axiosLinkMain from '../../utils/axiosMain';
import { colors } from '../../res/colors';
import FastImage from 'react-native-fast-image';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const CariList = ({ navigation }) => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [searchTerm, setSearchTerm] = useState('');
  const [caris, setCaris] = useState([]);
  const [filteredCaris, setFilteredCaris] = useState([]);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuIzinleri, setMenuIzinleri] = useState({});
  const [loading, setLoading] = useState(false);
  
// Menü İzinlerini Getir
  const fetchMenuIzinleri = useCallback(async () => {
    try {
      const temsilciKod = defaults[0]?.IQ_MikroUserId || ''; 
      const response = await axiosLinkMain.get(`/Api/Kullanici/MenuIzin?kod=${temsilciKod}`);
      setMenuIzinleri(response.data[0]); // İzinleri state'e kaydet
    } catch (error) {
      console.error('İzinler alınırken hata oluştu:', error);
    }
  }, [defaults]);

  useEffect(() => {
    fetchMenuIzinleri(); 
  }, [fetchMenuIzinleri]);
// Menü İzinlerini Getir

// Cari Verilerini Getir
  const fetchCaris = useCallback(async (searchTerm = '') => {
    setLoading(true);
    try {
      const personelKodu = defaults[0]?.IQ_MikroPersKod || ''; 
      const response = await axiosLinkMain.get(`/Api/Cari/CariListesi?temsilci=${personelKodu}`);
      
      const filteredData = response.data
        .filter(item =>
          normalizeText(item.Ünvan).toLowerCase().includes(normalizeText(searchTerm).toLowerCase()) ||
          normalizeText(item.Cari_Kod).includes(normalizeText(searchTerm))
        );

      setCaris(filteredData || []);
      setFilteredCaris(filteredData || []);
    } catch (error) {
      console.error('Error fetching caris:', error);
      Alert.alert('Error', 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false); 
    }
  }, [defaults]);

  useEffect(() => {
    fetchCaris(searchTerm);
  }, [searchTerm, fetchCaris]);
// Cari Verilerini Getir
  
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

// Cari Eylem ve Raporları
  const handlePhoneCall = () => {
    if (selectedItem?.cari_CepTel) {
      const phoneNumber = `tel:${selectedItem.cari_CepTel}`;
      Linking.openURL(phoneNumber).catch((err) =>
        console.error('Telefon Numarası Bulunamadı:', err)
      );
    } else {
      Alert.alert('Telefon Numarası Bulunamadı');
    }
  };

  const sendWhatsAppMessage = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('Telefon numarası bulunamadı');
      return;
    }
    
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    console.log(whatsappUrl);
    
    Linking.openURL(whatsappUrl)
      .catch(() => {
        Alert.alert('WhatsApp bulunamadı', 'Lütfen WhatsApp yüklü olduğundan emin olun.');
      });
  };

  const handleCariHareketFoyu = () => {
    if (menuIzinleri.IQM_CariHaraketFoyu === 1) {
      closeModal();
      navigation.navigate('CariHareketFoyu', { cariKod: selectedItem?.Cari_Kod });
    } else {
      Alert.alert('Erişim Hatası', 'Bu menüye erişim izniniz bulunmamaktadır. Yöneticiniz ile iletişime geçiniz.');
    }
  };
  
  const handleStokHareketFoyu = () => {
    if (menuIzinleri.IQM_StokFoyu === 1) {
      closeModal();
      navigation.navigate('StokHareketFoyu', { cariKod: selectedItem?.Cari_Kod })
    } else {
      Alert.alert('Erişim Hatası', 'Bu menüye erişim izniniz bulunmamaktadır. Yöneticiniz ile iletişime geçiniz.');
    }
  };

  const handleCariSiparisFoyu = () => {
    if (menuIzinleri.IQM_StokSiparisFoyu === 1) {
      closeModal();
      navigation.navigate('CariSiparisFoyu', { cariKod: selectedItem?.Cari_Kod });
    } else {
      Alert.alert('Erişim Hatası', 'Bu menüye erişim izniniz bulunmamaktadır. Yöneticiniz ile iletişime geçiniz.');
    }
  };
// Cari Eylem ve Raporları
  
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={MainStyles.itemContainerCariList}>
        <View style={MainStyles.itemTextContainer}>
          <Text style={MainStyles.itemText}>Cari Kodu: {item.Cari_Kod}</Text>
          <Text style={MainStyles.itemText}>Cari Ünvan: {item.Ünvan}</Text>
          <Text style={MainStyles.itemText}>Bakiye: {item.Bakiye}</Text>
          <Text style={MainStyles.itemText}>Adres: {item.Adres}</Text>
          <Text style={MainStyles.itemText}>Temsilci: {item.Temsilci}</Text>
        </View>
        <View style={MainStyles.detailContainer}>
          <Text style={MainStyles.itemTextCariList}>Detay</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={MainStyles.cariListesiContainer}>
      <View style={MainStyles.cariListesiPageTop}>
        <View style={MainStyles.searchCariContainer}>
          <TextInput
            style={MainStyles.inputCariAra}
            placeholder="Cari kodu veya Ünvan ile ara"
            placeholderTextColor={colors.placeholderTextColor}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {loading ? ( // Show loading indicator if loading
      <FastImage
        style={MainStyles.loadingGif}
        source={require('../../res/images/image/pageloading.gif')}
        resizeMode={FastImage.resizeMode.contain}
        />
      ) : (
      <>
      <FlatList
        data={filteredCaris}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Cari_Kod}-${index}`}
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
              <TouchableOpacity style={MainStyles.buttonCariModalDetail} onPress={handlePhoneCall} >
                <Text style={MainStyles.cariButtonText}>Arama Yap (Cep No)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={MainStyles.buttonCariModalDetail}  onPress={() => sendWhatsAppMessage(selectedItem?.cari_CepTel)}>
                <Text style={MainStyles.cariButtonText}>Whatsapp Mesaj Gönder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={MainStyles.buttonCariModalDetail} onPress={handleCariHareketFoyu}>
                  <Text style={MainStyles.cariButtonText}>Cari Hareket Föyü</Text>
                </TouchableOpacity>
              <TouchableOpacity style={MainStyles.buttonCariModalDetail} onPress={handleStokHareketFoyu}>
                <Text style={MainStyles.cariButtonText}>Stok Hareket Föyü</Text>
              </TouchableOpacity>
              <TouchableOpacity style={MainStyles.buttonCariModalDetail} onPress={handleCariSiparisFoyu}>
                <Text style={MainStyles.cariButtonText}>Cari Sipariş Föyü</Text>
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

export default CariList;
