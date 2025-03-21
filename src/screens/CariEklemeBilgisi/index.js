import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Takvim } from '../../res/images';
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
import MuhKodListModal from '../../context/MuhKodListModal';
import { useScrollToTop } from '@react-navigation/native';
import axios from 'axios';

const CariEklemeBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);
  const scrollViewRef = useRef(null)
  // State Yönetimi
  const [isLogSent, setIsLogSent] = useState(false); // API çağrısının yapılıp yapılmadığını takip etmek için

  useEffect(() => {
    // İlk render'da sadece çalışacak
    const logHareket = async () => {
      if (isLogSent) return;  // Eğer log zaten gönderildiyse, fonksiyonu durdur

      try {
        if (!defaults || !defaults[0].Adi || !defaults[0].IQ_Database) {
          console.log('IQ_MikroPersKod veya IQ_Database değeri bulunamadı, API çağrısı yapılmadı.');
          return;
        }

        const body = {
          Message: 'Cari Ekleme Sayfa Açıldı', // Hardcoded message
          User: defaults[0].Adi, // Temsilci ID
          database: defaults[0].IQ_Database, // Database ID
          data: 'Cari Ekleme' // Hardcoded data
        };

        const response = await axios.post('http://80.253.246.89:8055/api/Kontrol/HareketLogEkle', body);

        if (response.status === 200) {
          console.log('Hareket Logu başarıyla eklendi');
          setIsLogSent(true); // Başarıyla log eklendikten sonra flag'i true yap
        } else {
          console.log('Hareket Logu eklenirken bir hata oluştu');
        }
      } catch (error) {
        console.error('API çağrısı sırasında hata oluştu:', error);
      }
    };

    logHareket(); // Sayfa yüklendiğinde API çağrısını başlat
  }, []); // Boş bağımlılık dizisi, yalnızca ilk render'da çalışacak

  useEffect(() => {
    // Sayfa yüklendiğinde kısa bir gecikme ile kaydırmayı tetikleyin
    const timer = setTimeout(() => {
      scrollTop();
    }, 100); // 100 ms gecikme
  
    return () => clearTimeout(timer); // Temizleme işlemi
  }, []);
  

  const scrollTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }
  }

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [cari_kod, setCari_kod] = useState('');
  const [cari_unvan1, setCari_unvan1] = useState('');
  const [cari_unvan2, setCari_unvan2] = useState('');
  const [cari_vdaire_no, setCari_vdaire_no] = useState('');
  const [cari_vdaire_adi, setCari_vdaire_adi] = useState('');
  const [cari_doviz_cinsi1, setCari_doviz_cinsi1] = useState('');
  const [cari_doviz_cinsi2, setCari_doviz_cinsi2] = useState('');
  const [cari_doviz_cinsi3, setCari_doviz_cinsi3] = useState('');
  const [cari_vade_fark_yuz, setCari_vade_fark_yuz] = useState('');
  const [cari_KurHesapSekli, setCari_KurHesapSekli] = useState('');
  const [cari_sevk_adres_no, setCari_sevk_adres_no] = useState('');
  const [cari_fatura_adres_no, setCari_fatura_adres_no] = useState('');
  const [cari_EMail, setCari_EMail] = useState('');
  const [cari_CepTel, setCari_CepTel] = useState('');
  const [cari_efatura_fl, setCari_efatura_fl] = useState('');
  const [cari_def_efatura_cinsi, setCari_def_efatura_cinsi] = useState('');
  const [cari_efatura_baslangic_tarihi, setCari_efatura_baslangic_tarihi] = useState('');
  const [cari_vergidairekodu, setCari_vergidairekodu] = useState('');
  const [cari_muh_kod2, setCari_muh_kod2] = useState('');
