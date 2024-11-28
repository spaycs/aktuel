import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, ActivityIndicator, Linking, SafeAreaView, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Left, Takvim, Down, PDF } from '../../res/images';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';
import { ProductContext } from '../../context/ProductContext';
import { useAuthDefault } from '../../components/DefaultUser';
import { useAuth } from '../../components/userDetail/Id';
import { DataTable } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import CustomHeader from '../../components/CustomHeader';

const SatinAlmaTalepFisiBilgi = () => {
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
  const [teslimdate, setTeslimDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTeslimDatePicker, setShowTeslimDatePicker] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const [showPersonelModal, setShowPersonelModal] = useState(false);
  const [personelListesi, setPersonelListesi] = useState([]);
  const [selectedKaynakDepoNo, setSelectedKaynakDepoNo] = useState('');
  const [selectedHedefDepoNo, setSelectedHedefDepoNo] = useState('');
  const [sth_personel_kodu, setSth_personel_kodu] = useState([]);
  const [sth_isemri_gider_kodu, setSth_isemri_gider_kodu ] = useState([]);
  const [sth_proje_kodu, setSth_proje_kodu] = useState('');
  const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
  const [isSorumlulukMerkeziModalVisible, setIsSorumlulukMerkeziModalVisible] = useState(false);
  const [isPersonelModalVisible, setIsPersonelModalVisible] = useState(false);
  const [isProjeKoduModalVisible, setIsProjeKoduModalVisible] = useState(false);
  const [sth_stok_srm_merkezi, setSth_stok_srm_merkezi] = useState('');
  const [projeKoduList, setProjeKoduList] = useState([]);
  const [sth_personel_adi, setSth_personel_adi] = useState('');
  const [sth_isemri_gider_adi, setSth_isemri_gider_adi] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [data, setData] = useState([]); 
  const [isEditable, setIsEditable] = useState(false);

  // Kullanıcının Değiştirebilir Alan Yönetimi 
  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_SatinAlmaTalepSeriNoDegistirebilir } = defaults[0];
      setIsEditable(IQ_SatinAlmaTalepSeriNoDegistirebilir === 1);
    }
  }, [defaults]);
