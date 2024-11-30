import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, ActivityIndicator, SafeAreaView, Linking, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Left, PDF, Takvim } from '../../res/images';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';
import { ProductContext } from '../../context/ProductContext';
import { useAuthDefault } from '../../components/DefaultUser';
import { useAuth } from '../../components/userDetail/Id';
import { DataTable } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';
import CustomHeader from '../../components/CustomHeader';

const DepolarArasiSevkFisiBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);
  const [sth_evrakno_seri, setSth_evrakno_seri] = useState('');
  const [sth_evrakno_sira, setSth_evrakno_sira] = useState('');
  const [normalTipi, setNormalTipi] = useState('');
  const [faturaTipi, setFaturaTipi] = useState('');
  const [dovizTipi, setDovizTipi] = useState('');
  const [kaynakDepo, setKaynakDepo] = useState('');
  const [hedefDepo, setHedefDepo] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const [showPersonelModal, setShowPersonelModal] = useState(false);
  const [personelListesi, setPersonelListesi] = useState([]);
  const [selectedKaynakDepoNo, setSelectedKaynakDepoNo] = useState('');
  const [selectedHedefDepoNo, setSelectedHedefDepoNo] = useState('');
  const [sth_personel_kodu, setSth_personel_kodu] = useState([]);
  const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
  const [isSorumlulukMerkeziModalVisible, setIsSorumlulukMerkeziModalVisible] = useState(false);
  const [isPersonelModalVisible, setIsPersonelModalVisible] = useState(false);
  const [sth_stok_srm_merkezi, setSth_stok_srm_merkezi] = useState('');
  const [sth_personel_adi, setSth_personel_adi] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [data, setData] = useState([]); 
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);
  const [isKaynakModalVisible, setIsKaynakModalVisible] = useState(false);
  const [isHedefModalVisible, setIsHedefModalVisible] = useState(false);

  const handleKaynakDepoChange = (itemValue) => {
    setKaynakDepo(itemValue);
    const selectedDepo = depolar.find(depo => depo.Adı === itemValue);
    if (selectedDepo) {
      setSelectedKaynakDepoNo(selectedDepo.No);
    }
  };

  const handleHedefDepoChange = (itemValue) => {
    setHedefDepo(itemValue);
    const selectedDepo = depolar.find(depo => depo.Adı === itemValue);
    if (selectedDepo) {
      setSelectedHedefDepoNo(selectedDepo.No);
    }
  };

  useEffect(() => {
    // Fetch depo values from the API
    axiosLinkMain.get('/Api/Depo/Depolar')
      .then(response => {
        setDepolar(response.data); // Assuming response.data contains the list of depolar
      })
      .catch(error => console.error('Depo fetching error: ', error));
  }, []);

  useEffect(() => {
    // Update faturaBilgileri when any relevant state changes
    setFaturaBilgileri(prevState => ({
      ...prevState,
      sth_evrakno_seri,
      sth_evrakno_sira,
      sym_tarihi: formatDate(date),
      kaynakDepo: selectedKaynakDepoNo,
      hedefDepo: selectedHedefDepoNo,
      sth_personel_kodu: sth_personel_kodu,
      personelListesi,
    }));
  }, [sth_evrakno_seri, sth_evrakno_sira, date, kaynakDepo, hedefDepo, personelListesi, sth_personel_kodu]);



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
      sth_tarih: formattedDate,
    }));
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };


  const fetchPersonelList = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Kullanici/Personeller');
      const data = response.data;
      setPersonelListesi(data); 
    } catch (error) {
      console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
    }
  };

  useEffect(() => {
    const fetchSatisIrsaliyeSerino = async () => {
      try {
        const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${defaults[0].IQ_MikroUserId}`);
        const satisIrsaliyeSerino = response.data[0].IQ_DepolarASeriNo;
        setSth_evrakno_seri(satisIrsaliyeSerino);
  
        if (satisIrsaliyeSerino.trim()) {
          const responseSira = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${satisIrsaliyeSerino}&tip=IRSALIYE`);
          const { Sira } = responseSira.data;
          setSth_evrakno_sira(Sira.toString());
        }
      } catch (error) {
        console.error('API Hatası:', error);
      }
    };

    fetchSatisIrsaliyeSerino();
  }, []);

  const handleEvrakNoChange = async (text) => {
    // Seri numarasını state'e kaydediyoruz
    setSth_evrakno_seri(text);
    
    if (text.trim()) {
      try {
        const response = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${text}&tip=IRSALIYE`);
        const { Sira } = response.data;
        setSth_evrakno_sira(Sira.toString());
      } catch (error) {
        console.error('Bağlantı Hatası Evrak Sıra:', error);
      }
    } else {
      setSth_evrakno_sira(''); 
    }
  };

  const fetchEvrakData = async () => {
    setLoading(true);
    try {
      const response = await axiosLinkMain.get('/Api/Raporlar/IrsaliyeGoster');
      setData(response.data); 

      setIsModalVisible(true); 
    } catch (error) {
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfClick = async (sth_evrakno_seri, sth_evrakno_sira) => {
    try {
      // API'ye isteği yaparken evrakno_seri ve evrakno_sira değerlerini gönderiyoruz
      const response = await axiosLinkMain.get(`/Api/PDF/DepolarArasiPDF?a=${sth_evrakno_seri}&b=${sth_evrakno_sira}`);
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
   // Personel Listele
   const renderPersonelItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePersonelSelect(item)} style={MainStyles.modalItem}>
      <Text style={MainStyles.modalItemText}>{item.No}-{item.Adi}</Text>
    </TouchableOpacity>
  );
// Personel Listele

   // Sorumluluk Merkezi Seçim
   const handlePersonelClick = () => {
    fetchPersonelList(); 
    setIsPersonelModalVisible(true); 
  };

  const handlePersonelSelect = (item) => {
    setSth_personel_kodu(item.No);
    setSth_personel_adi(item.Adi);
    setFaturaBilgileri(prevState => ({
      ...prevState,
      personelListesi: item.No,
    }));
    setIsPersonelModalVisible(false);
  };
// Sorumluluk Merkezi Seçim

  // Evrak No Değişim Alanı
  const handleEvrakNo = (text) => {
    setSth_evrakno_seri(text);
  };
  const handleAddProduct = () => {
    handleClose();
  };
  const handleClose = () => {
    setIsModalVisible(false);
  };
// Evrak No Değişim Alanı

  return (
    <ScrollView style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
      <Text style={MainStyles.formTitle}>Evrak</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput style={MainStyles.inputEvrakNo} value={sth_evrakno_seri}    onChangeText={handleEvrakNoChange} placeholderTextColor={colors.placeholderTextColor} placeholder="Evrak No" />
          <TextInput style={MainStyles.inputEvrakSira}  value={sth_evrakno_sira} placeholderTextColor={colors.placeholderTextColor} placeholder="Evrak Sıra" keyboardType="numeric" />
          <TouchableOpacity onPress={fetchEvrakData} style={MainStyles.buttonEvrakGetir}>
            <Text style={MainStyles.buttonText}>EVRAK GETİR</Text>
          </TouchableOpacity>
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
        <Text style={MainStyles.formTitle}>Kaynak Depo</Text>

        <View style={MainStyles.inputDepoSecin}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsKaynakModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {kaynakDepo ? kaynakDepo : 'Kaynak Depo'}
              </Text>
            </TouchableOpacity>

            {/* iOS için Modal */}
            <Modal visible={isKaynakModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={kaynakDepo}
                    onValueChange={handleKaynakDepoChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Kaynak Depo" value="" />
                    {depolar.map((item) => (
                      <Picker.Item key={`kaynak-${item.Adı}`} label={item.Adı} value={item.Adı} />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsKaynakModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Picker
            selectedValue={kaynakDepo}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
            onValueChange={handleKaynakDepoChange}
          >
            <Picker.Item label="Kaynak Depo" value="" style={MainStyles.inputDepoSecimLabel} />
            {depolar.map((item) => (
              <Picker.Item key={`kaynak-${item.Adı}`} label={item.Adı} value={item.Adı} style={MainStyles.inputDepoSecimLabel} />
            ))}
          </Picker>
        )}
      </View>

      <Text style={MainStyles.formTitle}>Hedef Depo</Text>
      <View style={MainStyles.inputDepoSecin}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsHedefModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {hedefDepo ? hedefDepo : 'Hedef Depo'}
              </Text>
            </TouchableOpacity>

            {/* iOS için Modal */}
            <Modal visible={isHedefModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={hedefDepo}
                    onValueChange={handleHedefDepoChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Hedef Depo" value="" />
                    {depolar.map((item) => (
                      <Picker.Item key={`hedef-${item.Adı}`} label={item.Adı} value={item.Adı} />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsHedefModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Picker
            selectedValue={hedefDepo}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
            onValueChange={handleHedefDepoChange}
          >
            <Picker.Item label="Hedef Depo" value="" style={MainStyles.inputDepoSecimLabel} />
            {depolar.map((item) => (
              <Picker.Item key={`hedef-${item.Adı}`} label={item.Adı} value={item.Adı} style={MainStyles.inputDepoSecimLabel} />
            ))}
          </Picker>
        )}
        </View>

          {/* Personeller 
                  <Text style={MainStyles.formTitle}>Personel</Text>
                  <View style={MainStyles.inputContainer}>
                  <TextInput
                    style={MainStyles.inputCariKodu}
                    placeholder="Personel Kodu"
                    value={sth_personel_kodu.toString()} 
                    placeholderTextColor={colors.placeholderTextColor}
                    editable={false}
                    onFocus={handlePersonelClick}
                  />
                  <TouchableOpacity onPress={handlePersonelClick} style={MainStyles.buttonCariKodu}>
                    <Ara />
                  </TouchableOpacity>
                </View>
                <Text style={MainStyles.formTitle}>Personel Adı</Text>
                <View style={MainStyles.inputContainer}>
                  <TextInput 
                    style={MainStyles.inputPersonelAdi}
                    placeholder="Personel Adı"
                    value={sth_personel_adi} 
                    placeholderTextColor={colors.placeholderTextColor}
                    editable={false}
                  />
                </View>
          */}
        <Modal
          visible={isPersonelModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsPersonelModalVisible(false)}
        >
          <View style={MainStyles.modalContainer}>
            <View style={MainStyles.modalContent}>
              <Text style={MainStyles.modalTitle}>Personel Listesi</Text>
              <FlatList
                data={personelListesi}
                renderItem={renderPersonelItem}
                keyExtractor={item => item.No.toString()}
              />
              <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={() => setIsPersonelModalVisible(false)} >
                  <Left width={17} height={17}/>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>

         {/* Data Table Modal */}
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
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Tarihi</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Seri</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Sıra</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Vergi</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Yekün</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Önizleme</DataTable.Title>
                      </DataTable.Header>

                      <ScrollView >
                        {data.map((item, index) => (
                          <DataTable.Row key={index} style={MainStyles.tableRow}>
                            <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.sth_tarih}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 100, paddingHorizontal: 15 }}>{item.sth_evrakno_seri}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 100 }}>{item.sth_evrakno_sira}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 100 }}>{item.sth_vergi}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.sth_tutar}
                            </DataTable.Cell>
                            <DataTable.Cell style={[MainStyles.withBorder, { width: 150 }]} >
                              <TouchableOpacity onPress={() => handlePdfClick(item.sth_evrakno_seri, item.sth_evrakno_sira)}>
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
        {/* Data Table Modal */}

        </View>
    </ScrollView>
  );
};

export default DepolarArasiSevkFisiBilgisi;