// Tüm Değişken Değerleri
const [dovizCinsList, setDovizCinsList] = useState([]);
const [sth_cari_kodu, setSth_cari_kodu] = useState('');
const [sth_cari_unvan1, setSth_cari_unvan1] = useState('');
const [selectedDovizCins, setSelectedDovizCins] = useState('');
const [dovizCinsList2, setDovizCinsList2] = useState([]);
const [selectedDovizCins2, setSelectedDovizCins2] = useState('');
const [dovizCinsList3, setDovizCinsList3] = useState([]);
const [selectedDovizCins3, setSelectedDovizCins3] = useState('');
const [date, setDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
const [isMuhasebeKoduModalVisible, setIsMuhasebeKoduModalVisible] = useState(false);
const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);
const [isDovizModalVisible2, setIsDovizModalVisible2] = useState(false);
const [isDovizModalVisible3, setIsDovizModalVisible3] = useState(false);
const [isKurHesapSekliModalVisible, setIsKurHesapSekliModalVisible] = useState(false);
const [isKurHesapSekliModalVisible2, setIsKurHesapSekliModalVisible2] = useState(false);
const [isEFaturaCinsiModalVisible, setIsEFaturaCinsiModalVisible] = useState(false);
const [isEFaturaModalVisible, setIsEFaturaModalVisible] = useState(false);

const getSelectedDovizAd = () => {
  const selected = dovizCinsList.find(item => item.No.toString() === selectedDovizCins);
  return selected ? selected.İsim : 'Döviz Cinsi 1';
};
const getSelectedDovizAd2 = () => {
  const selected = dovizCinsList2.find(item => item.No.toString() === selectedDovizCins2);
  return selected ? selected.İsim : 'Döviz Cinsi 2';
};
const getSelectedDovizAd3 = () => {
  const selected = dovizCinsList3.find(item => item.No.toString() === selectedDovizCins3);
  return selected ? selected.İsim : 'Döviz Cinsi 3';
};

// Sayfa Açıldığında Gönderilen Varsayılan Değerler
  useEffect(() => {
    setFaturaBilgileri(prevState => ({
      ...prevState,
      cari_sevk_adres_no: 1,
      cari_fatura_adres_no: 1,
    
    }));
  }, [cari_sevk_adres_no,cari_fatura_adres_no] );
// Sayfa Açıldığında Gönderilen Varsayılan Değerler