// Kullanıcının Değiştirebilir Alan Yönetimi 

  const handleKaynakDepoChange = (itemValue) => {
    setKaynakDepo(itemValue);
    const selectedDepo = depolar.find(depo => depo.Adı === itemValue);
    if (selectedDepo) {
      setSelectedKaynakDepoNo(selectedDepo.No);
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

  const fetchProjeKoduList = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Projeler/ProjeKodlari');
      setProjeKoduList(response.data);
    } catch (error) {
      console.error('Bağlantı Hatası Proje Kodları list:', error);
    }
  };

    // Proje Kodu Listele
    const renderProjeKoduItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleProjeKoduSelect(item)} style={MainStyles.modalItem}>
        <Text style={MainStyles.modalItemText}>{item.Isim}</Text>
      </TouchableOpacity>
    );
  // Proje Kodu Listele

    // Proje Kodu Seçim
    const handleProjeKoduClick = () => {
      fetchProjeKoduList(); 
      setIsProjeKoduModalVisible(true);
    };
  
    const handleProjeKoduSelect = (item) => {
      setSth_proje_kodu(item.Isim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_proje_kodu: item.Kod,
      }));
      setIsProjeKoduModalVisible(false);
    };
  // Proje Kodu Seçim

  useEffect(() => {
    // Update faturaBilgileri when any relevant state changes
    setFaturaBilgileri(prevState => ({
      ...prevState,
      sth_evrakno_seri,
      sth_evrakno_sira,
      sym_tarihi: formatDate(date),
      stl_teslim_tarihi: formatTeslimDate(teslimdate),
      kaynakDepo: selectedKaynakDepoNo,
      sth_personel_kodu: sth_personel_kodu,
      sth_isemri_gider_kodu: sth_isemri_gider_kodu,
      personelListesi,
    }));
  }, [sth_evrakno_seri, sth_evrakno_sira, date, teslimdate, kaynakDepo, personelListesi, sth_isemri_gider_kodu]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate || date);
  };

  const handleTeslimDateChange = (event2, selectedTeslimDate) => {
    setShowTeslimDatePicker(false);
    setTeslimDate(selectedTeslimDate || teslimdate);
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

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate1 = formatTeslimDate(currentDate);
    setTeslimDate(currentDate);
    setFaturaBilgileri(prevState => ({
      ...prevState,
      stl_teslim_tarihi: formattedDate1,
    }));
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const formatTeslimDate = (teslimdate) => {
    const day = teslimdate.getDate().toString().padStart(2, '0');
    const month = (teslimdate.getMonth() + 1).toString().padStart(2, '0');
    const year = teslimdate.getFullYear();
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

  const fetchSorumlulukMerkeziList = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/SorumlulukMerkezi/SorumlulukMerkezi');
      const data = response.data;
      setSorumlulukMerkeziList(data); 
    } catch (error) {
      console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
    }
  };


  useEffect(() => {
    const fetchSatisIrsaliyeSerino = async () => {
      try {
        const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${defaults[0].IQ_MikroUserId}`);
        const satisIrsaliyeSerino = response.data[0].IQ_SatinAlmaTalepSeriNo;
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
        const response = await axiosLinkMain.get(`/Api/Evrak/SatinAlmaTalepGetir?seri=${text}`);
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
      const response = await axiosLinkMain.get(`/Api/StokHareketi/IrsaliyeGetir?seri=${sth_evrakno_seri}&tip=1&cins=5`);
      console.log(response);
      setData(response.data); 

      setIsModalVisible(true); 
    } catch (error) {
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfClick = async (Seri, Sıra) => {
    try {
      // API'ye isteği yaparken evrakno_seri ve evrakno_sira değerlerini gönderiyoruz
      const response = await axiosLinkMain.get(`/Api/PDF/IrsaliyePDF?a=${Seri}&b=${Sıra}`);
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

  // Sorumluluk Merkezi Seçim
    const handleSorumlulukMerkeziClick = () => {
      fetchSorumlulukMerkeziList(); 
      setIsSorumlulukMerkeziModalVisible(true); 
    };
  
    const handleSorumlulukMerkeziSelect = (item) => {
      setSth_stok_srm_merkezi(item.İsim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_stok_srm_merkezi: item.Kod,
      }));
      setIsSorumlulukMerkeziModalVisible(false);
    };
  // Sorumluluk Merkezi Seçim
  
// Personel Listele
   const renderPersonelItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePersonelSelect(item)} style={MainStyles.modalItem}>
      <Text style={MainStyles.modalItemText}>{item.No}-{item.Adi}</Text>
    </TouchableOpacity>
  );
// Personel Listele


// Personel  Seçim
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
// Personel  Seçim


  // Sorumluluk Merkezi Listele
  const renderSorumlulukMerkeziItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSorumlulukMerkeziSelect(item)} style={MainStyles.modalItem}>
      <Text style={MainStyles.modalItemText}>{item.İsim}</Text>
    </TouchableOpacity>
  );
// Sorumluluk Merkezi Listele

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
          <TextInput style={MainStyles.inputEvrakNo} value={sth_evrakno_seri}  editable={isEditable}  onChangeText={handleEvrakNoChange} placeholderTextColor={colors.placeholderTextColor} placeholder="Evrak No" />
          <TextInput style={MainStyles.inputEvrakSira}  value={sth_evrakno_sira} placeholderTextColor={colors.placeholderTextColor} placeholder="Evrak Sıra" keyboardType="numeric" />
          <TouchableOpacity onPress={fetchEvrakData} style={MainStyles.buttonEvrakGetir}>
            <Text style={MainStyles.buttonText}>EVRAK GETİR</Text>
          </TouchableOpacity>
        </View>
        <Text style={MainStyles.formTitle}>Tarih</Text> 
        <View style={MainStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} >
            <View style={MainStyles.dateContainer}>
              <Takvim name="calendar-today" style={MainStyles.dateIcon} />
              <Text style={MainStyles.dateText}>{formatDate(date)}</Text>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <Text style={MainStyles.formTitle}>Teslim Tarih</Text> 
        <View style={MainStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowTeslimDatePicker(true)} >
            <View style={MainStyles.dateContainer}>
              <Takvim name="calendar-today" style={MainStyles.dateIcon} />
              <Text style={MainStyles.dateText}>{formatTeslimDate(teslimdate)}</Text>
            </View>
          </TouchableOpacity>
          {showTeslimDatePicker && (
            <DateTimePicker
              value={teslimdate}
              mode="date"
              display="default"
              onChange={handleTeslimDateChange}
            />
          )}
        </View>
        <Text style={MainStyles.formTitle}>Depo</Text> 
        <View style={MainStyles.inputDepoSecin}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {kaynakDepo ? kaynakDepo : 'Depo'}
              </Text>
            </TouchableOpacity>

            {/* iOS Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={kaynakDepo}
                    onValueChange={handleKaynakDepoChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Depo" value="" />
                    {depolar.map((item) => (
                      <Picker.Item key={`kaynak-${item.Adı}`} label={item.Adı} value={item.Adı} />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
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
            <Picker.Item label="Depo" value="" style={MainStyles.inputDepoSecimLabel} />
            {depolar.map((item) => (
              <Picker.Item key={`kaynak-${item.Adı}`} label={item.Adı} value={item.Adı} style={MainStyles.inputDepoSecimLabel} />
            ))}
          </Picker>
        )}
        </View>
        {/*
          <Text style={MainStyles.formTitle}>Hedef Depo</Text> 
          <View style={MainStyles.inputDepoSecin}>
            <Picker
              selectedValue={hedefDepo}
              style={{ marginHorizontal: -10 }}
              onValueChange={(itemValue) => {
                setHedefDepo(itemValue);
                const selectedDepo = depolar.find(depo => depo.Adı === itemValue);
                if (selectedDepo) {
                  setSelectedHedefDepoNo(selectedDepo.No);
                }
              }}
            >
              <Picker.Item label="Hedef Depo" style={MainStyles.inputDepoSecimLabel} value="" />
              {depolar.map((item) => (
                <Picker.Item key={`hedef-${item.Adı}`} label={item.Adı} value={item.Adı} style={MainStyles.inputDepoSecimLabel} />
              ))}
            </Picker>
          </View>
        */}

         {/* Giderler */}
         <Text style={MainStyles.formTitle}>Talep Eden Personel Kodu</Text> 
         <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputCariKodu}
            placeholder="Talep Eden Personel Kodu"
            value={sth_personel_kodu.toString()} 
            placeholderTextColor={colors.placeholderTextColor}
            editable={false}
            onFocus={handlePersonelClick}
          />
          <TouchableOpacity onPress={handlePersonelClick} style={MainStyles.buttonCariKodu}>
            <Ara />
          </TouchableOpacity>
        </View>

        
        <Text style={MainStyles.formTitle}>Talep Eden Personel Adı</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputPersonelAdi}
            placeholder="Talep Eden Personel Adı"
            value={sth_personel_adi} 
            placeholderTextColor={colors.placeholderTextColor}
            editable={false}
          />
        </View>

        <Modal
          visible={isPersonelModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsPersonelModalVisible(false)}
        >
             <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Personel Listesi"
                onClose={() => setIsPersonelModalVisible(false)}
              />
                  <View style={MainStyles.modalContent}>
              <FlatList
                data={personelListesi}
                renderItem={renderPersonelItem}
                keyExtractor={item => item.No}
              />
            </View>
          </View>
        </Modal>
        

         {/* Sorumluluk Merkezi */}
         <Text style={MainStyles.formTitle}>Sorumluluk Merkezi</Text> 
         <View style={MainStyles.inputContainer}>
            <TextInput
              style={MainStyles.inputCariKodu}
              placeholder="Sorumluluk Merkezi"
              placeholderTextColor={colors.placeholderTextColor}
              value={sth_stok_srm_merkezi}
              onFocus={handleSorumlulukMerkeziClick} 
            />
            <TouchableOpacity onPress={handleSorumlulukMerkeziClick} style={MainStyles.buttonCariKodu}>
            <Ara />
            </TouchableOpacity>
          </View>
          <Modal
            visible={isSorumlulukMerkeziModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsSorumlulukMerkeziModalVisible(false)}
          >
               <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Sorumluluk Merkezleri"
                onClose={() => setIsSorumlulukMerkeziModalVisible(false)}
              />
                  <View style={MainStyles.modalContent}>
                <FlatList
                  data={sorumlulukMerkeziList}
                  renderItem={renderSorumlulukMerkeziItem}
                  keyExtractor={item => item.Kod.toString()}
                />
              </View>
            </View>
          </Modal>
        {/* Sorumluluk Merkezi */}

         {/* Proje Kodları*/}
         <Text style={MainStyles.formTitle}>Proje</Text> 
          <View style={MainStyles.inputContainer}>
            <TextInput
              style={MainStyles.inputCariKodu}
              value={sth_proje_kodu}
              placeholder="Proje Kodu"
              placeholderTextColor={colors.placeholderTextColor}
              onChangeText={setSth_proje_kodu}
            />
            <TouchableOpacity onPress={handleProjeKoduClick} style={MainStyles.buttonCariKodu}>
            <Ara />
            </TouchableOpacity>
          </View>
      
          <Modal 
            visible={isProjeKoduModalVisible} 
            transparent= {true}
            animationType="slide"
            onRequestClose={() => setIsProjeKoduModalVisible(false)} 
            >
              <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Proje Kodları"
                onClose={() => setIsProjeKoduModalVisible(false)}
              />
              <View style={MainStyles.modalContent}>

                <FlatList
                  data={projeKoduList}
                  keyExtractor={(item) => item.Kod.toString()}
                  renderItem={renderProjeKoduItem}
                />
            </View>
            </View>
          </Modal>
        {/* Proje Kodları*/}

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
              <View style={MainStyles.modalContent}>
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
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 200 }]}>Cari Kodu</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Cari Ünvan</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Türü</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Vergi</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>İskonto</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Yekün</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Önizleme</DataTable.Title>
                      </DataTable.Header>

                      <ScrollView style={{ maxHeight: 600 }}>
                        {data.map((item, index) => (
                          <DataTable.Row key={index} style={MainStyles.tableRow}>
                            <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Tarihi}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 100, paddingHorizontal: 15 }}>{item.Seri}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 100 }}>{item.Sıra}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 200 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Cari_Kod}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 100 }}>{item.Cari_Ünvan}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.N_İ}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Toplam_Vergi}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Toplam_Iskonto}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Toplam_Tutar}
                            </DataTable.Cell>
                            <DataTable.Cell style={[MainStyles.withBorder, { width: 150 }]} >
                              <TouchableOpacity onPress={() => handlePdfClick(item.Seri, item.Sıra)}>
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

export default SatinAlmaTalepFisiBilgi;
