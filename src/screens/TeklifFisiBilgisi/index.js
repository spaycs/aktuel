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
import AdresListModal from '../../context/AdresListModal';
import Button from '../../components/Button';

const TeklifFisiBilgisi = () => {
  const [data, setData] = useState([]); // Veri tutmak için state
  const [loading, setLoading] = useState(false); // Yükleme durumunu kontrol etmek için state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal görünürlük kontrolü
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [sth_evrakno_seri, setSth_evrakno_seri] = useState('');
  const [sth_evrakno_sira, setSth_evrakno_sira] = useState('');
  const [irsaliyeTipi, setIrsaliyeTipi] = useState('Verilen Teklif');
  const [date, setDate] = useState(new Date());
  const [evrakDate, setEvrakDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEvrakDatePicker, setShowEvrakDatePicker] = useState(false);
  const [sth_cari_kodu, setSth_cari_kodu] = useState('');
  const [sth_cari_unvan1, setSth_cari_unvan1] = useState('');
  const [sth_har_doviz_cinsi, setSth_har_doviz_cinsi] = useState('');
  const [dovizList, setDovizList] = useState([]);
  const [sth_cikis_depo_no, setSth_cikis_depo_no] = useState('');
  const [depoList, setDepoList] = useState([]);
  const [sth_stok_srm_merkezi, setSth_stok_srm_merkezi] = useState('');
  const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
  const [sth_adres_no, setSth_adres_no] = useState('');
  const [adresList, setAdresList] = useState([]);
  const [sth_proje_kodu, setSth_proje_kodu] = useState('');
  const [projeKoduList, setProjeKoduList] = useState([]);
  const [sth_odeme_op, setSth_odeme_op] = useState('');
  const [vadeList, setVadeList] = useState([]);
  const [gValue, setGValue] = useState('');
  const [tValue, setTValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [baslangicTarih, setBaslangicTarih] = useState(new Date());
  const [gecerlilikTarih, setGecerlilikTarih] = useState(new Date());
  const [showBaslangicDatePicker, setShowBaslangicDatePicker] = useState(false);
  const [showGecerlilikDatePicker, setShowGecerlilikDatePicker] = useState(false);
  
  const { faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [isAdresListModalVisible, setIsAdresListModalVisible] = useState(false);
  const [isSorumlulukMerkeziModalVisible, setIsSorumlulukMerkeziModalVisible] = useState(false);
  const [isProjeKoduModalVisible, setIsProjeKoduModalVisible] = useState(false);
  const [isVadeModalVisible, setIsVadeModalVisible] = useState(false);
  const [isGModalVisible, setIsGModalVisible] = useState(false);
  const [isTModalVisible, setIsTModalVisible] = useState(false);
  const [isAdresModalVisible, setIsAdresModalVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [pickerEditable, setPickerEditable] = useState(true);
  const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);

  const getSelectedDovizAd = () => {
    const selectedDoviz = dovizList.find(doviz => doviz.Doviz_Cins.toString() === sth_har_doviz_cinsi);
    return selectedDoviz ? selectedDoviz.Doviz_Adı : 'Döviz Tipini Seçin';
  };

  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_SatisIrsaliyeSeriNoDegistirebilir, IQ_CikisDepoNoDegistirebilir } = defaults[0];
  
      setIsEditable(IQ_SatisIrsaliyeSeriNoDegistirebilir === 1);
  
      setPickerEditable(IQ_CikisDepoNoDegistirebilir === 1);
    }
  }, [defaults]);

  useEffect(() => {
    setFaturaBilgileri(prevState => ({
      ...prevState,
      sth_normal_iade: 0,
      sth_evraktip: 1,
      sth_cari_cinsi: 0,
      sth_evrakno_seri: sth_evrakno_seri,
      sth_evrakno_sira: sth_evrakno_sira,
      sth_cari_kodu: sth_cari_kodu,
      sth_cari_unvan1: sth_cari_unvan1,
      sth_cikis_depo_no: sth_cikis_depo_no,
      sth_har_doviz_cinsi: sth_har_doviz_cinsi,
      sth_odeme_op: sth_odeme_op,
      sth_proje_kodu: sth_proje_kodu,
      sth_stok_srm_merkezi: sth_stok_srm_merkezi,
     
    }));
  }, [sth_evrakno_seri,sth_evrakno_sira,sth_cari_kodu, sth_cari_unvan1, sth_cikis_depo_no] );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setFaturaBilgileri({});
      };
    }, [])
  );

  useEffect(() => {
    fetchDovizList();
    fetchDepoList();
    handleIrsaliyeTipiChange('Verilen Teklif');
  }, []);

  // İrsaliye Tipi Varsayılan Seçim
    const handleIrsaliyeTipiChange = (itemValue) => {
      setIrsaliyeTipi(itemValue);
      let setirsaliyeTipi = 0;
      let sth_cins = 0;

      switch (itemValue) {
        case 'Verilen Teklif':
          sth_tip = 1;
          sth_cins = 0;
          break;
        default:
          break;
      }
      
      setFaturaBilgileri(prevState => ({
      ...prevState,
      sth_tip,
      sth_cins,
    }));
    };
  // İrsaliye Tipi Varsayılan Seçim

  // Evrak Tarih Alanı
    useEffect(() => {
      // Evrak Tarihini başlangıç olarak ayarla
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      setDate(currentDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_tarih: formattedDate, // Evrak Tarihi
        sth_bas_tarih: formattedDate, // Başlangıç Tarihi
        sth_gec_tarih: formattedDate, // Geçerlilik Tarihi
      }));
    }, []); // Bu useEffect sadece bileşen ilk yüklendiğinde çalışır
    
    // Kullanıcı tarih değiştirdiğinde Evrak Tarihini güncelle
    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      const newDate = selectedDate || date;
      setDate(newDate);
    
      const formattedDate = formatDate(newDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_tarih: formattedDate, // Evrak Tarihi
      }));
    };
    
    // Kullanıcı tarih değiştirdiğinde Başlangıç Tarihini güncelle
    const handleBaslangicDateChange = (event, selectedDate) => {
      setShowBaslangicDatePicker(false);
      const newDate = selectedDate || baslangicTarih;
      setBaslangicTarih(newDate);
    
      const formattedDate = formatDate(newDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_bas_tarih: formattedDate, // Başlangıç Tarihi
      }));
    };
    
    // Kullanıcı tarih değiştirdiğinde Geçerlilik Tarihini güncelle
    const handleGecerlilikDateChange = (event, selectedDate) => {
      setShowGecerlilikDatePicker(false);
      const newDate = selectedDate || gecerlilikTarih;
      setGecerlilikTarih(newDate);
    
      const formattedDate = formatDate(newDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_gec_tarih: formattedDate, // Geçerlilik Tarihi
      }));
    };
    
    // Tarihi istediğiniz formatta oluşturur
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

    const handleCariSelect = async (cari) => {
      const selectedCariKodu = cari.Cari_Kod;
    
      setSth_cari_kodu(selectedCariKodu);
      setSth_cari_unvan1(cari.Ünvan);
      setFaturaBilgileri((prevState) => ({
        ...prevState,
        sth_cari_kodu: selectedCariKodu,
        sth_cari_unvan1: cari.Ünvan,
      }));
    
      setSth_adres_no('');
      setFaturaBilgileri((prevState) => ({
        ...prevState,
        sth_adres_no: null,
      }));
      
      fetchDovizList(selectedCariKodu);
      // Adres listesini tekrar API'den çek
      const adresList = await fetchAdresList(selectedCariKodu);

      if (adresList && adresList.length > 0) {
        // İlk adresi otomatik olarak seç
        const firstAddress = adresList[0];
        setSth_adres_no(firstAddress.Adres);
        setFaturaBilgileri((prevState) => ({
          ...prevState,
          sth_adres_no: firstAddress.Adres_No,
        }));
      } else {
        console.log("Adres listesi boş geldi.");
      }

       // Ödeme planını seçme işlemi
       if (cari.cari_odemeplan_no) {
        const odemePlanNo = cari.cari_odemeplan_no;

        try {
          // Ödeme planlarını API'den fetch et
          const odemePlanlariList = await fetchVadeList();
          
          // Gelen listenin varlığını ve doluluğunu kontrol et
          if (odemePlanlariList && odemePlanlariList.length > 0) {
            // Ödeme planı listesinde cari_odemeplan_no ile eşleşen değeri bul
            const selectedOdemePlan = odemePlanlariList.find(
              (plan) => plan.No === odemePlanNo
            );

            if (selectedOdemePlan) {
              // Ödeme planını set et
              setSth_odeme_op(selectedOdemePlan.Isim);
              
              // Fatura bilgilerini güncelle
              setFaturaBilgileri(prevState => ({
                ...prevState,
                sth_odeme_op: selectedOdemePlan.No, // Burada No'yu gönderiyoruz
              }));
            } else {
              console.log("Eşleşen ödeme planı bulunamadı.");
            }
          } else {
            console.log("Ödeme planları listesi boş.");
          }
        } catch (error) {
          console.error("Odeme planı fetch edilirken hata:", error);
        }
      }

      setIsCariListModalVisible(false);
    };

    useEffect(() => {
      if (sth_cari_kodu) {
        fetchDovizList(sth_cari_kodu);
      }
      fetchDepoList();
    }, [sth_cari_kodu]);

  // Cari Seçim

  // Depo Seçim
    const handleDepoChange = (itemValue) => {
      setSth_cikis_depo_no(itemValue);
      setFaturaBilgileri((prev) => ({
        ...prev,
        sth_cikis_depo_no: itemValue,
      }));
    };
  // Depo Seçim

  // Döviz Seçim
    const handleDovizChange = (itemValue) => {
      setSth_har_doviz_cinsi(itemValue);
      setFaturaBilgileri((prev) => ({
        ...prev,
        sth_har_doviz_cinsi: itemValue,
      }));
    };
  // Döviz Seçim

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

  // Adres Seçim
    const handleAdresClick = async () => {
      const fetchedAdresList = await fetchAdresList(sth_cari_kodu); // Adres listesini çek
      setAdresList(fetchedAdresList); // Çekilen adresleri state'e ata
      setIsAdresListModalVisible(true); // Modalı göster
    };
  
    const handleAdresSelect = (item) => {
      setSth_adres_no(item.Adres);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_adres_no: item.Adres_No,
      }));
      setIsAdresListModalVisible(false);
    };
  // Adres Seçim

  // Vade Seçim
    const handleVadeClick = () => {
      fetchVadeList(); 
      setIsVadeModalVisible(true); 
    };
    
    const handleVadeSelect = (item) => {
      setSth_odeme_op(item.Isim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_odeme_op: item.No,
      }));
      setIsVadeModalVisible(false);
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
        setSth_odeme_op(gValue); 
        setFaturaBilgileri(prevState => ({
          ...prevState,
          sth_odeme_op: negativeGValue, 
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
    
        setSth_odeme_op(formattedDateForDisplay); 
        setFaturaBilgileri(prevState => ({
          ...prevState,
          sth_odeme_op: formattedDateForAPI, 
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
   
    const fetchDepoList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Depo/Depolar');
        const depoData = response.data;
        setDepoList(depoData);
    
        const defaultDepo = depoData.find(depo => depo.No === defaults[0]?.IQ_CikisDepoNo);
    
        if (defaultDepo) {
          setSth_cikis_depo_no(defaultDepo.No.toString());
          setFaturaBilgileri((prev) => ({
            ...prev,
            sth_cikis_depo_no: defaultDepo.No.toString(),
          }));
        }
      } catch (error) {
        console.error('Bağlantı Hatası Döviz list:', error);
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

    const fetchAdresList = async (sth_cari_kodu) => {
        try {
          const response = await axiosLinkMain.get(`/Api/Adres/CariAdresler?cari=${sth_cari_kodu}`);
          const data = response.data;
          setAdresList(data); 
          return data; // Listeyi geri döndür
        } catch (error) {
          console.error('Bağlantı Hatası Adres list:', error);
          return [];
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
          const IQ_VerilenTSeriNo = response.data[0].IQ_VerilenTSeriNo;
          setSth_evrakno_seri(IQ_VerilenTSeriNo);
    
          if (IQ_VerilenTSeriNo.trim()) {
            const responseSira = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${IQ_VerilenTSeriNo}&tip=TEKLIF`);
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
          const response = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${text}&tip=TEKLIF`);
          const { Sira } = response.data;
          setSth_evrakno_sira(Sira.toString());
        } catch (error) {
          console.error('Bağlantı Hatası Evrak Sıra:', error);
        }
      } else {
        setSth_evrakno_sira(''); 
      }
    };

    const fetchVadeList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/OdemePlanlari/OdemePlanlari');
        const data = response.data;
        setVadeList(data); 
        return data; 
      } catch (error) {
        console.error('Bağlantı Hatası Vade Alanı list:', error);
        return [];
      }
    };

    const handlePdfClick = async (Seri, Sıra) => {
      try {
        // API'ye isteği yaparken evrakno_seri ve evrakno_sira değerlerini gönderiyoruz
        const response = await axiosLinkMain.get(`/Api/PDF/TeklifPDF?seri=${Seri}&sira=${Sıra}`);
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
  
  // Adres Listele
    const renderAdresItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleAdresSelect(item)} style={MainStyles.modalItem}>
        <Text style={MainStyles.modalItemText}>{item.Adres}</Text>
        <Text style={MainStyles.modalSubItemText}>{`${item.Il}, ${item.Ilce}`}</Text> 
      </TouchableOpacity>
    );
  // Adres Listele

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

  // Proje Kodu Listele
    const renderProjeKoduItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleProjeKoduSelect(item)} style={MainStyles.modalItem}>
        <Text style={MainStyles.modalItemText}>{item.Isim}</Text>
      </TouchableOpacity>
    );
  // Proje Kodu Listele


  const fetchEvrakData = async () => {
    setLoading(true);
    try {
      const response = await axiosLinkMain.get(`/Api/teklif/TeklifGetir?seri=${sth_evrakno_seri}`);
      setData(response.data); 

      setIsModalVisible(true); 
    } catch (error) {
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={MainStyles.formTitle}>Tip</Text>
        <View style={MainStyles.inputStyleAlinanSiparis}>
        {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsModalVisible(true)} style={MainStyles.pickerTouchable}>
            <Text style={[MainStyles.textStyle, { fontSize: 12 }]}>
              {irsaliyeTipi ? irsaliyeTipi : 'Tipini Seçin'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal */}
          <Modal visible={isModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={irsaliyeTipi}
                  onValueChange={handleIrsaliyeTipiChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Tipini Seçin" value="" style={MainStyles.textStyle} />
                  <Picker.Item label="Verilen Teklif Fişi" value="Verilen Teklif" style={MainStyles.textStyle} />
                </Picker>
                <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Picker
          selectedValue={irsaliyeTipi}
          itemStyle={{ height: 40, fontSize: 12 }}
          style={{ marginHorizontal: -10 }}
          onValueChange={handleIrsaliyeTipiChange}
        >
          <Picker.Item label="Tipini Seçin" value="" style={MainStyles.textStyle} />
          <Picker.Item label="Verilen Teklif Fişi" value="Verilen Teklif" style={MainStyles.textStyle} />
        </Picker>
      )}
        </View>
        <Text style={MainStyles.formTitle}>Evrak Tarihi </Text> 
        <View style={MainStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} MainStyles={MainStyles.dateButton}>
              <View style={MainStyles.dateContainer}>
            <Takvim name="calendar-today"  style={MainStyles.dateIcon} />
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
          <Text style={MainStyles.formTitle}>Başlangıç Tarihi </Text> 
          <View style={MainStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowBaslangicDatePicker(true)} MainStyles={MainStyles.dateButton}>
              <View style={MainStyles.dateContainer}>
            <Takvim name="calendar-today"  style={MainStyles.dateIcon} />
            <Text style={MainStyles.dateText}>{formatDate(baslangicTarih)}</Text>
            </View>
          </TouchableOpacity>
          {showBaslangicDatePicker  && (
            <DateTimePicker
              value={baslangicTarih}
              mode="date"
              display="default"
              onChange={handleBaslangicDateChange}
            />
          )}
          </View>
          <Text style={MainStyles.formTitle}>Geçerlilik Tarihi </Text> 
          <View style={MainStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowGecerlilikDatePicker(true)} MainStyles={MainStyles.dateButton}>
              <View style={MainStyles.dateContainer}>
            <Takvim name="calendar-today"  style={MainStyles.dateIcon} />
            <Text style={MainStyles.dateText}>{formatDate(gecerlilikTarih)}</Text>
            </View>
          </TouchableOpacity>
          {showGecerlilikDatePicker  && (
            <DateTimePicker
              value={gecerlilikTarih}
              mode="date"
              display="default"
              onChange={handleGecerlilikDateChange}
            />
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
            {/* 
            <Text style={MainStyles.buttonCariUnvanText}>?</Text>
            */}
          </TouchableOpacity>
        </View>

        {/* Adres */}
        <Text style={MainStyles.formTitle}>Adres</Text> 
          <View style={MainStyles.inputContainer}>
              <TextInput
                style={MainStyles.inputCariKodu}
                placeholder="Adres"
                placeholderTextColor={colors.placeholderTextColor}
                value={sth_adres_no}
                autoFocus={true}
                selection={{start:0, end:0}}
                editable={false}
              />
              <TouchableOpacity onPress={handleAdresClick} style={MainStyles.buttonCariKodu}>
                <Ara />
              </TouchableOpacity>
            </View>
        {/* Adres */}

        <View style={MainStyles.teksirabirlestir}>
        {/* Doviz Seçim */}
          <View style={{ width: '35%' }}>
            <Text style={MainStyles.formTitle}>Döviz</Text>
            <View style={MainStyles.inputStyle}>
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
          </View>
        {/* Doviz Seçim */}

        {/* Depo Seçim */}
          <View style={{ width: '65%' }}>
            <Text style={MainStyles.formTitle}>Depo</Text>
              <View style={MainStyles.inputStyle}>
              {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsDepoModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {sth_cikis_depo_no ? depoList.find(depo => depo.No.toString() === sth_cikis_depo_no)?.Adı : 'Depo Seçin'}
              </Text>
            </TouchableOpacity>

            {/* Depo Modal (iOS için) */}
            <Modal visible={isDepoModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={sth_cikis_depo_no}
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
          selectedValue={sth_cikis_depo_no}
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
          </View>
        {/* Depo Seçim */}
      </View>

        {/* Vade */}
        <Text style={MainStyles.formTitle}>Vade</Text> 
          <View style={MainStyles.inputContainer}>
            <TextInput
              style={MainStyles.inputVade}
              placeholder="Vade"
              value={sth_odeme_op}
              onFocus={handleVadeClick} 
              placeholderTextColor={colors.placeholderTextColor}
            />
            <TouchableOpacity onPress={handleVadeClick} style={MainStyles.buttonVade}>
            <Ara />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGClick} style={MainStyles.buttonVadeG}>
              <Text style={MainStyles.buttonbuttonVadeGText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTClick} style={MainStyles.buttonVadeT}>
              <TakvimVade/>
            </TouchableOpacity>

            <Modal
              visible={isVadeModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsVadeModalVisible(false)}
            >
             <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Vade Listesi</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={() => setIsVadeModalVisible(false)}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
                  <View style={MainStyles.modalContent}>
                  <FlatList
                    data={vadeList}
                    renderItem={renderVadeItem}
                    keyExtractor={item => item.Kodu.toString()}
                  />
                  </View>
              </View>
              </SafeAreaView>
            </Modal>
            

            <Modal
              visible={isGModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsGModalVisible(false)}
            >
            <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Vade Gün Girişi</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={() => setIsGModalVisible(false)}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
                    <View style={MainStyles.modalContent}>
                  
                  <TextInput
                    style={MainStyles.inputGValue}
                    placeholder="Gün sayısını girin"
                    placeholderTextColor={colors.placeholderTextColor}
                    keyboardType="numeric"
                    value={gValue}
                    onChangeText={handleGValueChange}
                  />
                  <TouchableOpacity onPress={handleAddGValue} style={MainStyles.addButton}>
                    <Text style={MainStyles.addButtonText}>Ekle</Text>
                  </TouchableOpacity>
                </View>
              </View>
              </SafeAreaView>
            </Modal>

            <Modal
              visible={isTModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsTModalVisible(false)}
            >
             <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Vade Tarih Girişi</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={() => setIsTModalVisible(false)}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
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
              </SafeAreaView>
            </Modal>
          </View>
        {/* Vade */}

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
             <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Sorumluluk Merkezleri</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={() => setIsSorumlulukMerkeziModalVisible(false)}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
              <View style={MainStyles.modalContent}>
                <FlatList
                  data={sorumlulukMerkeziList}
                  renderItem={renderSorumlulukMerkeziItem}
                  keyExtractor={item => item.Kod.toString()}
                />
              </View>
            </View>
            </SafeAreaView>
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
             <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Proje Kodları</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={() => setIsProjeKoduModalVisible(false)}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
              <View style={MainStyles.modalContent}>
                <FlatList
                  data={projeKoduList}
                  keyExtractor={(item) => item.Kod.toString()}
                  renderItem={renderProjeKoduItem}
                />
            </View>
            </View>
            </SafeAreaView>
          </Modal>
        {/* Proje Kodları*/}

         {/* Evrak Getir*/}
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
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Oluşturma Tarihi</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Seri</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Sıra</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Stok Kod</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 300 }]}>Stok İsmi</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Miktar</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Birim_Fiyat</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Vergi</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Önizleme</DataTable.Title>
                    
                    </DataTable.Header>

                    <ScrollView style={{ maxHeight: 600 }}>
                      {data.map((item, index) => (
                        <DataTable.Row key={index} style={MainStyles.tableRow}>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Oluşturma_Tarihi}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100, paddingHorizontal: 15 }}>{item.Seri}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Sıra}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Stok_Kod}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 300 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Stok_İsmi}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Miktar}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Birim_Fiyat}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Vergi}
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
        {/* Evrak Getir*/}

        <CariListModal
          isVisible={isCariListModalVisible}
          onSelectCari={handleCariSelect}
          onClose={() => setIsCariListModalVisible(false)}
        />
        <AdresListModal
          isVisible={isAdresListModalVisible}
          onSelect={handleAdresSelect} 
          onClose={() => setIsAdresListModalVisible(false)} 
          adresList={adresList}
      />
    </View>
    </ScrollView>
  );
};

export default TeklifFisiBilgisi;


