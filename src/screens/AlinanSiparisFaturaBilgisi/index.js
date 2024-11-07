import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Left, Takvim, TakvimVade } from '../../res/images';
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

const AlinanSiparisFaturaBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [sip_evrakno_seri, setSip_evrakno_seri] = useState('');
  const [sip_evrakno_sira, setSip_evrakno_sira] = useState('');
  const [sip_musteri_kod, setSip_musteri_kod] = useState('');
  const [sip_cari_unvan1, setSip_cari_unvan1] = useState('');
  const [sip_doviz_cinsi, setSip_doviz_cinsi] = useState('');
  const [sth_giris_depo_no, setSth_giris_depo_no] = useState('');
  const [sip_depono, setSip_depono] = useState('');
  const [sip_stok_sormerk, setSip_stok_sormerk] = useState('');
  const [sip_adresno, setSip_adresno] = useState('');
  const [sip_projekodu, setSip_projekodu] = useState('');
  const [sip_opno, setSip_opno] = useState('');

  // Listeler
  const [dovizList, setDovizList] = useState([]);
  const [depoList, setDepoList] = useState([]);
  const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
  const [adresList, setAdresList] = useState([]);
  const [projeKoduList, setProjeKoduList] = useState([]);
  const [vadeList, setVadeList] = useState([]);

  // Seçimler
  const [irsaliyeTipi, setIrsaliyeTipi] = useState('Çok Dövizli');
  const [date, setDate] = useState(new Date());
  const [evrakDate, setEvrakDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEvrakDatePicker, setShowEvrakDatePicker] = useState(false);
  const [gValue, setGValue] = useState('');
  const [tValue, setTValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVadeNo, setSelectedVadeNo] = useState(null); 

  // Kurallar 
  const [isEditable, setIsEditable] = useState(false);
  const [pickerEditable, setPickerEditable] = useState(true);

  // Datatable
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  
  // Modal Görünürlük
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [isAdresListModalVisible, setIsAdresListModalVisible] = useState(false);
  const [isSorumlulukMerkeziModalVisible, setIsSorumlulukMerkeziModalVisible] = useState(false);
  const [isProjeKoduModalVisible, setIsProjeKoduModalVisible] = useState(false);
  const [isVadeModalVisible, setIsVadeModalVisible] = useState(false);
  const [isGModalVisible, setIsGModalVisible] = useState(false);
  const [isTModalVisible, setIsTModalVisible] = useState(false);
  const [isAdresModalVisible, setIsAdresModalVisible] = useState(false);
  const [isTipModalVisible, setIsTipModalVisible] = useState(false); 
  const [isEvrakTipModalVisible, setIsEvrakTipModalVisible] = useState(false); 
  const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);

  const getSelectedDovizAd = () => {
    const selectedDoviz = dovizList.find(doviz => doviz.Doviz_Cins.toString() === sip_doviz_cinsi);
    return selectedDoviz ? selectedDoviz.Doviz_Adı : 'Döviz Tipini Seçin';
  };

  const pickerOptions = [
    { label: 'Çok Dövizli Sipariş', value: 'Çok Dövizli' },
    { label: 'Konsinye Sipariş', value: 'Konsinye' },
    { label: 'Satın Alma Sipariş', value: 'Satın Alma' },
  ];
