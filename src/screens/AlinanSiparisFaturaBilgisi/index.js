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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Col, Grid, Row } from 'react-native-easy-grid';
import CustomHeader from '../../components/CustomHeader';

const AlinanSiparisFaturaBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { alinanSiparis, setAddedProducts, setAlinanSiparis } = useContext(ProductContext);

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
  const [sip_tarih, setSip_tarih] = useState('');
  const [cariDetayData, setCariDetayData] = useState([]);
  const [tedarikciSiparisData, setTedarikciSiparisData] = useState('');
  const [ortalamaVadeBakiyeData, setOrtalamaVadeBakiyeData] = useState('');
  const [teminatTutariData, setTeminatTutariData] = useState('');


  // Listeler
  const [dovizList, setDovizList] = useState([]);
  const [depoList, setDepoList] = useState([]);
  const [sorumlulukMerkeziList, setSorumlulukMerkeziList] = useState([]);
  const [adresList, setAdresList] = useState([]);
  const [projeKoduList, setProjeKoduList] = useState([]);
  const [vadeList, setVadeList] = useState([]);
  const [odemeText, setOdemeText] = useState('');

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
  const [selectedValue, setSelectedValue] = useState(null); 

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
  const [isProjeKoduModalVisible, setIsProjeKoduModalVisible] = useState(false);
  const [isVadeModalVisible, setIsVadeModalVisible] = useState(false);
  const [isGModalVisible, setIsGModalVisible] = useState(false);
  const [isTModalVisible, setIsTModalVisible] = useState(false);
  const [isAdresModalVisible, setIsAdresModalVisible] = useState(false);
  const [isTipModalVisible, setIsTipModalVisible] = useState(false); 
  const [isEvrakTipModalVisible, setIsEvrakTipModalVisible] = useState(false); 
  const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);
  const [isCariDetayVisible, setIsCariDetayVisible] = useState(false);
  const [isOzelAlanDetayVisible, setIsOzelAlanVisible] = useState(false);
  const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);

