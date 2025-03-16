import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Camera, Takvim } from '../../res/images';
import { ProductContext } from '../../context/ProductContext';
import { useAuthDefault } from '../../components/DefaultUser';
import ProductModal from '../../context/ProductModal';
import CariListModal from '../../context/CariListModal';
import { useFocusEffect } from '@react-navigation/native';
import axiosLinkMain from '../../utils/axiosMain';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { DataTable } from 'react-native-paper';
import Button from '../../components/Button';
import { RNCamera } from 'react-native-camera';

const StokEklemeDetay = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [bar_kodu, setBar_kodu] = useState('');
  const [barkodList, setBarkodList] = useState([]); 
  const [bar_barkodtipi, setBar_barkodtipi] = useState('');
  const [bar_birimpntr, setBar_birimpntr] = useState('');
  const [bar_master, setBar_master] = useState('');
  const [loading, setLoading] = useState(false);
// Tüm Değişken Değerleri
  const [barkodTipiList, setBarkodTipiList] = useState([]);
  const [selectedBarkod, setSelectedBarkod] = useState('');
  const [barkodBirimPntrList, setBarkodBirimPntrList] = useState([]);
  const [selectedBarkodBirimPntr, setSelectedBarkodBirimPntr] = useState('');
  const [isBarkodTipiModalVisible, setIsBarkodTipiModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);

  {/* Barkod Tipi Seçim */}
    const handleBarkodTipiChange = (value) => {
      setSelectedBarkod(value);
      
      let barkodTipiValue = '';
      if (value === 'Ean13') {
        barkodTipiValue = 0;
      } else if (value === 'Ean8') {
        barkodTipiValue = 1;
      } else if (value === 'Ascii') {
        barkodTipiValue = 2;
      }
  
      handleInputChange('bar_barkodtipi', barkodTipiValue); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Barkod Tipi Seçim */}

  {/* Barkod Birim Pntr Seçim */}
    useEffect(() => {
      const fetchBarkodBirimPntrList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Stok/StokBirimleri');
          const data = response.data;
          setBarkodBirimPntrList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchBarkodBirimPntrList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleBarkodBirimPntrChange = (value) => {
      setSelectedBarkodBirimPntr(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('bar_birimpntr', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Barkod Birim Pntr Seçim */}



const handleInputChange = (field, value) => {
  setFaturaBilgileri((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setFaturaBilgileri({});
      };
    }, [])
  );

  const handleSaveBarcode = async () => {
    console.log('Barkod:', bar_kodu);
    console.log('Stok Kodu:', faturaBilgileri.sto_kod);
    
    if (!faturaBilgileri.sto_kod || !bar_kodu) {
      Alert.alert('Hata', 'Stok kodu ve barkod bilgisi boş olamaz.');
      return;
    }
  
    try {
      setLoading(true);
  
      // 📌 **URL'yi manuel olarak oluşturuyoruz**
      const url = `/Api/Barkod/BarkodSorgulaEkle?barkod=${bar_kodu}&stokkod=${faturaBilgileri.sto_kod}`;
      
      const response = await axiosLinkMain.get(url);
  
      console.log("API Yanıtı:", response.data);
  
      // 📌 **API'den gelen yanıtı kontrol edelim**
      if (response.data?.Sonuc) {
        if (response.data.Sonuc === "Barkod var") {
          Alert.alert('Bilgi', 'Bu barkod sistemde zaten kayıtlı.');
        } else if (response.data.Sonuc === "Başarılı") {
          Alert.alert('Başarılı', 'Barkod başarıyla kaydedildi.');
          setBar_kodu(''); // 📌 Input alanını temizle
          fetchBarkodList(); // 📌 Listeyi güncelle
        } else {
          Alert.alert('Hata', response.data.Sonuc || 'Bilinmeyen bir hata oluştu.');
        }
      } else {
        Alert.alert('Hata', 'API yanıtı beklenen formatta değil.');
      }
  
    } catch (error) {
      Alert.alert('Hata', 'Barkod kaydedilirken hata oluştu.');
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  // 📌 **Barkodları Listeleme**
  const fetchBarkodList = async () => {
    try {
      setLoading(true);
      const response = await axiosLinkMain.get(`/Api/Barkod/BarkodGetir?stokkod=${faturaBilgileri.sto_kod}`);
      console.log(response);
      setBarkodList(response.data); // 📌 API'den gelen barkodları kaydet
    } catch (error) {
      console.error('Barkodları çekerken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (faturaBilgileri.sto_kod) {
      fetchBarkodList();
    }
  }, [faturaBilgileri.sto_kod]);

    // Kamera İşlemleri
    const handleCameraOpen = () => {setCameraModalVisible(true);};
    const handleCameraClose = () => {setCameraModalVisible(false);};

    const handleBarCodeRead = ({ data }) => {
      setCameraModalVisible(false);
      setBar_kodu(data);
      handleInputChange('bar_kodu', data); 
    };
  // Kamera İşlemleri 

  return (
      <View style={MainStyles.faturaContainer}>
         {/* Stok Kodu */}
         <Text style={MainStyles.formTitle}>Barkod</Text>
         <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.slinputUrunAra}
            placeholder="Barkod"
            value={bar_kodu}
            keyboardType="numeric"
            onChangeText={(value) => {
              setBar_kodu(value);
              handleInputChange('bar_kodu', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
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

        {/* Barkod Tipi */}
        <Text style={MainStyles.formTitle}>Barkod Tipi</Text>
          <View style={MainStyles.inputStyle}>
          {/* Platforma göre Picker */}
      {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsBarkodTipiModalVisible(true)} style={MainStyles.inputStyle}>
            <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedBarkod || 'Barkod Tipi'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal Picker */}
          <Modal visible={isBarkodTipiModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedBarkod}
                  onValueChange={handleBarkodTipiChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Barkod Tipi" value="" style={MainStyles.textStyle} />
                  <Picker.Item label="Ean13" value="Ean13" style={MainStyles.textStyle} />
                  <Picker.Item label="Ean8" value="Ean8" style={MainStyles.textStyle} />
                  <Picker.Item label="Ascii" value="Ascii" style={MainStyles.textStyle} />
                </Picker>
                <Button title="Kapat" onPress={() => setIsBarkodTipiModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için klasik Picker
        <View >
          <Picker
            selectedValue={selectedBarkod}
            onValueChange={handleBarkodTipiChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Barkod Tipi" value="" style={MainStyles.textStyle} />
            <Picker.Item label="Ean13" value="Ean13" style={MainStyles.textStyle} />
            <Picker.Item label="Ean8" value="Ean8" style={MainStyles.textStyle} />
            <Picker.Item label="Ascii" value="Ascii" style={MainStyles.textStyle} />
          </Picker>
        </View>
      )}
          </View>

            {/* 📌 **Barkodu Kaydet Butonu** */}
            <View  style={MainStyles.barkodKaydet}>
        <Button title="Barkodu Kaydet" onPress={handleSaveBarcode} disabled={loading} />
        </View>

    {/* 📌 **Barkodları Listeleme** */}
{barkodList.length > 0 && (
  <>
    <Text style={MainStyles.barkodHeader}>Kayıtlı Barkodlar</Text>
    {loading ? (
      <ActivityIndicator size="large" color={colors.primary} />
    ) : (
      <View style={MainStyles.barkodListContainer}>
        <FlatList
          data={barkodList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={MainStyles.barkodItem}>
              <Text style={MainStyles.barkodText}>{item.Barkod}</Text>
            </View>
          )}
        />
      </View>
    )}
  </>
)}



        {/* Barkod Birim Pntr
          <View style={MainStyles.inputStyle}>
            <Picker
              selectedValue={selectedBarkodBirimPntr}
              onValueChange={(value) => handleBarkodBirimPntrChange(value)} // Seçim yapıldığında çağrılan fonksiyon
            >
              <Picker.Item style={MainStyles.textStyle} label="Barkod Birim Pntr" value="" />
              {barkodBirimPntrList.map((item) => (
                <Picker.Item style={MainStyles.textStyle} key={item.Kod} label={item.Birim_Adi} value={item.Birim_Adi} />
              ))}
            </Picker>
          </View>
 */}

        {/* Cins 
          <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputStokKodu}
              placeholder="Barkod Master"
              value={bar_master}
              onChangeText={(value) => {
                setBar_master(value);
                handleInputChange('bar_master', value);
              }}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
        */}

       
    </View>
  );
};

export default StokEklemeDetay;