// Tüm Değişken Değerleri

  // Değiştirilebilir Alanlar 
    useEffect(() => {
      if (defaults && defaults[0]) {
        const { IQ_AlisSiparisSeriNoDegistirebilir, IQ_CikisDepoNoDegistirebilir } = defaults[0];
        setIsEditable(IQ_AlisSiparisSeriNoDegistirebilir === 1);
        setPickerEditable(IQ_CikisDepoNoDegistirebilir === 1);
      }
    }, [defaults]);
  // Değiştirilebilir Alanlar 

  // Sayfa Açıldığında Gönderilen Varsayılan Değerler
    useEffect(() => {
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sip_evrakno_seri: sip_evrakno_seri,
        sip_evrakno_sira: sip_evrakno_sira,
        sip_musteri_kod: sip_musteri_kod,
        sip_cari_unvan1: sip_cari_unvan1,
        sip_depono: sip_depono,
        sip_doviz_cinsi: sip_doviz_cinsi,
      }));
    }, [sip_evrakno_seri,sip_evrakno_sira,sip_musteri_kod, sip_cari_unvan1, sip_depono] );
  // Sayfa Açıldığında Gönderilen Varsayılan Değerler

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
    handleIrsaliyeTipiChange('Çok Dövizli');
  }, []);

  // İrsaliye Tipi Varsayılan Seçim
    const handleIrsaliyeTipiChange = (itemValue) => {
      setIrsaliyeTipi(itemValue);
      let sip_tip = 0;
      let sip_cins = 0;

      switch (itemValue) {
        case 'Çok Dövizli':
          sip_tip = 0;
          sip_cins = 0;
          break;
        case 'Konsinye':
          sip_tip = 0;
          sip_cins = 1;
          break;
        case 'Satın Alma':
          sip_tip = 1;
          sip_cins = 0;
          break;
        default:
          break;
      }
      
      setFaturaBilgileri(prevState => ({
      ...prevState,
      sip_tip,
      sip_cins,
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
        sip_tarih: formattedDate,
      }));
    }, []);

    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      const newDate = selectedDate || date;
      setDate(newDate);

      const formattedDate = formatDate(newDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sip_tarih: formattedDate,
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
      if (sip_musteri_kod) {
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

    const handleCariSelect = async (cari) => {
      const selectedCariKodu = cari.Cari_Kod;
    
      setSip_musteri_kod(selectedCariKodu);
      setSip_cari_unvan1(cari.Ünvan);
      setFaturaBilgileri((prevState) => ({
        ...prevState,
        sip_musteri_kod: selectedCariKodu,
        sip_cari_unvan1: cari.Ünvan,
      }));
    
      setSip_adresno('');
      setFaturaBilgileri((prevState) => ({
        ...prevState,
        sip_adresno: null,
      }));
      
      fetchDovizList(selectedCariKodu);
      // Adres listesini tekrar API'den çek
      const adresList = await fetchAdresList(selectedCariKodu);

      if (adresList && adresList.length > 0) {
        // İlk adresi otomatik olarak seç
        const firstAddress = adresList[0];
        setSip_adresno(firstAddress.Adres);
        setFaturaBilgileri((prevState) => ({
          ...prevState,
          sip_adresno: firstAddress.Adres_No,
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
              setSip_opno(selectedOdemePlan.Isim);
              
              // Fatura bilgilerini güncelle
              setFaturaBilgileri(prevState => ({
                ...prevState,
                sip_opno: selectedOdemePlan.No, // Burada No'yu gönderiyoruz
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
      if (sip_musteri_kod) {
        fetchDovizList(sip_musteri_kod);
      }
      fetchDepoList();
    }, [sip_musteri_kod]);

  // Cari Seçim

  // Depo Seçim
    const handleDepoChange = (itemValue) => {
      setSip_depono(itemValue);
      setFaturaBilgileri((prev) => ({
        ...prev,
        sip_depono: itemValue,
      }));
    };
  // Depo Seçim

  // Döviz Seçim
    const handleDovizChange = (itemValue) => {
      setSip_doviz_cinsi(itemValue);
      setFaturaBilgileri((prev) => ({
        ...prev,
        sip_doviz_cinsi: itemValue,
      }));
    };
  // Döviz Seçim

  // Evrak No Değişim Alanı
    const handleEvrakNo = (text) => {
      setSip_evrakno_seri(text);
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
      setSip_projekodu(item.Isim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sip_projekodu: item.Kod,
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
      setSip_stok_sormerk(item.İsim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sip_stok_sormerk: item.Kod,
      }));
      setIsSorumlulukMerkeziModalVisible(false);
    };
  // Sorumluluk Merkezi Seçim

  // Adres Seçim
    const handleAdresClick = async () => {
      const fetchedAdresList = await fetchAdresList(sip_musteri_kod); // Adres listesini çek
      setAdresList(fetchedAdresList); // Çekilen adresleri state'e ata
      setIsAdresListModalVisible(true); // Modalı göster
    };
  
    const handleAdresSelect = (item) => {
      setSip_adresno(item.Adres);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sip_adresno: item.Adres_No,
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
      setSip_opno(item.Isim); 
      setSelectedVadeNo(item.No); 
      setIsVadeModalVisible(false);
  
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sip_opno: item.No,
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
        setSip_opno(gValue); 
        setFaturaBilgileri(prevState => ({
          ...prevState,
          sip_opno: negativeGValue, 
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
    
        setSip_opno(formattedDateForDisplay); 
        setFaturaBilgileri(prevState => ({
          ...prevState,
          sip_opno: formattedDateForAPI, 
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
        const response = await axiosLinkMain.get(`/Api/Kur/CariKuru?cari=${sip_musteri_kod}`);
    
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
          setSip_doviz_cinsi(firstDovizCins);
          setFaturaBilgileri((prev) => ({
            ...prev,
            sip_doviz_cinsi: firstDovizCins,
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
          setSip_depono(defaultDepo.No.toString());
          setFaturaBilgileri((prev) => ({
            ...prev,
            sip_depono: defaultDepo.No.toString(),
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

    const fetchAdresList = async (sip_musteri_kod) => {
        try {
          const response = await axiosLinkMain.get(`/Api/Adres/CariAdresler?cari=${sip_musteri_kod}`);
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
          const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${authData.KullaniciKodu}`);
          const satisIrsaliyeSerino = response.data[0].IQ_AlisSiparisSeriNo;
          const girisDepoNo = response.data[0].IQ_GirisDepoNo;
          setSip_evrakno_seri(satisIrsaliyeSerino);
          setSth_giris_depo_no(girisDepoNo);
    
          if (satisIrsaliyeSerino.trim()) {
            const responseSira = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${satisIrsaliyeSerino}&tip=SIPARIS`);
            const { Sira } = responseSira.data;
            setSip_evrakno_sira(Sira.toString());
          }
        } catch (error) {
          console.error('API Hatası:', error);
        }
      };
  
      fetchSatisIrsaliyeSerino();
    }, []);

    const handleEvrakNoChange = async (text) => {
        // Seri numarasını state'e kaydediyoruz
        setSip_evrakno_seri(text);
      
      if (text.trim()) {
        try {
          const response = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${text}&tip=SIPARIS`);
          const { Sira } = response.data;
          setSip_evrakno_sira(Sira.toString());
        } catch (error) {
          console.error('Bağlantı Hatası Evrak Sıra:', error);
        }
      } else {
        setSip_evrakno_sira(''); 
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
        const response = await axiosLinkMain.get(`/Api/Siparis/SiparisGetir?seri=${sip_evrakno_seri}`);
        setData(response.data); 

        setIsModalVisible(true); 
      } catch (error) {
        console.error('API Hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const handlePdfClick = async (Siparis_Seri, Siparis_Sıra) => {
      try {
        // API'ye isteği yaparken evrakno_seri ve evrakno_sira değerlerini gönderiyoruz
        const response = await axiosLinkMain.get(`/Api/PDF/SiparisPDF?a=${Siparis_Seri}&b=${Siparis_Sıra}`);
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

  return (
    <ScrollView style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
      <Text style={MainStyles.formTitle}>Evrak</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputEvrakNo}
            value={sip_evrakno_seri}
            onChangeText={handleEvrakNoChange}
            placeholder="Evrak No"
            placeholderTextColor={colors.placeholderTextColor}
            editable={isEditable} 
          />
          <TextInput 
            style={MainStyles.inputEvrakSira} 
            value={sip_evrakno_sira}
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
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        
        <Text style={MainStyles.formTitle}>Tip </Text> 
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
       
        <Text style={MainStyles.formTitle}>Cari Seçimi </Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputCariKodu}
            placeholder="Cari Kodu"
            value={sip_musteri_kod}
            placeholderTextColor={colors.placeholderTextColor}
            autoFocus={true}
            selection={{start:0, end:0}}
            editable={false}
          />
          <TextInput 
            style={MainStyles.inputCariUnvan}
            placeholder="Cari Ünvan"
            value={sip_cari_unvan1} 
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
                value={sip_adresno}
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
                    selectedValue={sip_doviz_cinsi}
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
            selectedValue={sip_doviz_cinsi}
            onValueChange={handleDovizChange}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Döviz Tipini Seçin" value="" style={MainStyles.textStyle} />
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
                {sip_depono ? depoList.find(depo => depo.No.toString() === sip_depono)?.Adı : 'Depo Seçin'}
              </Text>
            </TouchableOpacity>

            {/* Depo Modal (iOS için) */}
            <Modal visible={isDepoModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={sip_depono}
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
          selectedValue={sip_depono}
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
              value={sip_opno}
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
                <TakvimVade />
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
              value={sip_stok_sormerk}
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
              value={sip_projekodu}
              placeholder="Proje Kodu"
              placeholderTextColor={colors.placeholderTextColor}
              onChangeText={setSip_projekodu}
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
                                {item.Siparis_Tarihi}
                              </DataTable.Cell>
                              <DataTable.Cell style={{ width: 100, paddingHorizontal: 15 }}>{item.Siparis_Seri}</DataTable.Cell>
                              <DataTable.Cell style={{ width: 100 }}>{item.Siparis_Sıra}</DataTable.Cell>
                              <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                                {item.Cari_Kod}
                              </DataTable.Cell>
                              <DataTable.Cell style={{ width: 300 }} numberOfLines={1} ellipsizeMode="tail">
                                {item.Cari_Unvan}
                              </DataTable.Cell>
                              <DataTable.Cell style={{ width: 100 }}>{item.Toplam_Tutar}</DataTable.Cell>
                              <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                                {item.Toplam_Iskonto}
                              </DataTable.Cell>
                              <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                                {item.Toplam_Vergi}
                              </DataTable.Cell>
                              <DataTable.Cell style={[MainStyles.withBorder, { width: 150 }]} >
                              <TouchableOpacity onPress={() => handlePdfClick(item.Siparis_Seri, item.Siparis_Sıra)}>
                                <Text>PDF</Text>
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

export default AlinanSiparisFaturaBilgisi;