// Tümü 

  // AsyncStorage'dan veriyi yükle
   const loadDataFromAsyncStorage = async () => {
    try {
      const savedFaturaBilgileri = await AsyncStorage.getItem('alinanSiparis');
      
      if (savedFaturaBilgileri) {
        const parsedFaturaBilgileri = JSON.parse(savedFaturaBilgileri);
        setAlinanSiparis(parsedFaturaBilgileri);
        
        const savedProjeKodu = parsedFaturaBilgileri.sip_projekodu;
    
        if (savedProjeKodu) {
          setSip_projekodu(savedProjeKodu);  // Kod değerini state'e kaydediyoruz
          
          // Proje kodu ile ilişkili ismi bulmak için API'den alınan proje kodları listesi ile eşleşme yapıyoruz
          //console.log(projeKoduList.map(item => item.Kod)); // Kodları kontrol et
          const selectedProje = projeKoduList.find(item => JSON.stringify(item.Kod) === JSON.stringify(savedProjeKodu));
          if (selectedProje) {
            setSip_projekodu(selectedProje.Isim); // Proje ismini set et
          } else {
            console.log('Proje kodu bulunamadı');
          }
        }
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  };

  const loadOnaysizDataFromAsyncStorage = async () => {
    try {
      const savedFaturaBilgileri = await AsyncStorage.getItem('alinanSiparis');
      if (savedFaturaBilgileri) {
        const parsedFaturaBilgileri = JSON.parse(savedFaturaBilgileri);
        const onaysizKaydedilsin = defaults[0].IQ_SipOnaysizKaydedilsin;
        const mikroPersKod = defaults[0].IQ_MikroPersKod;
        
        // sip_OnaylayanKulNo değerini belirleme
        let sip_OnaylayanKulNoValue = onaysizKaydedilsin === 1 ? 0 : mikroPersKod;
        
        setAlinanSiparis(prev => ({
          ...parsedFaturaBilgileri, // Kaydedilmiş diğer değerleri yükle
          sip_OnaylayanKulNo: sip_OnaylayanKulNoValue,
        }));
        
        // Güncellenmiş `faturaBilgileri` objesini AsyncStorage'a kaydet
        await AsyncStorage.setItem('alinanSiparis', JSON.stringify({
          ...parsedFaturaBilgileri,
          sip_OnaylayanKulNo: sip_OnaylayanKulNoValue,
        }));
      }
      
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  };

  const loadSorumlulukMerkeziFromAsyncStorage = async () => {
    try {
        const savedFaturaBilgileri = await AsyncStorage.getItem('alinanSiparis');

        if (savedFaturaBilgileri) {
            const parsedFaturaBilgileri = JSON.parse(savedFaturaBilgileri);
            setAlinanSiparis(parsedFaturaBilgileri);

            const savedSorumlulukMerkeziKodu = parsedFaturaBilgileri.sip_stok_sormerk;

            if (savedSorumlulukMerkeziKodu) {
                setSip_stok_sormerk(savedSorumlulukMerkeziKodu);

                // Sorumluluk merkezi listesinde kodu arıyoruz
                const selectedSorumlulukMerkezi = sorumlulukMerkeziList.find(
                    item => String(item.Kod) === String(savedSorumlulukMerkeziKodu)
                );

                // Eğer eşleşen sorumluluk merkezi bulunduysa, ismini ayarlıyoruz
                if (selectedSorumlulukMerkezi) {
                    // İsim değerini al ve TextInput'a ekle
                    setSip_stok_sormerk(selectedSorumlulukMerkezi.Kod);
                } else {
                    console.log('Sorumluluk merkezi kodu bulunamadı');
                }
            }
        }
    } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
    }
};


  const loadVadeFromAsyncStorage = async () => {
    try {
      const savedVade = await AsyncStorage.getItem('alinanSiparis');
      if (savedVade) {
        const parsedVade = JSON.parse(savedVade);
        //console.log('Gelen Vade Verisi:', parsedVade);  // Veriyi doğru yazdırdığınızı kontrol edin
        setSip_opno(parsedVade.sip_opno);
        setSelectedVadeNo(parsedVade.selectedVadeNo);
      }
    } catch (error) {
      console.error('Error loading vade data from AsyncStorage:', error);
    }
  };

  const loadCariFromAsyncStorage = async () => {
    try {
      const savedFaturaBilgileri = await AsyncStorage.getItem('alinanSiparis');
      
      if (savedFaturaBilgileri) {
        const parsedFaturaBilgileri = JSON.parse(savedFaturaBilgileri);
        setAlinanSiparis(parsedFaturaBilgileri);
  
        // Cari kodu ve ünvanı set et
        setSip_musteri_kod(parsedFaturaBilgileri.sip_musteri_kod);
        setSip_cari_unvan1(parsedFaturaBilgileri.sip_cari_unvan1);
      }
    } catch (error) {
      console.error('Cari bilgileri AsyncStorage\'dan yüklenirken hata:', error);
    }
  };
  
  const loadAddressFromAsyncStorage = async () => {
    try {
      const savedFaturaBilgileri = await AsyncStorage.getItem('alinanSiparis');
      
      if (savedFaturaBilgileri) {
        const parsedFaturaBilgileri = JSON.parse(savedFaturaBilgileri);
        const savedAddressNo = parsedFaturaBilgileri.sip_adresno;
  
        if (savedAddressNo) {
          setSip_adresno(savedAddressNo); // Adres numarasını state'e kaydediyoruz
          
          // Adres listesinde adres numarası ile eşleşen adresi bulmak için
          const fetchedAdresList = await fetchAdresList(parsedFaturaBilgileri.sip_musteri_kod);
          const selectedAddress = fetchedAdresList.find(item => item.Adres_No === savedAddressNo);
          
          if (selectedAddress) {
            setSip_adresno(selectedAddress.Adres); // Adres değerini set et
            setAlinanSiparis(prevState => ({
              ...prevState,
              sip_adresno: selectedAddress.Adres_No,
            }));
          } else {
            console.log('Adres numarasına göre adres bulunamadı');
          }
        }
      }
    } catch (error) {
      console.error('Error loading address from AsyncStorage:', error);
    }
  };

  const loadDepoFromAsyncStorage = async () => {
    try {
      const savedDepo = await AsyncStorage.getItem('selectedDepo');
      
      if (savedDepo) {
        const depoNo = JSON.parse(savedDepo);
        setSip_depono(depoNo);
  
        // Fatura bilgilerini güncelle
        setAlinanSiparis((prev) => ({
          ...prev,
          sip_depono: depoNo,
        }));
      }
    } catch (error) {
      console.error('Error loading depo from AsyncStorage:', error);
    }
  };
  
  const loadDovizFromAsyncStorage = async () => {
    try {
      const savedDoviz = await AsyncStorage.getItem('selectedDoviz');
      
      if (savedDoviz) {
        const dovizNo = JSON.parse(savedDoviz);
        setSip_doviz_cinsi(dovizNo);
  
        // Fatura bilgilerini güncelle
        setAlinanSiparis((prev) => ({
          ...prev,
          sip_doviz_cinsi: dovizNo,
        }));
      }
    } catch (error) {
      console.error('Error loading depo from AsyncStorage:', error);
    }
  };

  const loadEvrakNoFromAsyncStorage = async () => {
    try {
      const savedEvrakNo = await AsyncStorage.getItem('evrakNo');
      const savedGirisDepoNo = await AsyncStorage.getItem('girisDepoNo');
      if (savedEvrakNo !== null) {
        setSip_evrakno_seri(savedEvrakNo);
      }
      if (savedGirisDepoNo !== null) setSth_giris_depo_no(savedGirisDepoNo);
    } catch (error) {
      console.error('Error loading Evrak No from AsyncStorage:', error);
    }
  };

  const loadIrsaliyeTipiFromAsyncStorage = async () => {
    try {
      const savedIrsaliyeTipi = await AsyncStorage.getItem('selectedIrsaliyeTipi');
  
      if (savedIrsaliyeTipi) {
        const irsaliyeTipiValue = JSON.parse(savedIrsaliyeTipi);
        setIrsaliyeTipi(irsaliyeTipiValue);
  
        // İlgili değerleri fatura bilgilerine yükle
        let sip_tip = 0;
        let sip_cins = 0;
  
        switch (irsaliyeTipiValue) {
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
  
        setAlinanSiparis(prevState => ({
          ...prevState,
          sip_tip,
          sip_cins,
        }));
      }
    } catch (error) {
      console.error('Error loading irsaliyeTipi from AsyncStorage:', error);
    }
  };
  
  const loadDateFromAsyncStorage = async () => {
      const currentDate = new Date();
  
      // Tarihi formatla ve fatura bilgisine ekle
      const formattedDate = formatDate(currentDate);
      setDate(currentDate);
      setAlinanSiparis(prevState => ({
        ...prevState,
        sip_tarih: formattedDate,
      }));
  };

   // Veriyi AsyncStorage'a kaydet
  const saveDataToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('sip_projekodu', sip_projekodu); // Kod'u kaydediyoruz
      await AsyncStorage.setItem('alinanSiparis', JSON.stringify(alinanSiparis)); // Fatura bilgilerini kaydediyoruz
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  const saveCariToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('sip_musteri_kod', sip_musteri_kod); // Cari kodunu kaydediyoruz
      await AsyncStorage.setItem('alinanSiparis', JSON.stringify(alinanSiparis)); // Fatura bilgilerini kaydediyoruz
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  const saveSorumlulukMerkeziToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('sip_stok_sormerk', sip_stok_sormerk); // Kod'u kaydediyoruz
      await AsyncStorage.setItem('alinanSiparis', JSON.stringify(alinanSiparis)); // Fatura bilgilerini kaydediyoruz
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  const saveVadeToAsyncStorage = async () => {
    try {
      const vadeData = {
        //sip_opno,
        //selectedVadeNo,
      };
      //console.log('Kaydedilen Vade Verisi:', vadeData); // Veriyi kontrol et
      await AsyncStorage.setItem('vade', JSON.stringify(vadeData));
    } catch (error) {
      console.error('Error saving vade data to AsyncStorage:', error);
    }
  };

  const saveAddressToAsyncStorage = async (selectedAddress) => {
    try {
      const alinanSiparis = await AsyncStorage.getItem('alinanSiparis');
      const parsedFaturaBilgileri = alinanSiparis ? JSON.parse(alinanSiparis) : {};
  
      const updatedFaturaBilgileri = {
        ...parsedFaturaBilgileri,
        sip_adresno: selectedAddress.Adres_No,
      };
  
      await AsyncStorage.setItem('alinanSiparis', JSON.stringify(updatedFaturaBilgileri));
    } catch (error) {
      console.error("Error saving address to AsyncStorage:", error);
    }
  };
  
  useEffect(() => {
    //console.log("Fatura:", alinanSiparis);  // Burada log ekleyin
  
  }, [alinanSiparis]);
 
  useEffect(() => {
    
         //loadDataFromAsyncStorage();  // 1. Verileri AsyncStorage'dan yükler
         //loadSorumlulukMerkeziFromAsyncStorage(); // 2. Sorumluluk merkezi yükler
         //loadVadeFromAsyncStorage(); // 3. Vade bilgisi yükler
        //loadCariFromAsyncStorage(); // 4. Cari bilgisi yükler
         //loadAddressFromAsyncStorage(); // 5. Adres bilgisi yükler
         //loadDepoFromAsyncStorage(); // 6. Depo bilgisi yükler
        // loadDovizFromAsyncStorage(); // 7. Döviz bilgisi yükler
        //loadIrsaliyeTipiFromAsyncStorage(); // 8. İrsaliye tipi yükler
        // loadDateFromAsyncStorage(); // 9. Tarih bilgisi yükler
        // loadEvrakNoFromAsyncStorage(); // 10. Evrak no bilgisi yükler
        // loadOnaysizDataFromAsyncStorage(); // 11. Onaysız data yükler
  }, []);
  

   
  useEffect(() => {
    if (projeKoduList.length === 0) {
      fetchProjeKoduList(); // Listeyi API'den al
    } else {
      //loadDataFromAsyncStorage(); // Liste yüklendiyse AsyncStorage'dan veriyi yükle
    }
  }, [projeKoduList]); // Liste değiştiğinde çalışacak

  useEffect(() => {
    if (sorumlulukMerkeziList.length === 0) {
      fetchSorumlulukMerkeziList(); // Listeyi API'den al
    } else {
      //loadSorumlulukMerkeziFromAsyncStorage(); // Liste yüklendiyse AsyncStorage'dan veriyi yükle
    }
  }, [sorumlulukMerkeziList]); // Liste değiştiğinde çalışacak

  useEffect(() => {
    if (vadeList.length === 0) {
      fetchVadeList(); // Listeyi API'den al
    } else {
      //loadVadeFromAsyncStorage(); // Liste yüklendiyse AsyncStorage'dan veriyi yükle
    }
  }, [vadeList]); // Liste değiştiğinde çalışacak



// Veriyi AsyncStorage'a kaydet
   
    

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
      const { IQ_AlisSiparisSeriNoDegistirebilir, IQ_CikisDepoNoDegistirebilir, IQ_VadePasifGelsin, IQ_OPCaridenGelsin } = defaults[0];
      setIsEditable(IQ_AlisSiparisSeriNoDegistirebilir === 1);
      setPickerEditable(IQ_CikisDepoNoDegistirebilir === 1); 
      setVadeEditable(IQ_VadePasifGelsin === 1); 
    }
    }, [defaults]);

  
    const updateDepoSelection = async (cari) => {
      if (defaults && defaults[0]) {
        const selectedCariDepoNo = cari.cari_VarsayilanCikisDepo;
        //console.log('Seçilen Cari Depo No:', selectedCariDepoNo);
        //console.log('IQ_CikisDepoNo:', defaults[0].IQ_CikisDepoNo);
      
        // defaults[0] içindeki gerekli verileri al
        const { IQ_CikisDepoCaridenGelsin, IQ_CikisDepoNo } = defaults[0];
      
        // Eğer cari_VarsayilanCikisDepo 0 ise, IQ_CikisDepoNo'daki depo numarasını kullan
        if (selectedCariDepoNo === 0) {
          const defaultDepo = depoList.find(depo => depo.No === IQ_CikisDepoNo);
          if (defaultDepo) {
            // Varsayılan depo bulunduysa, state'i güncelle ve picker'da seçili hale getir
            setSip_depono(defaultDepo.No.toString());
            setAlinanSiparis(prevState => ({
              ...prevState,
              sip_depono: defaultDepo.No.toString(),
            }));
          }
        } else {
          // Eğer cari'nin varsayılan depo numarası varsa, onu kullan
          if (selectedCariDepoNo) {
            setSip_depono(selectedCariDepoNo.toString());
            setAlinanSiparis(prevState => ({
              ...prevState,
              sip_depono: selectedCariDepoNo.toString(),
            }));
          }
        }
    
        // Depo bilgisi dışarıdan geliyorsa, varsayılan depo numarasını kullan
        if (IQ_CikisDepoCaridenGelsin === 0) {
          const defaultDepo = depoList.find(depo => depo.No === IQ_CikisDepoNo);
          if (defaultDepo) {
            setSip_depono(defaultDepo.No.toString());
            setAlinanSiparis(prevState => ({
              ...prevState,
              sip_depono: defaultDepo.No.toString(),
            }));
          }
        }
      }
    };
    
  // Değiştirilebilir Alanlar 

  // Sayfa Açıldığında Gönderilen Varsayılan Değerler
    useEffect(() => {
      setAlinanSiparis(prevState => ({
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
  {/* 
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setAlinanSiparis({});
      };
    }, [])
  );
  */}

  useEffect(() => {
    fetchDovizList();
    fetchDepoList();
    handleIrsaliyeTipiChange('Çok Dövizli');
  }, []);

  const closeModal = () => {
    setIsCariDetayVisible(false);
    setIsOzelAlanVisible(false);
    setCariDetayData(null);
  };

  // Sayfa açıldığında varsayılan irsaliye tipini ayarlayan useEffect
useEffect(() => {
  if (Object.keys(alinanSiparis).length === 0) { // alinanSiparis boş ise
    const defaultIrsaliyeTipi = 'Çok Dövizli'; // Varsayılan değer
    setIrsaliyeTipi(defaultIrsaliyeTipi);

    let sip_tip = 0;
    let sip_cins = 0;

    switch (defaultIrsaliyeTipi) {
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

    setAlinanSiparis(prevState => ({
      ...prevState,
      sip_tip,
      sip_cins,
    }));
  }
}, [alinanSiparis]);

// handleIrsaliyeTipiChange fonksiyonu
const handleIrsaliyeTipiChange = async (itemValue) => {
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

  setAlinanSiparis(prevState => ({
    ...prevState,
    sip_tip,
    sip_cins,
  }));

  try {
    // İrsaliye tipi bilgisini AsyncStorage'a kaydet (isteğe bağlı)
    // await AsyncStorage.setItem('selectedIrsaliyeTipi', JSON.stringify(itemValue));
  } catch (error) {
    console.error('Error saving irsaliyeTipi to AsyncStorage:', error);
  }
};


  // Evrak Tarih Alanı


  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
  
    // alinanSiparis içinde sip_tarih yoksa veya boşsa ekle
    if (!alinanSiparis?.sip_tarih) {
      setDate(currentDate); // Yerel state'teki tarihi güncelle
      setAlinanSiparis(prevState => ({
        ...prevState,
        sip_tarih: formattedDate, // Güncellenmiş tarihi ekle
      }));
    }
  }, [alinanSiparis]); 
  

  
  
  
  // Tarih değiştirildiğinde güncelleyip kaydeden fonksiyon
  const handleDateChange = async (event, selectedDate) => {
    setShowDatePicker(false);
    const newDate = selectedDate || date;
    setDate(newDate);
  
    const formattedDate = formatDate(newDate);
  
    // alinansiparis state'ini güncelle
    setAlinanSiparis(prevState => ({
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
      const selectedCariUnvan = cari.Ünvan;
      let selectedOdemePlanNo = cari.cari_odemeplan_no;
      console.log(selectedOdemePlanNo);
    
      // Cari kodu ve unvanını set et
      setSip_musteri_kod(selectedCariKodu);
      setSip_cari_unvan1(selectedCariUnvan);
    
      setAlinanSiparis((prevState) => ({
        ...prevState,
        sip_musteri_kod: selectedCariKodu,
        sip_cari_unvan1: selectedCariUnvan,
      }));
    
      // Ödeme plan numarasına göre işlem
      if (selectedOdemePlanNo === 0) {
        // Peşin ise
        setSip_opno("PEŞİN");
        setAlinanSiparis((prevState) => ({
          ...prevState,
          sip_opno: 0, // 0 gönderecek
        }));
      } else if (selectedOdemePlanNo < 0) {
        // Negatif ise
        const gunSayisi = Math.abs(selectedOdemePlanNo); // Negatif değeri pozitife çevir
        const textIcerik = `${gunSayisi} GÜN`;
        setSip_opno(textIcerik);
        setAlinanSiparis((prevState) => ({
          ...prevState,
          sip_opno: selectedOdemePlanNo, // Negatif değeri gönderecek
        }));
      } else if (selectedOdemePlanNo > 0) {
        // Pozitif ise ödeme planları listesine bak
        try {
          const odemePlanlariList = await fetchVadeList();
          if (odemePlanlariList && odemePlanlariList.length > 0) {
            const selectedOdemePlan = odemePlanlariList.find((plan) => plan.No === selectedOdemePlanNo);
            if (selectedOdemePlan) {
              setSip_opno(selectedOdemePlan.Isim); // İsmini göster
              setAlinanSiparis((prevState) => ({
                ...prevState,
                sip_opno: selectedOdemePlan.No, // Numarasını gönderecek
              }));
            } else {
              console.log("Eşleşen ödeme planı bulunamadı.");
            }
          } else {
            console.log("Ödeme planları listesi boş.");
          }
        } catch (error) {
          console.error("Ödeme planı fetch edilirken hata:", error);
        }
      }
    
      // Doviz listesi getir
      fetchDovizList(selectedCariKodu);
    
      // Adres listesi getir ve ilk adresi set et
      const adresList = await fetchAdresList(selectedCariKodu);
      if (adresList && adresList.length > 0) {
        const firstAddress = adresList[0];
        setSip_adresno(firstAddress.Adres);
        setAlinanSiparis((prevState) => ({
          ...prevState,
          sip_adresno: firstAddress.Adres_No,
        }));
      } else {
        console.log("Adres listesi boş geldi.");
      }
    
      // Depo seçim güncelle
      await updateDepoSelection(cari);
    
      // Cari listesi modalını kapat
      setIsCariListModalVisible(false);
    };
    

  // Cari Seçim

  // Depo Seçim
    const handleDepoChange = async (itemValue) => {
      setSip_depono(itemValue);
      setAlinanSiparis((prev) => ({
        ...prev,
        sip_depono: itemValue,
      }));
    
      try {
        // Depo bilgisini AsyncStorage'a kaydet
        await AsyncStorage.setItem('selectedDepo', JSON.stringify(itemValue));
      } catch (error) {
        console.error('Error saving depo to AsyncStorage:', error);
      }
    };
  // Depo Seçim

  // Döviz Seçim
    const handleDovizChange = async (itemValue) => {
      setSip_doviz_cinsi(itemValue);
      setAlinanSiparis((prev) => ({
        ...prev,
        sip_doviz_cinsi: itemValue,
      }));
      try {
        // Depo bilgisini AsyncStorage'a kaydet
        await AsyncStorage.setItem('selectedDoviz', JSON.stringify(itemValue));
      } catch (error) {
        console.error('Error saving depo to AsyncStorage:', error);
      }
    };
  // Döviz Seçim

  // Evrak No Değişim Alanı
    const handleEvrakNo = async (text) => {
      setSip_evrakno_seri(text);
    try {
      await AsyncStorage.setItem('evrakNo', text);
    } catch (error) {
      console.error('Error saving Evrak No to AsyncStorage:', error);
    }
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
      setAlinanSiparis(prevState => ({
        ...prevState,
        sip_projekodu: item.Kod,
      }));
      setIsProjeKoduModalVisible(false);
      saveDataToAsyncStorage()
    };
  // Proje Kodu Seçim

  // Sorumluluk Merkezi Seçim
    const handleSorumlulukMerkeziClick = () => {
      fetchSorumlulukMerkeziList(); 
      setIsSorumlulukMerkeziModalVisible(true); 
    };
  
    const handleSorumlulukMerkeziSelect = (item) => {
      setSip_stok_sormerk(item.İsim);
      setAlinanSiparis(prevState => ({
        ...prevState,
        sip_stok_sormerk: item.Kod,
      }));
      setIsSorumlulukMerkeziModalVisible(false);
      saveSorumlulukMerkeziToAsyncStorage();
    };
  // Sorumluluk Merkezi Seçim

  // Adres Seçim
    const handleAdresClick = async () => {
      const fetchedAdresList = await fetchAdresList(sip_musteri_kod); // Adres listesini çek
      setAdresList(fetchedAdresList); // Çekilen adresleri state'e ata
      setIsAdresListModalVisible(true); // Modalı göster
    };
  
    const handleAdresSelect = async (item) => {
      setSip_adresno(item.Adres);
      setAlinanSiparis(prevState => ({
        ...prevState,
        sip_adresno: item.Adres_No,
      }));
      setIsAdresListModalVisible(false);

      await saveAddressToAsyncStorage(item);
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
      saveVadeToAsyncStorage();
  
      setAlinanSiparis(prevState => ({
        ...prevState,
        sip_opno: item.No,
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
        setSip_opno(gValue); 
        setAlinanSiparis(prevState => ({
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
        setAlinanSiparis(prevState => ({
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
          setAlinanSiparis((prev) => ({
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
    
      } catch (error) {
        console.error('Bağlantı Hatası Depo List:', error);
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
          const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${defaults[0].IQ_MikroUserId}`);
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

    const fetchCariDetayData = async (sip_musteri_kod, pickerValue) => {
      setLoading(true);
      try {
          // Cari Detay - siparis veya vadeBakiye
          if (pickerValue === "Tedarikçi Bazında Bekleyen Siparişler") {
              const response1 = await axiosLinkMain.get(`/api/Raporlar/TedarikciBazindaBekleyenSiparis?cari=${sip_musteri_kod}`);
              const tedarikciData = response1.data || [];
              setTedarikciSiparisData(tedarikciData);
          } else if (pickerValue === "Sorumluluk Bazında Ortalama Vade") {
              const response2 = await axiosLinkMain.get(`/api/Raporlar/SorumlulukBazindaOrtVadeBakiye?cari=${sip_musteri_kod}`);
              const vadeBakiyeData = response2.data || [];
              setOrtalamaVadeBakiyeData(vadeBakiyeData);
          } 
      } catch (error) {
          console.error('Bağlantı Hatası Cari Detay:', error);
      } finally {
          setLoading(false);
          setIsCariDetayVisible(true);
      }
  };

  const fetchOzelAlanData = async (sip_musteri_kod, pickerValue) => {
    setLoading(true);
    try {
        if (pickerValue === "Özel Alanlar") {
            const response3 = await axiosLinkMain.get(`/api/Raporlar/CariOzelAlan?cari=${sip_musteri_kod}&userno=${defaults[0].IQ_MikroPersKod}`);
            console.log("CariOzelAlan API Yanıtı:", response3.data); // API yanıtını kontrol edin
            const teminatData = response3.data || [];
            setTeminatTutariData(teminatData);
        } 
    } catch (error) {
        console.error('Bağlantı Hatası Cari Detay:', error);
    } finally {
        setLoading(false);
        setIsOzelAlanVisible(true);
    }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(price);
  };

  
  const renderSelectedData = () => {
    switch (selectedValue) {
        case "Tedarikçi Bazında Bekleyen Siparişler":
            return (
                <ScrollView horizontal={true} style={MainStyles.horizontalScroll}>
                    <Grid>
                        <Row style={MainStyles.tableHeader}>
                            <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                <Text style={MainStyles.colTitle}>TEDARİKÇİ</Text>
                            </Col>
                            <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                <Text style={MainStyles.colTitle}>TUTAR</Text>
                            </Col>
                        </Row>
                        {tedarikciSiparisData.map((item, index) => (
                            <Row key={index} style={MainStyles.tableRowModal}>
                                <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                    <Text style={MainStyles.colText}>{item.Tedarikci}</Text>
                                </Col>
                                <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                    <Text style={MainStyles.colText}>{formatPrice(item.tutar)}</Text>
                                </Col>
                            </Row>
                        ))}
                    </Grid>
                </ScrollView>
            );

        case "Sorumluluk Bazında Ortalama Vade":
            return (
                <ScrollView horizontal={true} style={MainStyles.horizontalScroll}>
                    <Grid>
                        <Row style={MainStyles.tableHeader}>
                            <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                <Text style={MainStyles.colTitle}>SRM BAKİYE</Text>
                            </Col>
                            <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                <Text style={MainStyles.colTitle}>VADE</Text>
                            </Col>
                        </Row>
                        {ortalamaVadeBakiyeData.map((item, index) => (
                            <Row key={index} style={MainStyles.tableRowModal}>
                                <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                    <Text style={MainStyles.colText}>{item.SrmBakiye}</Text>
                                </Col>
                                <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                    <Text style={MainStyles.colText}>{item.Vade}</Text>
                                </Col>
                            </Row>
                        ))}
                    </Grid>
                </ScrollView>
            );

        default:
            return <Text>Veri bulunamadı.</Text>;
    }
};
const renderOzelAlanSelectedData = () => {
  switch (selectedValue) {
      case "Özel Alanlar":
          return (
              <ScrollView horizontal={true} style={MainStyles.horizontalScroll}>
                  <Grid>
                      <Row style={MainStyles.tableHeader}>
                          <Col style={[MainStyles.tableCell, { width: 350, alignItems: 'center' }]} >
                              <Text style={MainStyles.colTitle}>Özel Alanlar</Text>
                          </Col>
                      </Row>
                      {teminatTutariData.length > 0 ? (
                          teminatTutariData.map((item, index) => (
                              <Row key={index} style={MainStyles.tableRowModal}>
                                  <Col style={[MainStyles.tableCell, { width: 150 }]} >
                                      <Text style={MainStyles.colTitle}>{item.Tip}</Text>
                                  </Col>
                                  <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                      <Text style={MainStyles.colText}>{item.Deger}</Text>
                                  </Col>
                              </Row>
                          ))
                      ) : (
                          <Text></Text>
                      )}
                  </Grid>
              </ScrollView>
          );

      default:
          return <Text>Veri bulunamadı.</Text>;
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
              style={{position: 'absolute', backgroundColor: colors.textinputgray}}
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

        <View style={{flexDirection: 'row',}}>
    <TouchableOpacity
        style={{ backgroundColor: colors.textInputBg, paddingVertical: 5, marginBottom: 10, borderRadius: 5,  width: '50%' }}
        onPress={() => {
            setSelectedValue('Tedarikçi Bazında Bekleyen Siparişler');  // veya 'vadeBakiye' değerleri
            fetchCariDetayData(sip_musteri_kod, 'Tedarikçi Bazında Bekleyen Siparişler'); // ya da 'vadeBakiye'
        }}
    >
        <Text style={{ color: colors.black, textAlign: 'center', fontSize: 11 }}>Cari Detay</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={{ backgroundColor: colors.textInputBg, paddingVertical: 5, marginBottom: 10, borderRadius: 5,  width: '50%' }}
        onPress={() => {
            setSelectedValue('Özel Alanlar'); // Teminat Tutari
            fetchOzelAlanData(sip_musteri_kod, 'Özel Alanlar');
        }}
    >
        <Text style={{ color: colors.black, textAlign: 'center', fontSize: 11 }}>Özel Alan</Text>
    </TouchableOpacity>
</View>

      <Modal
            visible={isCariDetayVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <View style={[MainStyles.modalBackground]}>
                <View style={MainStyles.modalCariDetayContent}>
                <TouchableOpacity onPress={closeModal} style={MainStyles.closeAlinanProductButton}>
                        <Text style={MainStyles.closeButtonText}>Kapat</Text>
                    </TouchableOpacity>
                    {loading ? (
                           <FastImage
                           style={MainStyles.loadingGif}
                           source={require('../../res/images/image/pageloading.gif')}
                           resizeMode={FastImage.resizeMode.contain}/>
                    ) : (
                        <>
                            <Text style={MainStyles.formTitle}>Tip Seçin</Text>
                            <View style={MainStyles.inputStyleAlinanSiparis}>
                                {Platform.OS === 'ios' ? (
                                    <>
                                        <TouchableOpacity onPress={() => setIsPickerModalVisible(true)}>
                                            <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                                                {selectedValue ? selectedValue : 'Tipini Seçin'}
                                            </Text>
                                        </TouchableOpacity>

                                        {/* iOS için Modal */}
                                        <Modal
                                            visible={isPickerModalVisible}
                                            animationType="slide"
                                            transparent
                                        >
                                            <View style={MainStyles.modalContainerPicker}>
                                                <View style={MainStyles.modalContentPicker}>
                                                    <Picker
                                                        selectedValue={selectedValue}
                                                        onValueChange={(value) => {
                                                            setSelectedValue(value);
                                                            fetchCariDetayData(sip_musteri_kod, value);
                                                            setIsPickerModalVisible(false);
                                                        }}
                                                        style={MainStyles.picker}
                                                    >
                                                        <Picker.Item label="Tipini Seçin" value={null} style={MainStyles.textStyle}/>
                                                        <Picker.Item label="Tedarikçi Bazında Bekleyen Siparişler" value="Tedarikçi Bazında Bekleyen Siparişler" style={MainStyles.textStyle} />
                                                        <Picker.Item label="Sorumluluk Bazında Ortalama Vade" value="Sorumluluk Bazında Ortalama Vade" style={MainStyles.textStyle} />
                                                    </Picker>
                                                    <Button title="Kapat" onPress={() => setIsPickerModalVisible(false)} />
                                                </View>
                                            </View>
                                        </Modal>
                                    </>
                                ) : (
                                    // Android için doğrudan Picker
                                    <Picker
                                        selectedValue={selectedValue}
                                        onValueChange={(value) => {
                                            setSelectedValue(value);
                                            fetchCariDetayData(sip_musteri_kod, value);
                                        }}
                                        style={{ marginHorizontal: -10 }}
                                        itemStyle={{ height: 40, fontSize: 12 }}
                                    >
                                        <Picker.Item label="Tipini Seçin" value={null} style={MainStyles.textStyle}/>
                                        <Picker.Item label="Tedarikçi Bazında Bekleyen Siparişler" value="Tedarikçi Bazında Bekleyen Siparişler" style={MainStyles.textStyle} />
                                        <Picker.Item label="Sorumluluk Bazında Ortalama Vade" value="Sorumluluk Bazında Ortalama Vade" style={MainStyles.textStyle}/>
                                    </Picker>
                                )}
                            </View>
                            {/* Seçili değere göre veri gösterme */}
                            {renderSelectedData && renderSelectedData()}
                        </>
                    )}
                  
                </View>
            </View>
        </Modal>

        <Modal
    visible={isOzelAlanDetayVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={closeModal}
>
    <View style={[MainStyles.modalBackground]}>
        <View style={MainStyles.modalCariDetayContent}>
            <TouchableOpacity onPress={closeModal} style={MainStyles.closeAlinanProductButton}>
                <Text style={MainStyles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
            {loading ? (
                <FastImage
                    style={MainStyles.loadingGif}
                    source={require('../../res/images/image/pageloading.gif')}
                    resizeMode={FastImage.resizeMode.contain}
                />
            ) : (
                <>
                    <Text style={MainStyles.formTitle}>Tip Seçin</Text>
                    <View style={MainStyles.inputStyleAlinanSiparis}>
                        {Platform.OS === 'ios' ? (
                            <>
                                <TouchableOpacity onPress={() => setIsPickerModalVisible(true)}>
                                    <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                                        {selectedValue ? selectedValue : 'Seçiniz...'}
                                    </Text>
                                </TouchableOpacity>

                                {/* iOS için Picker Modal */}
                                <Modal
                                    visible={isPickerModalVisible}
                                    animationType="slide"
                                    transparent
                                >
                                    <View style={MainStyles.modalContainerPicker}>
                                        <View style={MainStyles.modalContentPicker}>
                                            <Picker
                                                selectedValue={selectedValue}
                                                onValueChange={(value) => {
                                                    setSelectedValue(value);
                                                    if (value === "Özel Alanlar") {
                                                        fetchOzelAlanData(sip_musteri_kod, value);
                                                    }
                                                    setIsPickerModalVisible(false); // Modalı kapat
                                                }}
                                                style={MainStyles.picker}
                                            >
                                                <Picker.Item label="Seçiniz..." value={'Seçiniz'} style={MainStyles.textStyle} />
                                                <Picker.Item label="Özel Alanlar" value="Özel Alanlar" style={MainStyles.textStyle} />
                                            </Picker>
                                            <Button title="Kapat" onPress={() => setIsPickerModalVisible(false)} />
                                        </View>
                                    </View>
                                </Modal>
                            </>
                        ) : (
                            // Android için Picker
                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={(value) => {
                                    setSelectedValue(value);
                                    if (value === "Özel Alanlar") {
                                        fetchOzelAlanData(sip_musteri_kod, value);
                                    }
                                }}
                                style={{ marginHorizontal: -10 }}
                                itemStyle={{ height: 40, fontSize: 12 }}
                            >
                                <Picker.Item label="Seçiniz..." value={'Seçiniz'} style={MainStyles.textStyle} />
                                <Picker.Item label="Özel Alanlar" value="Özel Alanlar" style={MainStyles.textStyle} />
                            </Picker>
                        )}
                    </View>
                    {/* Seçili değere göre veri gösterme */}
                    {renderOzelAlanSelectedData()}
                </>
            )}
        </View>
    </View>
</Modal>







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
                    enabled={pickerEditable}
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
              value={sip_opno ? sip_opno.toString() : ''}
              //value={odemeText}
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
              value={sip_projekodu}
              placeholder="Proje Kodu"
              placeholderTextColor={colors.placeholderTextColor}
              onChangeText={(text) => setSip_projekodu(text)}
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
