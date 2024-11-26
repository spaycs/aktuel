import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Left, PDF, Takvim, TakvimVade } from '../../res/images';
import { ProductContext } from '../../context/ProductContext';
import { useAuthDefault } from '../../components/DefaultUser';
import ProductModal from '../../context/ProductModal';
import CariListModal from '../../context/CariListModal';
import { useFocusEffect } from '@react-navigation/native';
import axiosLinkMain from '../../utils/axiosMain';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { DataTable } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';
import CustomHeader from '../../components/CustomHeader';

const TahsilatTediyeBilgisi = () => {
  const [data, setData] = useState([]); // Veri tutmak için state
  const [loading, setLoading] = useState(false); // Yükleme durumunu kontrol etmek için state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal görünürlük kontrolü
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [sth_evrakno_seri, setSth_evrakno_seri] = useState('');
  const [sth_evrakno_sira, setSth_evrakno_sira] = useState('');
  const [cha_vade, setCha_vade] = useState('');
  const [irsaliyeTipi, setIrsaliyeTipi] = useState('Tahsilat');
  const [date, setDate] = useState(new Date());
  const [evrakDate, setEvrakDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEvrakDatePicker, setShowEvrakDatePicker] = useState(false);
  const [sth_cari_kodu, setSth_cari_kodu] = useState('');
  const [sth_cari_unvan1, setSth_cari_unvan1] = useState('');
  const [sth_har_doviz_cinsi, setSth_har_doviz_cinsi] = useState('');
  const [dovizList, setDovizList] = useState([]);
  const [sth_stok_srm_merkezi, setSth_stok_srm_merkezi] = useState('');
  const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
  const [sth_proje_kodu, setSth_proje_kodu] = useState('');
  const [projeKoduList, setProjeKoduList] = useState([]);
  const [sth_odeme_op, setSth_odeme_op] = useState('');
  const [gValue, setGValue] = useState('');
  const [tValue, setTValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [vadeList, setVadeList] = useState([]);
  const [selectedVadeNo, setSelectedVadeNo] = useState(null); 

  
  const { faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [isSorumlulukMerkeziModalVisible, setIsSorumlulukMerkeziModalVisible] = useState(false);
  const [isProjeKoduModalVisible, setIsProjeKoduModalVisible] = useState(false);
  const [isVadeModalVisible, setIsVadeModalVisible] = useState(false);
  const [isGModalVisible, setIsGModalVisible] = useState(false);
  const [isTModalVisible, setIsTModalVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [pickerEditable, setPickerEditable] = useState(true);
  const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);
  const [isEvrakTipModalVisible, setIsEvrakTipModalVisible] = useState(false);
  
  const pickerOptions = [
    { label: 'Tahsilat Makbuzu', value: 'Tahsilat' },
    { label: 'Tediye Makbuzu', value: 'Tediye' },
  ];

  const getSelectedDovizAd = () => {
    const selectedDoviz = dovizList.find(doviz => doviz.Doviz_Cins.toString() === sth_har_doviz_cinsi);
    return selectedDoviz ? selectedDoviz.Doviz_Adı : 'Döviz Tipini Seçin';
  };

  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_SatisIrsaliyeSeriNoDegistirebilir } = defaults[0];
  
      setIsEditable(IQ_SatisIrsaliyeSeriNoDegistirebilir === 1);
  
    }
  }, [defaults]);

  useEffect(() => {
    setFaturaBilgileri(prevState => ({
      ...prevState,
      sth_normal_iade: 0,
      sth_evraktip: 1,
      sth_evrakno_seri: sth_evrakno_seri,
      sth_evrakno_sira: sth_evrakno_sira,
      sth_cari_kodu: sth_cari_kodu,
      sth_cari_unvan1: sth_cari_unvan1,
      sth_har_doviz_cinsi: sth_har_doviz_cinsi,
      sth_odeme_op: sth_odeme_op,
      cha_vade: cha_vade,
      sth_proje_kodu: sth_proje_kodu,
      sth_stok_srm_merkezi: sth_stok_srm_merkezi,
     
    }));
  }, [sth_evrakno_seri,sth_evrakno_sira,sth_cari_kodu, sth_cari_unvan1] );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setFaturaBilgileri({});
      };
    }, [])
  );

  useEffect(() => {
    fetchDovizList();
    handleIrsaliyeTipiChange('Tahsilat');
  }, []);

  // İrsaliye Tipi Varsayılan Seçim
    const handleIrsaliyeTipiChange = (itemValue) => {
      setIrsaliyeTipi(itemValue);
      let setirsaliyeTipi = 0;
      let sth_evraktip = 0;

      switch (itemValue) {
        case 'Tahsilat':
          sth_tip = 1;
          sth_evraktip = 1;
          break;
        case 'Tediye':
          sth_tip = 0;
          sth_evraktip = 64;
          break;
        default:
          break;
      }
      
      setFaturaBilgileri(prevState => ({
      ...prevState,
      sth_tip,
      sth_evraktip,
    }));
    };
  // İrsaliye Tipi Varsayılan Seçim

  // Evrak Tarih Alanı
    useEffect(() => {
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      setEvrakDate(currentDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_tarih: formattedDate,
      }));
    }, []);

    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      const newDate = selectedDate || date;
      setEvrakDate(newDate);

      const formattedDate = formatDate(newDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_tarih: formattedDate,
      }));
    };

    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };
  // Evrak Tarih Alanı

  // Cari Seçim
    const handleCariKoduClick = () => {
      setIsCariListModalVisible(true);
    };

    const handleCariSelect = (cari) => {
      const selectedCariKodu = cari.Cari_Kod;
    
      setSth_cari_kodu(selectedCariKodu);
      setSth_cari_unvan1(cari.Ünvan);
      setFaturaBilgileri((prevState) => ({
        ...prevState,
        sth_cari_kodu: selectedCariKodu,
        sth_cari_unvan1: cari.Ünvan,
      }));
      
      fetchDovizList(selectedCariKodu);
      
      setIsCariListModalVisible(false);
    };

    useEffect(() => {
      if (sth_cari_kodu) {
        fetchDovizList(sth_cari_kodu);
      }
    }, [sth_cari_kodu]);

  // Cari Seçim

  // Döviz Seçim
    const handleDovizChange = (itemValue) => {
      setSth_har_doviz_cinsi(itemValue);
      setFaturaBilgileri((prev) => ({
        ...prev,
        sth_har_doviz_cinsi: itemValue,
      }));
    };
  // Döviz Seçim

  // Vade Seçim
    const handleVadeClick = () => {
      fetchVadeList(); 
      setIsVadeModalVisible(true); 
    };
    
    const handleVadeSelect = (item) => {
      setCha_vade(item.Isim); 
      setSelectedVadeNo(item.No); 
      setIsVadeModalVisible(false);

      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_vade: item.No,
      }));
    };

    const handleGClick = () => {
      setIsGModalVisible(true);
    };
    
    const handleGValueChange = (text) => {
      setGValue(text);
    };
    
    const handleAddGValue = () => {
      if (gValue) {
        const negativeGValue = `-${gValue}`; 
        setCha_vade(gValue); 
        setFaturaBilgileri(prevState => ({
          ...prevState,
          cha_vade: negativeGValue, 
        }));
        setGValue(''); 
      }
      setIsGModalVisible(false); 
    };

    const handleTClick = () => {
      setIsTModalVisible(true);
    };
    
    const handleTValueChange = (text) => {
      setTValue(text);
    };
    
    const handleTDateChange = (event, selectedDate) => {
      const currentDate = selectedDate || evrakDate;
      setShowEvrakDatePicker(false);
      setEvrakDate(currentDate); 
    };
    
    const handleAddTValue = () => {
      if (evrakDate) {
        const formattedDateForDisplay = formatDateForDisplay(evrakDate); 
        const formattedDateForAPI = formatDateForAPI(evrakDate); 
    
        setCha_vade(formattedDateForDisplay); 
        setFaturaBilgileri(prevState => ({
          ...prevState,
          cha_vade: formattedDateForAPI, 
        }));
      }
      setIsTModalVisible(false); 
    };
    
    const formatDateForDisplay = (evrakDate) => {
      const day = (`0${evrakDate.getDate()}`).slice(-2);
      const month = (`0${evrakDate.getMonth() + 1}`).slice(-2);
      const year = evrakDate.getFullYear();
      return `${day}.${month}.${year}`;
    };
    
    const formatDateForAPI = (evrakDate) => {
      const year = evrakDate.getFullYear();
      const month = (`0${evrakDate.getMonth() + 1}`).slice(-2);
      const day = (`0${evrakDate.getDate()}`).slice(-2);
      return `${year}${month}${day}`;
    };
  // Vade Seçim

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

  // Api Bağlantıları
    const fetchDovizList = async () => {
      try {
        const response = await axiosLinkMain.get(`/Api/Kur/CariKuru?cari=${sth_cari_kodu}`);
    
        const filteredDovizList = [];
        
        response.data.forEach((doviz) => {
          if (doviz.Doviz_Adı) {
            filteredDovizList.push({ Doviz_Cins: doviz.Doviz_Cins, Doviz_Adı: doviz.Doviz_Adı });
          }
          if (doviz.Doviz_Adı1) {
            filteredDovizList.push({ Doviz_Cins: doviz.Doviz_Cins1, Doviz_Adı: doviz.Doviz_Adı1 });
          }
          if (doviz.Doviz_Adı2) {
            filteredDovizList.push({ Doviz_Cins: doviz.Doviz_Cins2, Doviz_Adı: doviz.Doviz_Adı2 });
          }
        });
    
        setDovizList(filteredDovizList);

        // Döviz listesi yüklendikten sonra ilk sıradaki dövizi otomatik seç
        if (filteredDovizList.length > 0) {
          const firstDovizCins = filteredDovizList[0].Doviz_Cins.toString();
          setSth_har_doviz_cinsi(firstDovizCins);
          setFaturaBilgileri((prev) => ({
            ...prev,
            sth_har_doviz_cinsi: firstDovizCins,
          }));
        }
      } catch (error) {
        console.error('Bağlantı Hatası Döviz list:', error);
      }
    };

    const fetchVadeList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/OdemePlanlari/OdemePlanlari');
        const data = response.data;
        setVadeList(data); 
      } catch (error) {
        console.error('Bağlantı Hatası Vade Alanı list:', error);
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

    const fetchProjeKoduList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Projeler/ProjeKodlari');
        setProjeKoduList(response.data);
      } catch (error) {
        console.error('Bağlantı Hatası Proje Kodları list:', error);
      }
    };

    useEffect(() => {
      const fetchSatisIrsaliyeSerino = async () => {
        try {
          const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${defaults[0].IQ_MikroUserId}`);
          const satisIrsaliyeSerino = response.data[0].IQ_TahsilatSeriNo;
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
        const response = await axiosLinkMain.get(`/Api/Evrak/TahsilatTediyeGetir?evraktip=${faturaBilgileri.sth_evraktip}`);
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

  // Api Bağlantıları

  // Sorumluluk Merkezi Listele
    const renderSorumlulukMerkeziItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleSorumlulukMerkeziSelect(item)} style={MainStyles.modalItem}>
        <Text style={MainStyles.modalItemText}>{item.İsim}</Text>
      </TouchableOpacity>
    );
  // Sorumluluk Merkezi Listele

  // Proje Kodu Listele
    const renderProjeKoduItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleProjeKoduSelect(item)} style={MainStyles.modalItem}>
        <Text style={MainStyles.modalItemText}>{item.Isim}</Text>
      </TouchableOpacity>
    );
  // Proje Kodu Listele

  // Vade Listele
      const renderVadeItem = ({ item }) => (
        <TouchableOpacity 
          style={MainStyles.modalItem} 
          onPress={() => handleVadeSelect(item)}
        >
          <Text style={MainStyles.modalItemText}>{item.Isim}</Text>
        </TouchableOpacity>
      );
  // Vade Listele

  const handleRowPress = (item) => {
    setSth_evrakno_seri(item.sth_evrakno_seri);
    setSth_evrakno_sira(item.sth_evrakno_sira);
    setSth_cari_kodu(item.sth_cari_kodu);
    console.log('Sth Evrak No Seri:', item.sth_evrakno_seri);
    console.log('Sth Evrak No Sıra:', item.sth_evrakno_sira);
    console.log('Sth Evrak No Sıra:', item.sth_cari_kodu);
    setIsModalVisible(false); // Modalı kapat
  };
  

  const formatDateWithoutTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <ScrollView style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
      <Text style={MainStyles.formTitle}>Evrak</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputEvrakNo}
            value={sth_evrakno_seri}
            onChangeText={handleEvrakNoChange}
            placeholder="Evrak No"
            placeholderTextColor={colors.placeholderTextColor}
            editable={isEditable} 
          />
          <TextInput 
            style={MainStyles.inputEvrakSira} 
            value={sth_evrakno_sira}
            placeholder="Evrak Sıra"
            editable={false}
            keyboardType="numeric"
            placeholderTextColor={colors.placeholderTextColor} />
          <TouchableOpacity onPress={fetchEvrakData} style={MainStyles.buttonEvrakGetir}>
            <Text style={MainStyles.buttonText}>EVRAK GETİR</Text>
          </TouchableOpacity>
        </View>

        <Text style={MainStyles.formTitle}>Tarih </Text> 
        <View style={MainStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} >
            <View style={MainStyles.dateContainer}>
              <Takvim name="calendar-today" style={MainStyles.dateIcon} />
              <Text style={MainStyles.dateText}>{formatDate(evrakDate)}</Text>
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={evrakDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <Text style={MainStyles.formTitle}>Evrak Tipi</Text>
        <View style={MainStyles.inputStyleAlinanSiparis}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsEvrakTipModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {irsaliyeTipi ? irsaliyeTipi : 'Tipini Seçin'}
              </Text>
            </TouchableOpacity>

            {/* iOS için Modal */}
            <Modal visible={isEvrakTipModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={irsaliyeTipi}
                    onValueChange={handleIrsaliyeTipiChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Tipini Seçin" value="" />
                    {pickerOptions.map((option, index) => (
                      <Picker.Item key={index} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsEvrakTipModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={irsaliyeTipi}
            onValueChange={handleIrsaliyeTipiChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Tipini Seçin" value="" style={MainStyles.textStyle} />
            {pickerOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} style={MainStyles.textStyle} />
            ))}
          </Picker>
        )}
        </View>
        
        <Text style={MainStyles.formTitle}>Cari Seçimi</Text>
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputCariKodu}
            placeholder="Cari Kodu"
            value={sth_cari_kodu}
            placeholderTextColor={colors.placeholderTextColor}
            autoFocus={true}
            selection={{start:0, end:0}}
            editable={false}
          />
          <TextInput 
            style={MainStyles.inputCariUnvan}
            placeholder="Cari Ünvan"
            value={sth_cari_unvan1} 
            placeholderTextColor={colors.placeholderTextColor}
            autoFocus={true}
            selection={{start:0, end:0}}
            editable={false}
          />
          <TouchableOpacity onPress={handleCariKoduClick} style={MainStyles.buttonCariKodu}>
            <Ara />
          </TouchableOpacity>
        </View>

        {/* Doviz Seçim */}
        <Text style={MainStyles.formTitle}>Döviz</Text>
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
                    selectedValue={sth_har_doviz_cinsi}
                    onValueChange={handleDovizChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Döviz Tipi" value="" />
                    {dovizList.map((doviz) => (
                      <Picker.Item
                        key={doviz.Doviz_Cins}
                        label={doviz.Doviz_Adı}
                        value={doviz.Doviz_Cins.toString()}
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
            selectedValue={sth_har_doviz_cinsi}
            onValueChange={handleDovizChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Döviz Tipi" value="" style={MainStyles.textStyle} />
            {dovizList.map((doviz) => (
              <Picker.Item
                key={doviz.Doviz_Cins}
                label={doviz.Doviz_Adı}
                value={doviz.Doviz_Cins.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        )}
          </View>
        {/* Doviz Seçim */}

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

        {/* Vade */}
        <Text style={MainStyles.formTitle}>Vade</Text> 
            <View style={MainStyles.inputContainer}>
              <TextInput
                style={MainStyles.inputVadeTahsilatTediye}
                placeholder="Vade"
                value={cha_vade}
                onFocus={handleVadeClick} 
                placeholderTextColor={colors.placeholderTextColor}
              />
             
              <TouchableOpacity onPress={handleTClick} style={MainStyles.buttonVadeT}>
                <TakvimVade/>
              </TouchableOpacity>

              <Modal
                visible={isTModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsTModalVisible(false)}
              >
                  <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Vade Tarih Girişi"
                onClose={() => setIsTModalVisible(false)}
              />
                    <View style={MainStyles.modalContent}>
                    <TouchableOpacity
                        style={MainStyles.dateButton}
                        onPress={() => setShowEvrakDatePicker(true)}
                      >
                        <View style={MainStyles.dateContainer}>
                          <Takvim name="calendar-today" style={MainStyles.dateIcon} />
                          <Text style={MainStyles.datePickerText}>
                            {formatDateForDisplay(evrakDate)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      {showEvrakDatePicker && (
                        <DateTimePicker
                          value={evrakDate || new Date()} 
                          mode="date"
                          display="default"
                          onChange={handleTDateChange}
                        />
                      )}
                    <TouchableOpacity onPress={handleAddTValue} style={MainStyles.addButton}>
                      <Text style={MainStyles.addButtonText}>Ekle</Text>
                    </TouchableOpacity>
                   
                  </View>
                </View>
              </Modal>
            </View>
        {/* Vade */}

        {/* Data Table Modal */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Son Kaydedilen Evraklar</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={handleClose}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
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
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Tip</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Kasa Banka</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 200 }]}>Cari Kodu</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 200 }]}>Cari Ünvan</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Yekün</DataTable.Title>
                        <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Önizleme</DataTable.Title>
                      </DataTable.Header>

                      <ScrollView style={{ maxHeight: 600 }}>
                        {data.map((item, index) => (
                          <DataTable.Row key={index} style={MainStyles.tableRow}>
                            <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Tarih}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 100, paddingHorizontal: 15 }}>{item.Seri}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 100 }}>{item.Sıra}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Tip}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 100 }}>{item.Kasa_Banka}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 200 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Cari_Kod}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 200 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Cari_Ünvan}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                              {item.Yekün}
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
            </SafeAreaView>
          </Modal>
        {/* Data Table Modal */}

        <CariListModal
          isVisible={isCariListModalVisible}
          onSelectCari={handleCariSelect}
          onClose={() => setIsCariListModalVisible(false)}
        />
    </View>
    </ScrollView>
  );
};

export default TahsilatTediyeBilgisi;
