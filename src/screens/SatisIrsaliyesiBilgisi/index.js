import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking, SafeAreaView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Down, Left, PDF, Takvim, TakvimVade } from '../../res/images';
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
import FastImage from 'react-native-fast-image';
import AdresListModal from '../../context/AdresListModal';
import CustomHeader from '../../components/CustomHeader';
import axios from 'axios';

const SatisIrsaliyesiBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [sth_evrakno_seri, setSth_evrakno_seri] = useState('');
  const [sth_evrakno_sira, setSth_evrakno_sira] = useState('');
  const [sth_cari_kodu, setSth_cari_kodu] = useState('');
  const [sth_cari_unvan1, setSth_cari_unvan1] = useState('');
  const [sth_har_doviz_cinsi, setSth_har_doviz_cinsi] = useState('');
  const [sth_giris_depo_no, setSth_giris_depo_no] = useState('');
  const [sth_cikis_depo_no, setSth_cikis_depo_no] = useState('');
  const [sth_exim_kodu, setSth_exim_kodu] = useState('');
  const [sth_stok_srm_merkezi, setSth_stok_srm_merkezi] = useState('');
  const [sth_adres_no, setSth_adres_no] = useState('');
  const [sth_proje_kodu, setSth_proje_kodu] = useState('');
  const [sth_odeme_op, setSth_odeme_op] = useState('');

  // Listeler
  const [dovizList, setDovizList] = useState([]);
  const [depoList, setDepoList] = useState([]);
  const [adresList, setAdresList] = useState([]);
  const [projeKoduList, setProjeKoduList] = useState([]);
  const [vadeList, setVadeList] = useState([]);
  const [ihracatKoduList, setIhracatKoduList] = useState([]);
  const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
 
  // Seçimler
  const [irsaliyeNormalTipi, setIrsaliyeNormalTipi] = useState('Normal');
  const [irsaliyeTipi, setIrsaliyeTipi] = useState('Toptan Satış');
  const [pickerOptions, setPickerOptions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [evrakDate, setEvrakDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEvrakDatePicker, setShowEvrakDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gValue, setGValue] = useState('');
  const [tValue, setTValue] = useState('');
  const [selectedVadeNo, setSelectedVadeNo] = useState(null); 
  
  // Kurallar 
  const [isEditable, setIsEditable] = useState(false);
  const [pickerEditable, setPickerEditable] = useState(true);
  const [vadeEditable, setVadeEditable] = useState(true);

  // Datatable
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 

  // Modal Görünürlük
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [isAdresListModalVisible, setIsAdresListModalVisible] = useState(false);
  const [isSorumlulukMerkeziModalVisible, setIsSorumlulukMerkeziModalVisible] = useState(false);
  const [isIhracatKoduModalVisible, setIsIhracatKoduModalVisible] = useState(false);
  const [isProjeKoduModalVisible, setIsProjeKoduModalVisible] = useState(false);
  const [isVadeModalVisible, setIsVadeModalVisible] = useState(false);
  const [isGModalVisible, setIsGModalVisible] = useState(false);
  const [isTModalVisible, setIsTModalVisible] = useState(false);
  const [isAdresModalVisible, setIsAdresModalVisible] = useState(false);
  const [isTipModalVisible, setIsTipModalVisible] = useState(false); 
  const [isEvrakTipModalVisible, setIsEvrakTipModalVisible] = useState(false); 
  const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);

  // State Yönetimi
  const [isLogSent, setIsLogSent] = useState(false); // API çağrısının yapılıp yapılmadığını takip etmek için

  useEffect(() => {
    // İlk render'da sadece çalışacak
    const logHareket = async () => {
      if (isLogSent) return;  // Eğer log zaten gönderildiyse, fonksiyonu durdur

      try {
        if (!defaults || !defaults[0].Adi || !defaults[0].IQ_Database) {
          console.log('Adi veya IQ_Database değeri bulunamadı, API çağrısı yapılmadı.');
          return;
        }

        const body = {
          Message: 'Satış İrsaliye Sayfa Açıldı', // Hardcoded message
          User: defaults[0].Adi, // Temsilci ID
          database: defaults[0].IQ_Database, // Database ID
          data: 'Satış İrsaliye' // Hardcoded data
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

  const getSelectedDovizAd = () => {
    const selectedDoviz = dovizList.find(doviz => doviz.Doviz_Cins.toString() === sth_har_doviz_cinsi);
    return selectedDoviz ? selectedDoviz.Doviz_Adı : 'Döviz Tipini Seçin';
  };


// Tüm Değişken Değerleri

  // Değiştirilebilir Alanlar 
    useEffect(() => {
      if (defaults && defaults[0]) {
        const { IQ_SatisIrsaliyeSeriNoDegistirebilir, IQ_CikisDepoNoDegistirebilir, IQ_VadePasifGelsin } = defaults[0];
        setIsEditable(IQ_SatisIrsaliyeSeriNoDegistirebilir === 1);
        setPickerEditable(IQ_CikisDepoNoDegistirebilir === 1);
        setVadeEditable(IQ_VadePasifGelsin === 1);
      }
    }, [defaults]);
  // Değiştirilebilir Alanlar 

  // Sayfa Açıldığında Gönderilen Varsayılan Değerler
    useEffect(() => {
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_evraktip: 1,
        sth_cari_cinsi: 0,
        sth_evrakno_seri: sth_evrakno_seri,
        sth_evrakno_sira: sth_evrakno_sira,
        sth_cari_kodu: sth_cari_kodu,
        sth_cari_unvan1: sth_cari_unvan1,
        sth_giris_depo_no: sth_giris_depo_no,
        sth_cikis_depo_no: sth_cikis_depo_no,
        sth_har_doviz_cinsi: sth_har_doviz_cinsi,
      
      }));
    }, [sth_evrakno_seri,sth_evrakno_sira,sth_cari_kodu, sth_cari_unvan1, sth_giris_depo_no, sth_cikis_depo_no, sth_har_doviz_cinsi] );
  // Sayfa Açıldığında Gönderilen Varsayılan Değerler

  // Sayfa Açıldığında Otomatik Çalışan Değerler
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
      handleIrsaliyeTipiChange('Toptan Satış');
      handleIrsaliyeNormalTipiChange('Normal');
    }, []);
  // Sayfa Açıldığında Otomatik Çalışan Değerler

  // İrsaliye Tipi Varsayılan Seçim
    const handleIrsaliyeTipiChange = (itemValue) => {
      setIrsaliyeTipi(itemValue);
      let setirsaliyeTipi = 0;
      let sth_cins = 0;

      switch (itemValue) {
        case 'Toptan Satış':
          sth_tip = 1;
          sth_cins = 0;
          break;
        case 'Perakende Satış':
          sth_tip = 1;
          sth_cins = 1;
          break;
        case 'İhraç Kayıtlı Mal Satış':
          sth_tip = 1;
          sth_cins = 2;
          break;
        case 'İhracat Satış': // Bir textınput ve arama iconu olacak ve apiden gelen değerler adresteki listelenecek ve seçilecek bunun olayı sth_exim_kodu
          sth_tip = 1;
          sth_cins = 12;
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

    const handleIrsaliyeNormalTipiChange = (itemValue) => {
      setIrsaliyeNormalTipi(itemValue);
      let sth_normal_iade = 0;
      let sth_evraktip = 1;

      switch (itemValue) {
        case 'Normal':
          sth_normal_iade = 0;
          setPickerOptions([
            { label: 'Toptan Satış İrsaliyesi', value: 'Toptan Satış' },
            { label: 'Perakende Satış İrsaliyesi', value: 'Perakende Satış' },
            { label: 'İhraç Kayıtlı Mal Satış İrsaliyesi', value: 'İhraç Kayıtlı Mal Satış' },
            { label: 'İhracat Satış İrsaliyesi', value: 'İhracat Satış' },
          ]);
          break;
        case 'İade':
          sth_normal_iade = 1;
          setPickerOptions([
            { label: 'Toptan Satış İrsaliyesi', value: 'Toptan Satış' },
            { label: 'Perakende Satış İrsaliyesi', value: 'Perakende Satış' },
            { label: 'İhraç Kayıtlı Mal Satış İrsaliyesi', value: 'İhraç Kayıtlı Mal Satış' },
            { label: 'İhracat Satış İrsaliyesi', value: 'İhracat Satış' },
          ]);
          break;
        default:
          setPickerOptions([]);
          break;
      }
  
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_evraktip,
        sth_normal_iade,
      }));
    };
  // İrsaliye Tipi Varsayılan Seçim

  // Evrak Tarih Alanı
    useEffect(() => {
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      setDate(currentDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_tarih: formattedDate,
      }));
    }, []);

    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      const newDate = selectedDate || date;
      setDate(newDate);

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
      if (sth_cari_kodu) {
        Alert.alert(
          "Uyarı",
          "Cari seçimini değiştirirseniz eklediğiniz ürünler silinecektir. Onaylıyor musunuz?",
          [
            {
              text: "Evet",
              onPress: () => {
                setAddedProducts([]);
                setIsCariListModalVisible(true);
              }
            },
            {
              text: "Hayır",
              onPress: () => console.log("İptal edildi"),
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      } else {
        // Eğer henüz bir cari seçilmemişse direkt modal açılır
        setIsCariListModalVisible(true);
      }
    };

    const handleCariSelect = async  (cari) => {
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
        setSth_adres_no(`${firstAddress.Adres},${firstAddress.Il},${firstAddress.Ilce}`);
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

  // İhracat Kodu Seçim
    const handleIhracatKoduClick = () => {
      fetchIhracatKoduList(); 
      setIsIhracatKoduModalVisible(true); 
    };
  
    const handleIhracatKoduSelect = (item) => {
      setSth_exim_kodu(item.Isim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_exim_kodu: item.Kod,
      }));
      setIsIhracatKoduModalVisible(false);
    };
  // İhracat Kodu Seçim

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
      setSth_adres_no(`${item.Adres},${item.Il},${item.Ilce}`);
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
      setSelectedVadeNo(item.No); 
      setIsVadeModalVisible(false);
  
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_odeme_op: item.No,
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

    const fetchIhracatKoduList = async () => {
      try {
        const response = await axiosLinkMain.get(`/Api/Ihracat/IhracatDosyalari?cari=${sth_cari_kodu}`);
        const data = response.data;
        setIhracatKoduList(data); 
      } catch (error) {
        console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
      }
    };

    const fetchAdresList = async (cariKodu) => {
      try {
        const response = await axiosLinkMain.get(`/Api/Adres/CariAdresler?cari=${cariKodu}`);
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
          const satisIrsaliyeSerino = response.data[0].IQ_SatisIrsaliyeSeriNo;
          const girisDepoNo = response.data[0].IQ_GirisDepoNo;
          setSth_evrakno_seri(satisIrsaliyeSerino);
          setSth_giris_depo_no(girisDepoNo);
    
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
    
      // Text doluysa API'yi çağırıyoruz
      if (text.trim()) {
        try {
          const response = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${text}&tip=IRSALIYE`);
          const { Sira } = response.data;
          setSth_evrakno_sira(Sira.toString());
        } catch (error) {
          console.error('Bağlantı Hatası Evrak Sıra:', error);
        }
      } else {
        // Text boşsa, sırayı sıfırlıyoruz
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
    

    const fetchEvrakData = async () => {
      setLoading(true);
      try {
        const response = await axiosLinkMain.get(`/Api/StokHareketi/IrsaliyeGetir?seri=${sth_evrakno_seri}&tip=${faturaBilgileri.sth_tip}&cins=${faturaBilgileri.sth_cins}`);
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

  // İhracat Kodu Listele
    const renderIhracatKoduItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleIhracatKoduSelect(item)} style={MainStyles.modalItem}>
        <Text style={MainStyles.modalItemText}>{item.Kod} - {item.Isim}</Text>
      </TouchableOpacity>
    );
  // İhracat Kodu Listele

  // Sorumluluk Merkezi Listele
    const renderSorumlulukMerkeziItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleSorumlulukMerkeziSelect(item)} style={MainStyles.modalItem}>
        <Text style={MainStyles.modalItemText}>{item.İsim}</Text>
      </TouchableOpacity>
    );
  // Sorumluluk Merkezi Listele
  

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
        
        <View style={MainStyles.teksirabirlestir}>
        <View style={{ width: '35%' }}>
        <Text style={MainStyles.formTitle}>Tip</Text>
        <View style={MainStyles.inputStyle}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsTipModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {irsaliyeNormalTipi ? irsaliyeNormalTipi : 'Tipini Seçin'}
              </Text>
            </TouchableOpacity>

            {/* iOS için Modal */}
            <Modal visible={isTipModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={irsaliyeNormalTipi}
                    onValueChange={handleIrsaliyeNormalTipiChange}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Tipini Seçin" value="" />
                    <Picker.Item label="Normal" value="Normal" />
                    <Picker.Item label="İade" value="İade" />
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsTipModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={irsaliyeNormalTipi}
            onValueChange={handleIrsaliyeNormalTipiChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Tipini Seçin" value="" style={MainStyles.textStyle} />
            <Picker.Item label="Normal" value="Normal" style={MainStyles.textStyle} />
            <Picker.Item label="İade" value="İade" style={MainStyles.textStyle} />
          </Picker>
        )}
          </View>
          </View>
        <View style={{ width: '65%' }}>
          <Text style={MainStyles.formTitle}>Evrak Tipi</Text>
        <View style={MainStyles.inputStyle2}>
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
        </View>
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
            style={MainStyles.inputCariKodu}
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
                value={sth_odeme_op ? sth_odeme_op.toString() : ''}
                onFocus={handleVadeClick}
                editable={!vadeEditable}
                placeholderTextColor={colors.placeholderTextColor}
              />
              <TouchableOpacity onPress={handleVadeClick} style={MainStyles.buttonVade} disabled={vadeEditable}>
              <Ara />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGClick} style={MainStyles.buttonVadeG} disabled={vadeEditable}>
                <Text style={MainStyles.buttonbuttonVadeGText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTClick} style={MainStyles.buttonVadeT} disabled={vadeEditable}>
                <TakvimVade />
              </TouchableOpacity>

              <Modal
                visible={isVadeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsVadeModalVisible(false)}
              >
              <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Vade Listesi"
                onClose={() => setIsVadeModalVisible(false)}
              />
                  <View style={MainStyles.modalContent}>
                    <FlatList
                      data={vadeList}
                      renderItem={renderVadeItem}
                      keyExtractor={item => item.Kodu.toString()}
                    />
                    </View>
                    </View>
              </Modal>
              

              <Modal
                visible={isGModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsGModalVisible(false)}
              >

            <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Vade Gün Girişi"
                onClose={() => setIsGModalVisible(false)}
              />
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
              </Modal>

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
                        style={{position: 'absolute', top: 11, width: 140, backgroundColor: colors.white}}
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

        {/* İhracat Kodu */}
          {irsaliyeTipi === "İhracat Satış" && (
              <>
              <Text style={MainStyles.formTitle}>İhracat</Text> 
              <View style={MainStyles.inputContainer}>
                <TextInput
                  style={MainStyles.inputCariKodu}
                  placeholder="İhracat Kodu"
                  placeholderTextColor={colors.placeholderTextColor}
                  value={sth_exim_kodu}
                  onFocus={handleIhracatKoduClick}
                />
                <TouchableOpacity onPress={handleIhracatKoduClick} style={MainStyles.buttonCariKodu}>
                  <Ara />
                </TouchableOpacity>
              </View>
              <Modal
                visible={isIhracatKoduModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsIhracatKoduModalVisible(false)}
              >
              <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="İhracat Kodları"
                onClose={() => setIsIhracatKoduModalVisible(false)}
              />
                  <View style={MainStyles.modalContent}>
                    <FlatList
                      data={ihracatKoduList}
                      renderItem={renderIhracatKoduItem}
                      keyExtractor={(item) => item.Kod.toString()}
                    />
                  </View>
                </View>
              </Modal>
            </>
          )}
        {/* İhracat Kodu */}
        
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
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Tarihi</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Seri</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Evrak Sıra</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Cari Kodu</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 300 }]}>Cari Ünvan</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 100 }]}>Toplam Tutar</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Toplam İskonto</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Toplam Vergi</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Önizleme</DataTable.Title>
                    
                    </DataTable.Header>

                    <ScrollView >
                      {data.map((item, index) => (
                        <DataTable.Row key={index} style={MainStyles.tableRow}>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Tarihi}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100, paddingHorizontal: 15 }}>{item.Seri}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Sıra}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Cari_Kod}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 300 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Cari_Ünvan}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Toplam_Tutar}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Toplam_Iskonto}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Toplam_Vergi}
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

export default SatisIrsaliyesiBilgisi;
