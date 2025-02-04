import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking, SafeAreaView } from 'react-native';
import { MainStyles } from '../../res/style';
import { Ara, Left, PDF, Takvim, TakvimVade } from '../../res/images';
import { ProductContext } from '../../context/ProductContext';
import { useAuthDefault } from '../../components/DefaultUser';
import { useFocusEffect } from '@react-navigation/native';
import axiosLinkMain from '../../utils/axiosMain';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { DataTable } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AdresListModal from '../../context/AdresListModal';
import CariListModal from '../../context/CariListModal';
import Button from '../../components/Button';
import CustomHeader from '../../components/CustomHeader';

const SatisFaturasiFaturaBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);

  // Tüm Değişken Değerleri
    // Bilgi Sayfası
    const [cha_evrakno_seri, setCha_evrakno_seri] = useState('');
    const [cha_evrakno_sira, setCha_evrakno_sira] = useState('');
    const [cha_normal_iade, setCha_normal_iade] = useState('');
    const [cha_kod, setCha_kod] = useState('');
    const [cha_cari_unvan1, setCha_cari_unvan1] = useState('');
    const [cha_d_cins, setCha_d_cins] = useState('');
    const [cha_exim_kodu, setCha_exim_kodu] = useState('');
    const [cha_srmrkkodu, setCha_srmrkkodu] = useState('');
    const [sth_giris_depo_no, setSth_giris_depo_no] = useState('');
    const [sth_cikis_depo_no, setSth_cikis_depo_no] = useState('');
    const [cha_adres_no, setCha_adres_no] = useState('');
    const [cha_projekodu, setCha_projekodu] = useState('');
    const [cha_vade, setCha_vade] = useState('');

    // Listeler
    const [dovizList, setDovizList] = useState([]);
    const [depoList, setDepoList] = useState([]);
    const [ihracatKoduList, setIhracatKoduList] = useState([]);
    const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
    const [adresList, setAdresList] = useState([]);
    const [projeKoduList, setProjeKoduList] = useState([]);
    const [vadeList, setVadeList] = useState([]);

    // Seçimler
    const [irsaliyeTipi, setIrsaliyeTipi] = useState('Satış Faturası');
    const [irsaliyeNormalTipi, setIrsaliyeNormalTipi] = useState('Normal');
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
    
    // Datatable
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(false); 

    // Modal Görünürlük
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal görünürlük kontrolü
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
  // Tüm Değişken Değerleri



  // Kullanıcının Değiştirebilir Alan Yönetimi 
    useEffect(() => {
      if (defaults && defaults[0]) {
        const { IQ_SatisFaturaSeriNoDegistirebilir, IQ_CikisDepoNoDegistirebilir } = defaults[0];
        setIsEditable(IQ_SatisFaturaSeriNoDegistirebilir === 1);
        setPickerEditable(IQ_CikisDepoNoDegistirebilir === 1);
      }
    }, [defaults]);
  // Kullanıcının Değiştirebilir Alan Yönetimi 

  // Sayfa Açıldığında Gönderilen Varsayılan Değerler
    useEffect(() => {
      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_evrak_tip: 63,
        cha_cari_cins: 0,
        cha_evrakno_seri: cha_evrakno_seri,
        cha_evrakno_sira: cha_evrakno_sira,
        cha_kod: cha_kod,
        cha_cari_unvan1: cha_cari_unvan1,
        sth_cikis_depo_no: sth_cikis_depo_no,
      
      }));
    }, [cha_evrakno_seri,cha_evrakno_sira,cha_kod, cha_cari_unvan1, sth_cikis_depo_no] );
  // Sayfa Açıldığında Gönderilen Varsayılan Değerler


  // Sayfa açıldığında tetiklenen alanlar
    useEffect(() => {
      fetchDovizList();
      fetchDepoList();
      handleIrsaliyeTipiChange('Satış Faturası');
      handleIrsaliyeNormalTipiChange('Normal');
    }, []);
  // Sayfa açıldığında tetiklenen alanlar

  // Araştıracağım.
    useFocusEffect(
      React.useCallback(() => {
        return () => {
          setFaturaBilgileri({});
        };
      }, [])
    );
  // Araştıracağım.

  // İrsaliye Tipi Varsayılan Seçim
    const handleIrsaliyeTipiChange = (itemValue) => {
      setIrsaliyeTipi(itemValue);
      let cha_tip = 0;
      let cha_cinsi = 0;
      let cha_normal_iade = faturaBilgileri.cha_normal_iade;

      switch (itemValue) {
        case 'Satış Faturası':
          cha_cinsi = 6;
          cha_ticaret_turu = 0;
          break;
        case 'Perakende':
          cha_cinsi = 7;
          cha_ticaret_turu = 1;
          break;
        case 'İhraç':
          cha_cinsi = 13;
          cha_ticaret_turu = 2;
          break;
        case 'İhracat':
          cha_cinsi = 29;
          cha_ticaret_turu = 3;
          break;
        default:
          break;
      }

      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_tip,
        cha_cinsi,
        cha_normal_iade,
        cha_ticaret_turu,
      }));
    };

    const handleIrsaliyeNormalTipiChange = (itemValue) => {
      setIrsaliyeNormalTipi(itemValue);
      let cha_normal_iade = 0;
      let cha_evrak_tip = 63;
  
      switch (itemValue) {
        case 'Normal':
          cha_normal_iade = 0;
          setPickerOptions([
            { label: 'Satış Faturası', value: 'Satış Faturası' },
            { label: 'Perakende Faturası', value: 'Perakende' },
            { label: 'İhraç Kayıtlı Fatura', value: 'İhraç' },
            { label: 'İhracat Faturası', value: 'İhracat' },
          ]);
          break;
        case 'İade':
          cha_normal_iade = 1;
          setPickerOptions([
            { label: 'Satış Faturası', value: 'Satış Faturası' },
            { label: 'Perakende Faturası', value: 'Perakende' },
            { label: 'İhraç Kayıtlı Fatura', value: 'İhraç' },
            { label: 'İhracat Faturası', value: 'İhracat' },
          ]);
          break;
        default:
          setPickerOptions([]);
          break;
      }
  
      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_evrak_tip,
        cha_normal_iade,
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
        cha_tarihi: formattedDate,
      }));
    }, []);

    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      const newDate = selectedDate || date;
      setDate(newDate);

      const formattedDate = formatDate(newDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_tarihi: formattedDate,
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
      if (cha_kod) {
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
    
      setCha_kod(selectedCariKodu);
      setCha_cari_unvan1(cari.Ünvan);
      setFaturaBilgileri((prevState) => ({
        ...prevState,
        cha_kod: selectedCariKodu,
        cha_cari_unvan1: cari.Ünvan,
      }));
    
      setCha_adres_no('');
      setFaturaBilgileri((prevState) => ({
        ...prevState,
        cha_adres_no: null,
      }));
      
      fetchDovizList(selectedCariKodu);
      // Adres listesini tekrar API'den çek
      const adresList = await fetchAdresList(selectedCariKodu);

      if (adresList && adresList.length > 0) {
        // İlk adresi otomatik olarak seç
        const firstAddress = adresList[0];
        setCha_adres_no(`${firstAddress.Adres},${firstAddress.Il},${firstAddress.Ilce}`);
        setFaturaBilgileri((prevState) => ({
          ...prevState,
          cha_adres_no: firstAddress.Adres_No,
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
              setCha_vade(selectedOdemePlan.Isim);
              
              // Fatura bilgilerini güncelle
              setFaturaBilgileri(prevState => ({
                ...prevState,
                cha_vade: selectedOdemePlan.No, // Burada No'yu gönderiyoruz
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
      if (cha_kod) {
        fetchDovizList(cha_kod);
      }
      fetchDepoList();
    }, [cha_kod]);

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
      setCha_d_cins(itemValue);
      setFaturaBilgileri((prev) => ({
        ...prev,
        cha_d_cins: itemValue,
      }));
    };

    const getSelectedDovizAd = () => {
      const selectedDoviz = dovizList.find(doviz => doviz.Doviz_Cins.toString() === cha_d_cins);
      return selectedDoviz ? selectedDoviz.Doviz_Adı : 'Döviz Tipini Seçin';
    };
  // Döviz Seçim

  // Evrak No Değişim Alanı
    const handleEvrakNo = (text) => {
      setCha_evrakno_seri(text);
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
      setCha_projekodu(item.Isim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_projekodu: item.Kod,
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
      setCha_exim_kodu(item.Isim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_exim_kodu: item.Kod,
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
      setCha_srmrkkodu(item.İsim);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_srmrkkodu: item.Kod,
      }));
      setIsSorumlulukMerkeziModalVisible(false);
    };
  // Sorumluluk Merkezi Seçim

  // Adres Seçim
    const handleAdresClick = async () => {
      const fetchedAdresList = await fetchAdresList(cha_kod); // Adres listesini çek
      setAdresList(fetchedAdresList); // Çekilen adresleri state'e ata
      setIsAdresListModalVisible(true); // Modalı göster
    };

    const handleAdresSelect = (item) => {
      setCha_adres_no(`${item.Adres},${item.Il},${item.Ilce}`);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        cha_adres_no: item.Adres_No,
      }));
      setIsAdresListModalVisible(false); // Modalı kapat
    };
  // Adres Seçim

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

  // Api Bağlantıları
    const fetchDovizList = async () => {
      try {
        const response = await axiosLinkMain.get(`/Api/Kur/CariKuru?cari=${cha_kod}`);
    
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
          setCha_d_cins(firstDovizCins);
          setFaturaBilgileri((prev) => ({
            ...prev,
            cha_d_cins: firstDovizCins,
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

    const fetchAdresList = async (cha_kod) => {
        try {
          const response = await axiosLinkMain.get(`/Api/Adres/CariAdresler?cari=${cha_kod}`);
          const data = response.data;
          setAdresList(data); 
          return data; 
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
      const fetchSatisFaturasiSerino = async () => {
        try {
          const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${defaults[0].IQ_MikroUserId}`);
          const satisFaturasiSerino = response.data[0].IQ_SatisFaturaSeriNo;
          const girisDepoNo = response.data[0].IQ_GirisDepoNo;
          setCha_evrakno_seri(satisFaturasiSerino);
          setSth_giris_depo_no(girisDepoNo);
    
          if (satisFaturasiSerino.trim()) {
            const responseSira = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${satisFaturasiSerino}&tip=FATURA`);
            const { Sira } = responseSira.data;
            setCha_evrakno_sira(Sira.toString());
          }
        } catch (error) {
          console.error('API Hatası:', error);
        }
      };
  
      fetchSatisFaturasiSerino();
    }, []);

    const handleEvrakNoChange = async (text) => {
       // Seri numarasını state'e kaydediyoruz
       setCha_evrakno_seri(text);
      if (text.trim()) {
        try {
          const response = await axiosLinkMain.get(`/Api/Evrak/EvrakSiraGetir?seri=${text}&tip=FATURA`);
          const { Sira } = response.data;
          setCha_evrakno_sira(Sira.toString());
        } catch (error) {
          console.error('Bağlantı Hatası Evrak Sıra:', error);
        }
      } else {
        setCha_evrakno_sira(''); 
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

    const fetchIhracatKoduList = async () => {
      try {
        const response = await axiosLinkMain.get(`/Api/Ihracat/IhracatDosyalari?cari=${cha_kod}`);
        const data = response.data;
        setIhracatKoduList(data); 
      } catch (error) {
        console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
      }
    };

    const fetchEvrakData = async () => {
      setLoading(true);
      try {
        const response = await axiosLinkMain.get(`/Api/CariHesapHareketi/FaturaGetir?seri=${cha_evrakno_seri}`);
        setData(response.data); 

        setIsModalVisible(true); 
      } catch (error) {
        console.error('API Hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    const handlePdfClick = async (Fatura_Seri, Fatura_Sıra) => {
      try {
        // API'ye isteği yaparken evrakno_seri ve evrakno_sira değerlerini gönderiyoruz
        const response = await axiosLinkMain.get(`/Api/PDF/FaturaPDF?seri=${Fatura_Seri}&sira=${Fatura_Sıra}`);
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
            value={cha_evrakno_seri}
            onChangeText={handleEvrakNoChange}
            placeholder="Evrak No"
            placeholderTextColor={colors.placeholderTextColor}
            editable={isEditable} 
          />
          <TextInput 
            style={MainStyles.inputEvrakSira} 
            value={cha_evrakno_sira}
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
          <Text style={MainStyles.formTitle}>Fatura Tipi</Text>
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
            value={cha_kod}
            placeholderTextColor={colors.placeholderTextColor}
            autoFocus={true}
            selection={{start:0, end:0}}
            editable={false}
          />
          <TextInput 
            style={MainStyles.inputCariUnvan}
            placeholder="Cari Ünvan"
            value={cha_cari_unvan1} 
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
                value={cha_adres_no}
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
                    selectedValue={cha_d_cins}
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
            selectedValue={cha_d_cins}
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
              value={cha_vade}
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
          {irsaliyeTipi === "İhracat" && (
          <>
              <Text style={MainStyles.formTitle}>İhracat Kodu</Text> 
              <View style={MainStyles.inputContainer}>
                <TextInput
                  style={MainStyles.inputCariKodu}
                  placeholder="İhracat Kodu"
                  placeholderTextColor={colors.placeholderTextColor}
                  value={cha_exim_kodu}
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
              value={cha_srmrkkodu}
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
              value={cha_projekodu}
              placeholder="Proje Kodu"
              placeholderTextColor={colors.placeholderTextColor}
              onChangeText={setCha_projekodu}
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
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Yekün</DataTable.Title>
                      <DataTable.Title style={[MainStyles.tableHeaderText, { width: 150 }]}>Önizleme</DataTable.Title>
                    
                    </DataTable.Header>
  
                    <ScrollView >
                      {data.map((item, index) => (
                        <DataTable.Row key={index} style={MainStyles.tableRow}>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Fatura_Tarihi}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100, paddingHorizontal: 15}}>{item.Fatura_Seri}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Fatura_Sıra}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Cari_Kod}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 300 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Cari_Ünvan}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 100 }}>{item.Ara_Toplam}</DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Toplam_İskonto}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Toplam_Vergi}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ width: 150 }} numberOfLines={1} ellipsizeMode="tail">
                            {item.Yekün}
                          </DataTable.Cell>
                          <DataTable.Cell style={[MainStyles.withBorder, { width: 150 }]} >
                          <TouchableOpacity onPress={() => handlePdfClick(item.Fatura_Seri, item.Fatura_Sıra)}>
                          <PDF width={25} height={25}/>
                          </TouchableOpacity>
                        </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </ScrollView>
                  </DataTable>
                </ScrollView>
                )}

                {/* Modal'ı kapatmak için bir buton */}
              
              </View>
            </View>
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
export default SatisFaturasiFaturaBilgisi;