{/* Döviz Cins Seçim 1*/}
  useEffect(() => {
    const fetchDovizCinsList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Kur/Kurlar');
        const data = response.data;
        setDovizCinsList(data); // API'den gelen verileri state'e set ediyoruz
      } catch (error) {
        console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
      }
    };

    fetchDovizCinsList(); // Component yüklendiğinde API çağrısını yap
  }, []);

  const handleDovizCinsChange = (value) => {
    setSelectedDovizCins(value); // Seçilen değeri local state'de tutuyoruz
    handleInputChange('cari_doviz_cinsi1', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
  };
{/* Döviz Cins Seçim 1*/}

{/* Döviz Cins Seçim 2*/}
  useEffect(() => {
    const fetchDovizCinsList2 = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Kur/Kurlar');
        const data = response.data;
        setDovizCinsList2(data); // API'den gelen verileri state'e set ediyoruz
      } catch (error) {
        console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
      }
    };

    fetchDovizCinsList2(); // Component yüklendiğinde API çağrısını yap
  }, []);

  const handleDovizCinsChange2 = (value) => {
    setSelectedDovizCins2(value); // Seçilen değeri local state'de tutuyoruz
    handleInputChange('cari_doviz_cinsi2', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
  };
{/* Döviz Cins Seçim 2*/}

{/* Döviz Cins Seçim 3*/}
  useEffect(() => {
    const fetchDovizCinsList3 = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Kur/Kurlar');
        const data = response.data;
        setDovizCinsList3(data); // API'den gelen verileri state'e set ediyoruz
      } catch (error) {
        console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
      }
    };

    fetchDovizCinsList3(); // Component yüklendiğinde API çağrısını yap
  }, []);

  const handleDovizCinsChange3 = (value) => {
    setSelectedDovizCins3(value); // Seçilen değeri local state'de tutuyoruz
    handleInputChange('cari_doviz_cinsi3', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
  };
{/* Döviz Cins Seçim 3*/}

{/* Kur Hesap Şekli Seçim */}
  const handleKurHesapSekliChange = (value) => {
    setCari_KurHesapSekli(value);
    
    let kurHesapSekliValue = '';
    if (value === 'Döviz Alış') {
      kurHesapSekliValue = 1;
    } else if (value === 'Döviz Satış') {
      kurHesapSekliValue = 2;
    } else if (value === 'Efektif Alış') {
      kurHesapSekliValue = 3;
    } else if (value === 'Efektif Satış') {
      kurHesapSekliValue = 4;
    }

    handleInputChange('cari_KurHesapSekli', kurHesapSekliValue); // Seçilen değeri fatura bilgilerine gönderiyoruz
  };
{/* Kur Hesap Şekli Seçim */}

{/* E Fatura Fl Seçim */}
  const handleEfaturaFlChange = (value) => {
    setCari_efatura_fl(value);
    
    let eFaturaFlValue = '';
    if (value === 'Evet') {
      eFaturaFlValue = 1;
    } else if (value === 'Hayır') {
      eFaturaFlValue = 0;
    }

    handleInputChange('cari_efatura_fl', eFaturaFlValue); // Seçilen değeri fatura bilgilerine gönderiyoruz
  };
{/* E Fatura Fl Seçim */}

{/* E Fatura Cinsi Seçim */}
  const handleEfaturaCinsiChange = (value) => {
    setCari_def_efatura_cinsi(value);
    
    let efaturaCinsiValue = '';
    if (value === 'TemelFatura') {
      efaturaCinsiValue = 0;
    } else if (value === 'TicariFatura') {
      efaturaCinsiValue = 1;
    } else if (value === 'YolcuBeraberindeFatura') {
      efaturaCinsiValue = 2;
    } else if (value === 'İhracat') {
      efaturaCinsiValue = 3;
    }

    handleInputChange('cari_def_efatura_cinsi', efaturaCinsiValue); // Seçilen değeri fatura bilgilerine gönderiyoruz
  };
{/* E Fatura Cinsi Seçim */}

// Evrak Tarih Alanı
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    setDate(currentDate);
    setFaturaBilgileri(prevState => ({
      ...prevState,
      cari_efatura_baslangic_tarihi: formattedDate,
    }));
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const newDate = selectedDate || date;
    setDate(newDate);

    const formattedDate = formatDate(newDate);
    setFaturaBilgileri(prevState => ({
      ...prevState,
      cari_efatura_baslangic_tarihi: formattedDate,
    }));
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
// Evrak Tarih Alanı

// Muhasebe Kodu Ekleme
  const handleMuhasebeKoduSelect = (cari) => {
    const selectedMuhasebeKodu = cari.Kodu; // The selected code
    const selectedMuhasebeAdi = cari.Adi; // The selected name

    setCari_muh_kod2(selectedMuhasebeAdi); // Display Adi in TextInput
    setFaturaBilgileri((prevState) => ({
      ...prevState,
      cari_muh_kod2: selectedMuhasebeKodu, // Send Kodu to faturaBilgileri
    }));

    setIsMuhasebeKoduModalVisible(false);
  };

// Muhasebe Kodu Ekleme 

// Cari Seçim
  const handleCariKoduClick = () => {
    // Cari kodu seçilmişse eklediğiniz ürünleri sıfırlayın
    if (cari_kod) {
      setAddedProducts([]);
    }

    // Modalı doğrudan açın
    setIsCariListModalVisible(true);
  };

  const handleCariSelect = async (cari) => {
    const selectedCariKodu = cari.Cari_Kod;
    setCari_kod(selectedCariKodu); // Cari kodunu set et
    setSth_cari_unvan1(cari.Ünvan); // Cari ünvanını set et
    setIsCariListModalVisible(false); // Modalı kapat
  };

// Cari Seçim

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

  return (
    <ScrollView ref={scrollViewRef} style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
         {/* Cari Kodu */}
         <Text style={MainStyles.formTitle}>Cari Kodu</Text> 
         <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputCariKodu}
          placeholder="Cari Kodu"
          value={cari_kod}
          onChangeText={(value) => {
            setCari_kod(value);
            handleInputChange('cari_kod', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
        <TouchableOpacity onPress={handleCariKoduClick} style={MainStyles.buttonCariKodu}>
          <Ara />
        </TouchableOpacity>
      </View>
        {/* Cari Ünvan 1 */}
        <Text style={MainStyles.formTitle}>Cari Ünvan 1</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Cari Ünvan 1"
            value={cari_unvan1}
            onChangeText={(value) => {
              setCari_unvan1(value);
              handleInputChange('cari_unvan1', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Cari Ünvan 2 */}
        <Text style={MainStyles.formTitle}>Cari Ünvan 2</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Cari Ünvan 2"
            value={cari_unvan2}
            onChangeText={(value) => {
              setCari_unvan2(value);
              handleInputChange('cari_unvan2', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Vergi Daire No */}
        <Text style={MainStyles.formTitle}>Vergi Daire No</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Vergi Daire No"
            value={cari_vdaire_no}
            keyboardType="numeric"
            onChangeText={(value) => {
              setCari_vdaire_no(value);
              handleInputChange('cari_vdaire_no', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Cari Vergi Daire Adı */}
        <Text style={MainStyles.formTitle}>Vergi Daire Adı</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Vergi Daire Adı"
            value={cari_vdaire_adi}
            onChangeText={(value) => {
              setCari_vdaire_adi(value);
              handleInputChange('cari_vdaire_adi', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

         {/* Döviz Cinsi */}
         <Text style={MainStyles.formTitle}>Döviz Cinsi 1</Text> 
         <View style={MainStyles.inputStyleAlinanSiparis}>
         {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsDovizModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {getSelectedDovizAd()}
              </Text>
            </TouchableOpacity>

            {/* Döviz Modal (iOS için) */}
            <Modal visible={isDovizModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={selectedDovizCins}
                    onValueChange={handleDovizCinsChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Döviz Cinsi 1" value="" />
                    {dovizCinsList.map((item) => (
                      <Picker.Item
                        key={item.No}
                        label={item.İsim}
                        value={item.No.toString()}
                      />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsDovizModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={selectedDovizCins}
            onValueChange={handleDovizCinsChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Döviz Cinsi 1" value="" style={MainStyles.textStyle} />
            {dovizCinsList.map((item) => (
              <Picker.Item
                key={item.No}
                label={item.İsim}
                value={item.No.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        )}
        </View>

         {/* Döviz Cinsi 2*/}
         <Text style={MainStyles.formTitle}>Döviz Cinsi 2</Text> 
         <View style={MainStyles.inputStyleAlinanSiparis}>
         {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsDovizModalVisible2(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {getSelectedDovizAd2()}
              </Text>
            </TouchableOpacity>

            {/* Döviz Modal (iOS için) */}
            <Modal visible={isDovizModalVisible2} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={selectedDovizCins2}
                    onValueChange={handleDovizCinsChange2}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Döviz Cinsi 2" value="" />
                    {dovizCinsList2.map((item) => (
                      <Picker.Item
                        key={item.No}
                        label={item.İsim}
                        value={item.No.toString()}
                      />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsDovizModalVisible2(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={selectedDovizCins2}
            onValueChange={handleDovizCinsChange2}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Döviz Cinsi 2" value="" style={MainStyles.textStyle} />
            {dovizCinsList2.map((item) => (
              <Picker.Item
                key={item.No}
                label={item.İsim}
                value={item.No.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        )}
        </View>
         {/* Döviz Cinsi 3*/}
         <Text style={MainStyles.formTitle}>Döviz Cinsi 3</Text> 
         <View style={MainStyles.inputStyleAlinanSiparis}>
         {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsDovizModalVisible3(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {getSelectedDovizAd3()}
              </Text>
            </TouchableOpacity>

            {/* Döviz Modal (iOS için) */}
            <Modal visible={isDovizModalVisible3} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={selectedDovizCins3}
                    onValueChange={handleDovizCinsChange3}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Döviz Cinsi 3" value="" />
                    {dovizCinsList3.map((item) => (
                      <Picker.Item
                        key={item.No}
                        label={item.İsim}
                        value={item.No.toString()}
                      />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsDovizModalVisible3(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={selectedDovizCins3}
            onValueChange={handleDovizCinsChange3}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Döviz Cinsi 3" value="" style={MainStyles.textStyle} />
            {dovizCinsList3.map((item) => (
              <Picker.Item
                key={item.No}
                label={item.İsim}
                value={item.No.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        )}
        </View>

        {/* Vade Fark Yüz */}
        <Text style={MainStyles.formTitle}>Vade Fark Yüz</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Vade Fark Yüz"
            value={cari_vade_fark_yuz}
            keyboardType="numeric"
            onChangeText={(value) => {
              setCari_vade_fark_yuz(value);
              handleInputChange('cari_vade_fark_yuz', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

         {/* Cari Kur Hesap Sekli*/}
         <Text style={MainStyles.formTitle}>Kur Hesap Şekli</Text> 
         <View style={MainStyles.inputStyleAlinanSiparis}>
         {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsKurHesapSekliModalVisible(true)} >
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
          {cari_KurHesapSekli ? cari_KurHesapSekli : 'Kur Hesap Şekli'}
            </Text>
          </TouchableOpacity>

            {/* Kur Hesap Şekli Modal (iOS için) */}
            <Modal visible={isKurHesapSekliModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={cari_KurHesapSekli}
                    onValueChange={handleKurHesapSekliChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Kur Hesap Şekli" value="" />
                    <Picker.Item label="Döviz Alış" value="Döviz Alış" />
                    <Picker.Item label="Döviz Satış" value="Döviz Satış" />
                    <Picker.Item label="Efektif Alış" value="Efektif Alış" />
                    <Picker.Item label="Efektif Satış" value="Efektif Satış" />
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsKurHesapSekliModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={cari_KurHesapSekli}
            onValueChange={handleKurHesapSekliChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Kur Hesap Şekli" value="" style={MainStyles.textStyle} />
            <Picker.Item label="Döviz Alış" value="Döviz Alış" style={MainStyles.textStyle} />
            <Picker.Item label="Döviz Satış" value="Döviz Satış" style={MainStyles.textStyle} />
            <Picker.Item label="Efektif Alış" value="Efektif Alış" style={MainStyles.textStyle} />
            <Picker.Item label="Efektif Satış" value="Efektif Satış" style={MainStyles.textStyle} />
          </Picker>
        )}
          </View>


        {/* Cari Email */}
        <Text style={MainStyles.formTitle}>Email</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Email"
            value={cari_EMail}
            onChangeText={(value) => {
              setCari_EMail(value);
              handleInputChange('cari_EMail', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Cari Cep Tel */}
        <Text style={MainStyles.formTitle}>Cep Telefon</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Cep Telefon"
            value={cari_CepTel}
            keyboardType="numeric"
            onChangeText={(value) => {
              setCari_CepTel(value);
              handleInputChange('cari_CepTel', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

          {/* E Fatura Fl Sekli*/}
          <Text style={MainStyles.formTitle}>E Fatura</Text> 
          <View style={MainStyles.inputStyleAlinanSiparis}>

          {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsEFaturaModalVisible(true)} >
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
          {cari_efatura_fl ? cari_efatura_fl : 'E Fatura mı ?'}
            </Text>
          </TouchableOpacity>

            {/* E Fatura mı ? Modal (iOS için) */}
            <Modal visible={isEFaturaModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={cari_efatura_fl}
                    onValueChange={handleEfaturaFlChange}
                    style={MainStyles.picker}
                  >
                  <Picker.Item style={MainStyles.textStyle} label="E Fatura mı ?" value="" />
                  <Picker.Item style={MainStyles.textStyle} label="Evet" value="Evet" />
                  <Picker.Item style={MainStyles.textStyle} label="Hayır" value="Hayır" />
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsEFaturaModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={cari_KurHesapSekli}
            onValueChange={handleEfaturaFlChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
             <Picker.Item style={MainStyles.textStyle} label="E Fatura mı ?" value="" />
              <Picker.Item style={MainStyles.textStyle} label="Evet" value="Evet" />
              <Picker.Item style={MainStyles.textStyle} label="Hayır" value="Hayır" />
          </Picker>
        )}
        </View>
          {/* Cari Kur Hesap Sekli*/}
          <Text style={MainStyles.formTitle}>E Fatura Cins</Text> 
          <View style={MainStyles.inputStyleAlinanSiparis}>
          {Platform.OS === 'ios' ? (
        <>
            <TouchableOpacity onPress={() => setIsEFaturaCinsiModalVisible(true)}>
                <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                    {cari_def_efatura_cinsi ? cari_def_efatura_cinsi : 'E Fatura Cins'}
                </Text>
            </TouchableOpacity>

            {/* E-Fatura Cinsi Modal (iOS için) */}
            <Modal visible={isEFaturaCinsiModalVisible} animationType="slide" transparent>
                <View style={MainStyles.modalContainerPicker}>
                    <View style={MainStyles.modalContentPicker}>
                        <Picker
                            selectedValue={cari_def_efatura_cinsi}
                            onValueChange={handleEfaturaCinsiChange}
                            style={MainStyles.picker}
                        >
                            <Picker.Item label="E Fatura Cins" value="" />
                            <Picker.Item label="Temel Fatura" value="TemelFatura" />
                            <Picker.Item label="Ticari Fatura" value="TicariFatura" />
                            <Picker.Item label="Yolcu Beraberinde Fatura" value="YolcuBeraberindeFatura" />
                            <Picker.Item label="İhracat" value="İhracat" />
                        </Picker>
                        <Button title="Kapat" onPress={() => setIsEFaturaCinsiModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </>
    ) : (
        // Android için doğrudan Picker
        <Picker
            selectedValue={cari_def_efatura_cinsi}
            onValueChange={handleEfaturaCinsiChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
        >
            <Picker.Item label="E Fatura Cins" value="" style={MainStyles.textStyle} />
            <Picker.Item label="Temel Fatura" value="TemelFatura" style={MainStyles.textStyle} />
            <Picker.Item label="Ticari Fatura" value="TicariFatura" style={MainStyles.textStyle} />
            <Picker.Item label="Yolcu Beraberinde Fatura" value="YolcuBeraberindeFatura" style={MainStyles.textStyle} />
            <Picker.Item label="İhracat" value="İhracat" style={MainStyles.textStyle} />
        </Picker>
    )}
          </View>
      
       
        <Text style={MainStyles.formTitle}>E Fatura Başlangıç Tarihi</Text> 
        <View style={MainStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} >
            <View style={MainStyles.dateContainer}>
              <Takvim name="calendar-today" style={MainStyles.dateIcon} />
              <Text style={MainStyles.dateText}>{formatDate(date)}</Text>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
            style={{position: 'absolute', backgroundColor: colors.textinputgray}}
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>


        {/* Vergi Daire Kodu 
          <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputStokKodu}
              placeholder="Vergi Daire Kodu"
              value={cari_vergidairekodu}
              keyboardType="numeric"
              onChangeText={(value) => {
                setCari_vergidairekodu(value);
                handleInputChange('cari_vergidairekodu', value);
              }}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
        */}

        {/* Muh Kod 2 */}
        <Text style={MainStyles.formTitle}>Muhasebe Kodu 2</Text> 
          <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputCariKodu}
              placeholder="Muhasebe Kodu 2"
              value={cari_muh_kod2} // This will be updated with selected code
              autoFocus={true}
              selection={{start: 0, end: 0}}
              placeholderTextColor={colors.placeholderTextColor}
            />
            <TouchableOpacity onPress={() => setIsMuhasebeKoduModalVisible(true)} style={MainStyles.buttonCariKodu}>
              <Ara />
            </TouchableOpacity>
          </View>

          <MuhKodListModal
            isVisible={isMuhasebeKoduModalVisible}
            onSelectCari={handleMuhasebeKoduSelect}
            onClose={() => setIsMuhasebeKoduModalVisible(false)}
          />


        <CariListModal
          isVisible={isCariListModalVisible}
          onSelectCari={handleCariSelect}
          onClose={() => setIsCariListModalVisible(false)}
          initialSearchTerm={cari_kod}
        />
    </View>
    </ScrollView>
  );
};

export default CariEklemeBilgisi;
