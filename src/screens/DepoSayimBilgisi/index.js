import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Linking, Alert, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Left, PDF, Takvim } from '../../res/images';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuth } from '../../components/userDetail/Id';
import { useAuthDefault } from '../../components/DefaultUser';
import { ProductContext } from '../../context/ProductContext';
import { ActivityIndicator, DataTable } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';
import CustomHeader from '../../components/CustomHeader';
import axios from 'axios';

const DepoSayimBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);
  const [normalTipi, setNormalTipi] = useState('');
  const [faturaTipi, setFaturaTipi] = useState('');
  const [kaynakDepo, setKaynakDepo] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const [depoList, setDepoList] = useState([]);
  const [sym_depono, setSym_depono] = useState('');
  const [pickerEditable, setPickerEditable] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [evrakNo, setEvrakNo] = useState(''); // Evrak No state'i
  const [rafKodu, setRafKodu] = useState(''); // Raf Kodu state'i
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);
  // State Yönetimi
  const [isLogSent, setIsLogSent] = useState(false); // API çağrısının yapılıp yapılmadığını takip etmek için

  useEffect(() => {
    // İlk render'da sadece çalışacak
    const logHareket = async () => {
      if (isLogSent) return;  // Eğer log zaten gönderildiyse, fonksiyonu durdur

      try {
        if (!defaults || !defaults[0].IQ_MikroPersKod || !defaults[0].IQ_Database) {
          console.log('IQ_MikroPersKod veya IQ_Database değeri bulunamadı, API çağrısı yapılmadı.');
          return;
        }

        const body = {
          Message: 'Depo Sayım Sayfa Açıldı', // Hardcoded message
          User: defaults[0].IQ_MikroPersKod, // Temsilci ID
          database: defaults[0].IQ_Database, // Database ID
          data: 'Depo Sayım' // Hardcoded data
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

  const handleClose = () => {
    setIsModalVisible(false);
  };

  // Sayfa Açıldığında Gönderilen Varsayılan Değerler
  useEffect(() => {
    setFaturaBilgileri(prevState => ({
      ...prevState,
      evrakNo: evrakNo,
      rafKodu: rafKodu,
    }));
  }, [evrakNo, rafKodu]);

  // API'dan Evrak No al
  useEffect(() => {
    const fetchEvrakNo = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Evrak/EvrakSiraGetir?seri=EIR&tip=SAYIM');
        setEvrakNo(response.data.Sira.toString());
      } catch (error) {
        console.error('Evrak No alınırken hata oluştu:', error);
      }
    };

    fetchEvrakNo();
  }, []);

  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_CikisDepoNoDegistirebilir } = defaults[0];
      setPickerEditable(IQ_CikisDepoNoDegistirebilir === 1);
    }
  }, [defaults]);

  useEffect(() => {
    fetchDepoList();
  }, []);

  const fetchDepoList = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Depo/Depolar');
      const depoData = response.data;
      setDepoList(depoData);

      const defaultDepo = depoData.find(depo => depo.No === defaults[0]?.IQ_CikisDepoNo);

      if (defaultDepo) {
        setSym_depono(defaultDepo.No.toString());
        setFaturaBilgileri(prev => ({
          ...prev,
          sym_depono: defaultDepo.No.toString(),
        }));
      }
    } catch (error) {
      console.error('Bağlantı Hatası Döviz list:', error);
    }
  };

  const fetchEvrakData = async () => {
    setLoading(true);
    try {
      const personelKodu = defaults[0]?.Personel_Kodu || ''; 
      const response = await axiosLinkMain.get(`/Api/Sayim/SayimEvraklari?temsilci=${personelKodu}`);
      setData(response.data); 

      setIsModalVisible(true); 
    } catch (error) {
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfClick = async (Evrak_No, Depo_No) => {
    try {
      // API'ye isteği yaparken evrakno_seri ve evrakno_sira değerlerini gönderiyoruz
      const response = await axiosLinkMain.get(`/Api/PDF/SayimPDF?evrakno=${Evrak_No}&depo=${Depo_No}`);
      console.log('API Yanıtı:', response.data); // Yanıtı kontrol etmek için 
  
      const pdfPath = response.data; 
      
      if (pdfPath) {
        const fullPdfUrl = `${pdfPath}`;
  
        Linking.openURL(fullPdfUrl);
      } else {
        throw new Error('PDF dosya yolu alınamadı');
      }
    } catch (error) {
      console.error('PDF almakta hata oluştu:', error);
      Alert.alert('Hata', 'PDF alınırken bir sorun oluştu.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate || date);
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    setDate(currentDate);
    setFaturaBilgileri(prevState => ({
      ...prevState,
      sym_tarihi: formattedDate,
    }));
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Depo Seçim
  const handleDepoChange = (itemValue) => {
    setSym_depono(itemValue);
    setFaturaBilgileri(prev => ({
      ...prev,
      sym_depono: itemValue,
    }));
  };

  // Raf Kodu Değişimi
  const handleRafKoduChange = (value) => {
    setRafKodu(value);
    setFaturaBilgileri(prev => ({
      ...prev,
      rafKodu: value,
    }));
  };

  return (
    <ScrollView style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
      <Text style={MainStyles.formTitle}>Evrak No</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.productModalMiktarInput}
            placeholderTextColor={colors.placeholderTextColor}
            placeholder="Evrak No"
            keyboardType="numeric"
            value={evrakNo} // API'dan alınan değeri TextInput'a ata
            editable={false} // Kullanıcının değiştirmesini engelle
          />
        </View>
        <Text style={MainStyles.formTitle}>Tarih </Text> 
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
        {/* Depo Seçim */}
        <Text style={MainStyles.formTitle}>Depo</Text> 
        <View style={MainStyles.inputDepoSecin}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsDepoModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {sym_depono ? depoList.find(depo => depo.No.toString() === sym_depono)?.Adı : 'Depo Seçin'}
              </Text>
            </TouchableOpacity>

            {/* Depo Modal (iOS için) */}
            <Modal visible={isDepoModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={sym_depono}
                    onValueChange={handleDepoChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Depo Seçin" value="" />
                    {depoList.map((depo) => (
                      <Picker.Item
                        key={depo.No}
                        label={depo.Adı}
                        value={depo.No.toString()}
                      />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsDepoModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
          itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
          selectedValue={sym_depono}
          onValueChange={handleDepoChange}
          enabled={pickerEditable}
        >
          <Picker.Item label="Depo Seçin" style={MainStyles.textStyle} value="" />
          {depoList.map((depo) => (
            <Picker.Item key={depo.No} style={MainStyles.textStyle} label={depo.Adı} value={depo.No.toString()} />
          ))}
        </Picker>
        )}
        </View>
        {/* Raf Kodu Giriş */}
        <Text style={MainStyles.formTitle}>Raf Kodu</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.productModalMiktarInput}
            placeholderTextColor={colors.placeholderTextColor}
            placeholder="Raf Kodu"
            value={rafKodu} // Raf Kodu değerini TextInput'a ata
            onChangeText={handleRafKoduChange} // Raf Kodu değiştiğinde state güncelle
            keyboardType="numeric" // Sayısal klavye kullan
          />
        </View>
        <TouchableOpacity onPress={fetchEvrakData} style={MainStyles.onizlemeButton}>
            <Text style={MainStyles.buttonText}>EVRAK GETİR</Text>
          </TouchableOpacity>

         {/* Evrak Getir*/}
         <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Son Kaydedilen Evraklar"
                onClose={() => handleClose()}
              />
              <View style={MainStyles.modalContentSonKaydedilen}>
                {loading ? (
                  <FastImage
                  style={MainStyles.loadingGif}
                  source={require('../../res/images/image/pageloading.gif')}
                  resizeMode={FastImage.resizeMode.contain}/>
                ) : (
                  <ScrollView horizontal>
                  <DataTable>
                    <DataTable.Header style={MainStyles.tableHeaderContainer}>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Sayım Tarihi</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak No</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Depo</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Stok Kod</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 300 }]}>Stok İsim</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Miktar</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Kullanıcı</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Depo No</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Önizleme</DataTable.Title>
                    
                    </DataTable.Header>

                    <ScrollView >
                      {data.map((item, index) => (
                        <DataTable.Row key={index} style={MainStyles.tableRow}>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Sayım_Tarihi}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100, paddingHorizontal: 15 }}>{item.Evrak_No}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Depo}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Stok_Kod}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 300 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Stok_Adı}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Miktar}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Kullanıcı}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Depo_No}
                          </DataTable.Cell>
                          <DataTable.Cell style={[MainStyles.withBorder, { width: 150 }]} >
                          <TouchableOpacity onPress={() => handlePdfClick(item.Evrak_No, item.Depo_No)}>
                          <PDF width={25} height={25}/>
                          </TouchableOpacity>
                        </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </ScrollView>
                  </DataTable>
                </ScrollView>
                )}
              
              </View>
            </View>
          </Modal>
        {/* Evrak Getir*/}

      </View>
    </ScrollView>
  );
};

export default DepoSayimBilgisi;
