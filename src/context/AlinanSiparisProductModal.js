import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, SafeAreaView, ActivityIndicator, Button, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { MainStyles } from '../res/style/MainStyles';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../res/colors';
import { useAuthDefault } from '../components/DefaultUser';
import { ProductContext } from '../context/ProductContext';
import axiosLinkMain from '../utils/axiosMain';
import axios from 'axios';
import { Left,Down } from '../res/images';
import { Col, Grid, Row } from 'react-native-easy-grid';
import CustomHeader from '../components/CustomHeader';
import FastImage from 'react-native-fast-image';

const AlinanSiparisProductModal = ({
  selectedProduct,
  modalVisible,
  setModalVisible,
  setAddedAlinanSiparisProducts,
}) => {
  const { defaults } = useAuthDefault();
  const { addedAlinanSiparisProducts, alinanSiparis } = useContext(ProductContext);
  const [sth_miktar, setSth_miktar] = useState('1');
  const [sth_tutar, setSth_tutar] = useState(''); 
  const [birimFiyat, setBirimFiyat] = useState(''); 
  const [sth_birim_pntr, setSth_birim_pntr] = useState('AD');
  const [resetTax, setResetTax] = useState(false);
  const [aciklama, setAciklama] = useState('');
  const [sth_iskonto1, setSth_iskonto1] = useState(''); 
  const [sth_iskonto2, setSth_iskonto2] = useState(''); 
  const [sth_iskonto3, setSth_iskonto3] = useState(''); 
  const [sth_iskonto4, setSth_iskonto4] = useState(''); 
  const [sth_iskonto5, setSth_iskonto5] = useState(''); 
  const [sth_iskonto6, setSth_iskonto6] = useState(''); 
  const [sth_isk1, setSth_isk1] = useState(''); 
  const [sth_isk2, setSth_isk2] = useState(''); 
  const [sth_isk3, setSth_isk3] = useState(''); 
  const [sth_isk4, setSth_isk4] = useState(''); 
  const [sth_isk5, setSth_isk5] = useState(''); 
  const [sth_isk6, setSth_isk6] = useState(''); 
  const [StokVade, setStokVade] = useState(''); 
  const [stokDetayData, setStokDetayData] = useState(''); 
  const [birimListesi, setBirimListesi] = useState([]);
  const [katsayi, setKatsayi] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [isIskonto1Edit, setIsIskonto1Edit] = useState(false);
  const [isIskonto2Edit, setIsIskonto2Edit] = useState(false);
  const [isIskonto3Edit, setIsIskonto3Edit] = useState(false);
  const [isIskonto4Edit, setIsIskonto4Edit] = useState(false);
  const [isIskonto5Edit, setIsIskonto5Edit] = useState(false);
  const [isIskonto6Edit, setIsIskonto6Edit] = useState(false);
  const [DovizIsmi, setDovizIsmi] = useState(null);
  const [Birim_KDV, setBirim_KDV] = useState('');
  const [KDV, setKDV] = useState('');
  const [Carpan, setCarpan] = useState('');
  const [sth_vergi_pntr, setSth_vergi_pntr] = useState('');
  const [KDVDahilMi, setKDVDahilMi] = useState('');
  const [sip_doviz_cinsi, setSip_doviz_cinsi] = useState('');
  const [toplam_vergi, setToplam_vergi] = useState();
  const [isStokDetayVisible, setIsStokDetayVisible] = useState(false);
  const [isStokOzelDetayVisible, setIsStokOzelDetayVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [stokDetayOzelAlanData, setStokDetayOzelAlanData] = useState(''); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const miktarInputRef = useRef(null); // Referans oluştur

  const initialDepoNo = addedAlinanSiparisProducts.find(
    (product) => product.Stok_Kod === selectedProduct?.Stok_Kod
  )?.sip_depono || alinanSiparis.sip_depono || "";

  const [productDepo, setProductDepo] = useState(initialDepoNo); // Seçili depo
  const [depoList, setDepoList] = useState([]);
  const [isDepoModalVisible, setIsDepoModalVisible] = useState(false);
  const [pickerEditable, setPickerEditable] = useState(true);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        if (miktarInputRef.current) {
          miktarInputRef.current.focus();
        }
      }, 300); // UI tam yüklenene kadar 300ms bekletiyoruz
    }
  }, [modalVisible]);

  useEffect(() => {
    if (modalVisible) {
      fetchDepoList();
      setProductDepo(initialDepoNo); // Modal açıldığında güncel depo değerini al
    }
  }, [modalVisible, initialDepoNo]);

  const handleDepoChange = (itemValue) => {
    console.log("Yeni seçilen depo:", itemValue);
    setProductDepo(itemValue);
  };

  // Kullanıcının yetkilerine göre fiyat ve iskonto düzenleme izinleri kontrol ediliyor
  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_SiparisFiyatiDegistirebilir, IQ_SiparisIskontosu1Degistirebilir, IQ_SiparisIskontosu2Degistirebilir, IQ_SiparisIskontosu3Degistirebilir, IQ_SiparisIskontosu4Degistirebilir, IQ_SiparisIskontosu5Degistirebilir, IQ_SiparisIskontosu6Degistirebilir } = defaults[0];
      setIsEditable(IQ_SiparisFiyatiDegistirebilir === 1);
      setIsIskonto1Edit(IQ_SiparisIskontosu1Degistirebilir === 1);
      setIsIskonto2Edit(IQ_SiparisIskontosu2Degistirebilir === 1);
      setIsIskonto3Edit(IQ_SiparisIskontosu3Degistirebilir === 1);
      setIsIskonto4Edit(IQ_SiparisIskontosu4Degistirebilir === 1);
      setIsIskonto5Edit(IQ_SiparisIskontosu5Degistirebilir === 1);
      setIsIskonto6Edit(IQ_SiparisIskontosu6Degistirebilir === 1);
    }
  }, [defaults]);

  useEffect(() => {
    if (modalVisible && selectedProduct) {
  
      if (birimListesi.length > 0) {
        setSth_birim_pntr(birimListesi[0]);
      }
    }
  }, [modalVisible, selectedProduct, birimListesi]);

  // Seçilen ürünün detay bilgilerini getirir
  const fetchStokDetayData = async () => {
    if (!selectedProduct?.Stok_Kod) return; // Stok kodu olmadan isteği yapma
  
    setLoading(true); 
    try {
      const response = await axiosLinkMain.get(`/api/Raporlar/StokDurum?stok=${selectedProduct.Stok_Kod}&userno=${defaults[0].IQ_MikroPersKod}`);
      const data = response.data || []; // Hata durumunda boş dizi döner
  
      setStokDetayData(data);
    } catch (error) {
      console.error('Bağlantı Hatası Stok Detay:', error);
    } finally {
      setLoading(false); 
      setIsStokDetayVisible(true); 
    }
  };

  // Seçilen ürünün özel alan detaylarını getirir
  const fetchStokOzelAlanDetayData = async () => {
    if (!selectedProduct?.Stok_Kod) return; // Stok kodu olmadan isteği yapma
  
    setLoading(true);
    try {
      const cari = alinanSiparis.sth_cari_kodu || alinanSiparis.sip_musteri_kod  || alinanSiparis.cha_kod;
      const response = await axiosLinkMain.get(`/api/Raporlar/StokOzelAlan?stok=${selectedProduct.Stok_Kod}&cari=${cari}&userno=${defaults[0].IQ_MikroPersKod}`);
      const data = response.data || []; 
  
      setStokDetayOzelAlanData(data);
    } catch (error) {
      console.error('Bağlantı Hatası Stok Detay:', error);
    } finally {
      setLoading(false); 
      setIsStokOzelDetayVisible(true); 
    }
  };
  
  const closeModal = () => {
    setIsStokDetayVisible(false);
    setIsStokOzelDetayVisible(false);
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

  useEffect(() => {
    if (modalVisible && selectedProduct) {
      const fetchSatisFiyati = async () => {
        //console.log('addedAlinanSiparisProducts.StokVade', selectedProduct?.Vade);
        const cari = alinanSiparis.sth_cari_kodu || alinanSiparis.sip_musteri_kod  || alinanSiparis.cha_kod;
        const stok = selectedProduct?.Stok_Kod ? selectedProduct.Stok_Kod.replace(/\s/g, '%20') : '';
        const somkod = alinanSiparis.sth_stok_srm_merkezi || alinanSiparis.sip_stok_sormerk || alinanSiparis.cha_srmrkkodu;
        const odpno = alinanSiparis.sip_opno || alinanSiparis.sth_odeme_op  || alinanSiparis.cha_vade || selectedProduct?.Vade || 0;
        const apiUrl = `/Api/Stok/StokSatisFiyatı?cari=${cari}&stok=${stok}&somkod=${somkod}&odpno=${odpno || ''}`;
        console.log(apiUrl);
        try {
          const response = await axiosLinkMain.get(apiUrl);
          const data = response.data;
  
          if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
  
            if (firstItem.fiyat !== undefined && firstItem.fiyat !== null) {
              setSth_tutar(firstItem.fiyat.toString());
            }
            
            if (firstItem.fiyat !== undefined && firstItem.fiyat !== null) {
              setBirimFiyat(firstItem.fiyat.toString());
            }
            if (firstItem.fiyat) {
              setBirimFiyat(firstItem.fiyat.toString());
            }
            
            if (firstItem.Birim_KDV) {
              setBirim_KDV(firstItem.Birim_KDV.toString());  
            }

            if (firstItem.Vergipntr) {
              setSth_vergi_pntr(firstItem.Vergipntr.toString());  
            }
            if (firstItem.DovizCinsi) {
              setSip_doviz_cinsi(firstItem.DovizCinsi.toString());  
            }
            if (firstItem.DovizIsmi) {
              setDovizIsmi(firstItem.DovizIsmi.toString());  
            }
            if (firstItem.KDV) {
              setKDV(firstItem.KDV.toString());  
            }
            if (firstItem.KDVDahilMi !== undefined) {
              setKDVDahilMi(firstItem.KDVDahilMi);
            }
            if (firstItem.Carpan !== undefined) {
              setCarpan(firstItem.Carpan.toString());
            } else {
              console.warn("Carpan değeri gelmedi.");
            }
            
            const newBirimListesi = [
              firstItem.sto_birim1_ad,
              firstItem.sto_birim2_ad,
              firstItem.sto_birim3_ad,
              firstItem.sto_birim4_ad
            ].filter(birim => birim && birim.trim() !== '');
  
            setBirimListesi(newBirimListesi);
  
            setKatsayi({
              sto_birim2_katsayi: firstItem.sto_birim2_katsayi || 1,
              sto_birim3_katsayi: firstItem.sto_birim3_katsayi || 1,
              sto_birim4_katsayi: firstItem.sto_birim4_katsayi || 1
            });

            setSth_iskonto1(firstItem.isk1.toString());
            setSth_iskonto2(firstItem.isk2.toString());
            setSth_iskonto3(firstItem.isk3.toString());
            setSth_iskonto4(firstItem.isk4.toString());
            setSth_iskonto5(firstItem.isk5.toString());
            setSth_iskonto6(firstItem.isk6.toString());
            setSth_isk1(firstItem.isk1.toString());
            setSth_isk2(firstItem.isk2.toString());
            setSth_isk3(firstItem.isk3.toString());
            setSth_isk4(firstItem.isk4.toString());
            setSth_isk5(firstItem.isk5.toString());
            setSth_isk6(firstItem.isk6.toString());
  
          } else {
            console.error("API yanıtı beklenen formatta değil:", data);
          }
        } catch (error) {
          console.error("API çağrısında hata oluştu:", error);
        }
      };
  
      fetchSatisFiyati();
    }
  }, [modalVisible, selectedProduct,]);

// Miktar geçerliliğini kontrol eden fonksiyon
const validateQuantity = (quantity) => {
  const quantityFloat = parseFloat(quantity.replace(',', '.')) || 0;

  let minQuantity = 1; // Varsayılan minimum miktar
  let unitMultiplier = 1; // Varsayılan birim çarpanı

  // Seçilen birime göre katsayıyı belirliyoruz
  switch (sth_birim_pntr) {
    case birimListesi[1]: 
      unitMultiplier = katsayi.sto_birim2_katsayi || 1;
      minQuantity = unitMultiplier;
      break;
    case birimListesi[2]: 
      unitMultiplier = katsayi.sto_birim3_katsayi || 1;
      minQuantity = unitMultiplier;
      break;
    case birimListesi[3]: 
      unitMultiplier = katsayi.sto_birim4_katsayi || 1;
      minQuantity = unitMultiplier;
      break;
    case birimListesi[0]: 
      unitMultiplier = 1; 
      minQuantity = 1; 
      break;
    default:
      Alert.alert(
        'Geçersiz Birim',
        'Birim geçersiz veya desteklenmiyor.',
        [{ text: 'Tamam' }]
      );
      return false;
  }

  // Eğer Carpan değeri varsa ve miktarın çarpan ile modunu alıyoruz
  if (Carpan > 0) {
    const adjustedQuantity = quantityFloat * unitMultiplier; // Miktarı birim katsayısı ile çarpıyoruz
    if (adjustedQuantity % Carpan !== 0) {
      Alert.alert(
        'Geçersiz Miktar',
        `Miktar ${Carpan} ve katları olmalıdır.`,
        [{ text: 'Tamam' }]
      );
      return false;
    }
  } else {
    // Carpan 0 ise herhangi bir miktar geçerli
    if (quantityFloat <= 0) {
      Alert.alert(
        'Geçersiz Miktar',
        'Miktar sıfırdan büyük olmalıdır.',
        [{ text: 'Tamam' }]
      );
      return false;
    }
  }

  return true;
};

// Miktar değişimini yöneten fonksiyon
  const handleMiktarChange = (value) => {
    const quantityFloat = parseFloat(value.replace(',', '.')) || 0;
    // Seçilen birime göre katsayı ile çarpıyoruz
    let finalQuantity = quantityFloat;

    switch (sth_birim_pntr) {
      case birimListesi[1]: 
        finalQuantity = quantityFloat * katsayi.sto_birim2_katsayi;
        break;
      case birimListesi[2]: 
        finalQuantity = quantityFloat * katsayi.sto_birim3_katsayi;
        break;
      case birimListesi[3]: 
        finalQuantity = quantityFloat * katsayi.sto_birim4_katsayi;
        break;
      case birimListesi[0]: 
      default:
        finalQuantity = quantityFloat; 
        break;
    }

    return finalQuantity; // Hesaplanan miktarı döndürüyoruz
   
  };

  // 🔹 Yeni hesaplama fonksiyonu (handleMiktarChange bağımsız)
    const handleBirimChange = (selectedBirim) => {
      const miktarNum = parseFloat(sth_miktar.replace(',', '.')) || 0;

      // 🔹 Seçili birimin indeksini bul
      const selectedIndex = birimListesi.indexOf(selectedBirim);
      if (selectedIndex === -1) return;

      // 🔹 Seçili birimin katsayısını al (Varsa, yoksa 1 kullan)
      const selectedBirimKatsayi = katsayi[`sto_birim${selectedIndex + 1}_katsayi`] || 1;

      // 🔹 Tüm birimler için değer hesapla
      const yeniBirimHesaplamalari = birimListesi.map((birimAdi, index) => {
        const katsayiDegeri = katsayi[`sto_birim${index + 1}_katsayi`] || 1;
        return {
          ad: birimAdi,
          deger: (miktarNum * selectedBirimKatsayi) / katsayiDegeri, // Seçilen birime göre dönüştür
        };
      });

      // 🔹 Güncellenmiş değerleri state'e yaz
      setHesaplanmisBirimler(yeniBirimHesaplamalari);

    };

    // 🔹 Başlangıçta hesaplanmış değerleri saklamak için state
    const [hesaplanmisBirimler, setHesaplanmisBirimler] = useState([]);

   // 🔹 Birim değiştiğinde miktarı sıfırlayıp hesaplamaları çalıştır
    useEffect(() => {
      setSth_miktar(''); // 🛑 Sadece birim değiştiğinde miktarı sıfırla
      handleBirimChange(sth_birim_pntr);
    }, [sth_birim_pntr]);

    // 🔹 Miktar değiştiğinde sadece hesaplamaları çalıştır (miktarı sıfırlamaz!)
    useEffect(() => {
      handleBirimChange(sth_birim_pntr);
    }, [sth_miktar]);


    // 🔹 KDV dahil fiyat hesaplayan fonksiyon (toplam tutara göre)
    const calculateTotalWithKDV = () => {
      const totalWithoutKDV = parseFloat(calculateTotal()) || 0;
      const kdvRate = parseFloat(KDV.replace('%', '')) / 100 || 0; // "%20" → 0.20

      if (!KDVDahilMi) {
        // Eğer KDV dahil değilse, KDV'yi ekleyerek hesapla
        return totalWithoutKDV * (1 + kdvRate);
      }

      return totalWithoutKDV; // Zaten KDV dahilse, olduğu gibi bırak
    };

    // 🔹 Birim fiyat için KDV dahil hesaplama fonksiyonu
    const calculateBirimFiyatWithKDV = () => {
      const unitPrice = parseFloat(sth_tutar.replace(',', '.')) || 0;
      const kdvRate = parseFloat(KDV.replace('%', '')) / 100 || 0; // "%18" → 0.18

      if (!KDVDahilMi) {
        // Eğer KDV dahil değilse, fiyatın üstüne KDV ekle
        return unitPrice * (1 + kdvRate);
      }

      return unitPrice; // Zaten KDV dahilse, fiyatı değiştirme
    };


  const calculateTotal = () => {
    let newmiktar = handleMiktarChange(sth_miktar);
    let sth_miktarFloat = parseFloat(newmiktar) || 0;
    let sth_tutarPriceFloat = parseFloat(sth_tutar.replace(',', '.')) || 0;
    
      let sth_iskonto1 = parseFloat(sth_iskonto1) || 0;
      let sth_iskonto2 = parseFloat(sth_iskonto2) || 0;
      let sth_iskonto3 = parseFloat(sth_iskonto3) || 0;
      let sth_iskonto4 = parseFloat(sth_iskonto4) || 0;
      let sth_iskonto5 = parseFloat(sth_iskonto5) || 0;
      let sth_iskonto6 = parseFloat(sth_iskonto6) || 0;
      let sth_iskonto7 = parseFloat(sth_iskonto7) || 0;
      sth_tutarPriceFloat = sth_tutarPriceFloat * (1 - sth_iskonto1 / 100) * (1 - sth_iskonto2 / 100) * (1 - sth_iskonto3 / 100) * (1 - sth_iskonto4 / 100) * (1 - sth_iskonto5 / 100) * (1 - sth_iskonto6 / 100);
    
    return sth_miktarFloat * sth_tutarPriceFloat;
  };

  const handleClose = () => {
    resetFields();
    setSth_miktar('1');
    setSth_iskonto1('');
    setSth_iskonto2('');
    setSth_iskonto3('');
    setSth_iskonto4('');
    setSth_iskonto5('');
    setSth_iskonto6('');
    setAciklama('');
    setBirimFiyat('');
  };

  const handleAddProduct = async () => {
    if (!sth_tutar || parseFloat(sth_tutar) === 0) {
          Alert.alert('Geçersiz İşlem', 'Birim fiyatı 0 TL olamaz.');
          return;
        }
    const calculatedQuantity = handleMiktarChange(sth_miktar);
    
    if (validateQuantity(sth_miktar)) {
      const existingProduct = addedAlinanSiparisProducts.find(
        (product) => product.Stok_Kod === selectedProduct?.Stok_Kod
      );

      // Eğer KDVDahilMi true ise KDV'yi düşerek net fiyat hesapla
      const unitPrice = parseFloat(sth_tutar.replace(',', '.')) || 0;
      const kdvRate = parseFloat(KDV.replace('%', '')) / 100 || 0;

      const newQuantity = parseFloat(sth_miktar.replace(',', '.')) || 0;
      const grossTotalPrice = calculateTotal();
      const kdvExcludedTotal = grossTotalPrice / (1 + kdvRate); // KDV'siz hale getirme
      const taxAmount = (grossTotalPrice - kdvExcludedTotal).toFixed(2); // KDV tutarı

      // Sonuç olarak, KDVDahilMi true ise KDV düşülmüş tutarı, değilse orijinal değeri al
      const newTotalPrice = KDVDahilMi ? kdvExcludedTotal.toFixed(2) : grossTotalPrice;
      const newTotalMiktarPrice = (newQuantity * newTotalPrice).toFixed(2);
      const netUnitPrice = KDVDahilMi ? (unitPrice / (1 + kdvRate)) : unitPrice;
  
      try {
        // İlk API çağrısı - mevcut iskontoları hesaplamak için
        const apiUrl = `/Api/Iskonto/IskontoHesapla?tutar=${newTotalPrice}&isk1=${sth_iskonto1 || 0}&isk2=${sth_iskonto2 || 0}&isk3=${sth_iskonto3 || 0}&isk4=${sth_iskonto4 || 0}&isk5=${sth_iskonto5 || 0}&isk6=${sth_iskonto6 || 0}`;
        const response = await axiosLinkMain.get(apiUrl);
        const result = response.data;
        const { İsk1, İsk2, İsk3, İsk4, İsk5, İsk6 } = result; // İlk API'den dönen iskontolar
        // İkinci API çağrısı - Vade değerini almak için

        if (existingProduct) {
          // Eklenen ürünün iskonto değerlerini karşılaştır
          const isDiscountEqual =
            existingProduct.sth_isk1 === sth_iskonto1 &&
            existingProduct.sth_isk2 === sth_iskonto2 &&
            existingProduct.sth_isk3 === sth_iskonto3 &&
            existingProduct.sth_isk4 === sth_iskonto4 &&
            existingProduct.sth_isk5 === sth_iskonto5 &&
            existingProduct.sth_isk6 === sth_iskonto6;
  
          if (isDiscountEqual) {
            // İskontolar aynı, miktarı güncelle
            Alert.alert('Ürün Zaten Ekli', 'Bu ürün zaten eklenmiş. Miktarı güncellemek ister misiniz?', [
              {
                text: 'Miktarı Güncelle',
                onPress: async () => {
                  // Önce mevcut miktarı al
                  const previousQuantity = parseFloat(existingProduct.sth_miktar.toString().replace(',', '.')) || 0;
                  const updatedQuantity = previousQuantity + calculatedQuantity;

                  // İskonto değerlerini sıfırlayıp yeni miktara göre yeniden hesapla
                  const newTotalPriceForUpdate = (updatedQuantity * newTotalPrice).toFixed(2);
                  const resetApiUrl = `/Api/Iskonto/IskontoHesapla?tutar=${newTotalPriceForUpdate}&isk1=${sth_iskonto1 || 0}&isk2=${sth_iskonto2 || 0}&isk3=${sth_iskonto3 || 0}&isk4=${sth_iskonto4 || 0}&isk5=${sth_iskonto5 || 0}&isk6=${sth_iskonto6 || 0}`;

                  const resetResponse = await axiosLinkMain.get(resetApiUrl);
                  const {
                      İsk1: updatedİsk1,
                      İsk2: updatedİsk2,
                      İsk3: updatedİsk3,
                      İsk4: updatedİsk4,
                      İsk5: updatedİsk5,
                      İsk6: updatedİsk6,
                  } = resetResponse.data;

                  const updatedProducts = addedAlinanSiparisProducts.map((product) =>
                      product.Stok_Kod === selectedProduct?.Stok_Kod
                          ? {
                              ...product,
                              sth_miktar: updatedQuantity.toFixed(2),
                              sth_tutar: netUnitPrice.toFixed(2), 
                              sth_iskonto1: updatedİsk1.toFixed(2),
                              sth_iskonto2: updatedİsk2.toFixed(2),
                              sth_iskonto3: updatedİsk3.toFixed(2),
                              sth_iskonto4: updatedİsk4.toFixed(2),
                              sth_iskonto5: updatedİsk5.toFixed(2),
                              sth_iskonto6: updatedİsk6.toFixed(2),
                              total: calculateTotal(),
                              modalId: 0,
                              StokVade: StokVade,
                              sip_depono: productDepo,
                          }
                          : product
                  );

                  setAddedAlinanSiparisProducts(updatedProducts);

                  // State'leri sıfırlama
                  setCarpan();
                  resetFields();
              },
          },
              {
                text: 'Yeni Satır Ekle',
                onPress: () => {
                  setAddedAlinanSiparisProducts([
                    ...addedAlinanSiparisProducts,
                    {
                      id: `${selectedProduct?.Stok_Kod}-${Date.now()}`,
                      ...selectedProduct,
                      sth_miktar: calculatedQuantity,
                      sth_tutar: netUnitPrice.toFixed(2),
                      sth_birim_pntr: '1',
                      Birim_KDV: Birim_KDV,
                      sth_vergi_pntr: sth_vergi_pntr,
                      sip_doviz_cinsi: sip_doviz_cinsi,
                      resetTax,
                      aciklama,
                      birimFiyat,
                      sth_iskonto1: İsk1.toFixed(2),
                      sth_iskonto2: İsk2.toFixed(2),
                      sth_iskonto3: İsk3.toFixed(2),
                      sth_iskonto4: İsk4.toFixed(2),
                      sth_iskonto5: İsk5.toFixed(2),
                      sth_iskonto6: İsk6.toFixed(2),
                      sth_isk1: sth_iskonto1,
                      sth_isk2: sth_iskonto2,
                      sth_isk3: sth_iskonto3,
                      sth_isk4: sth_iskonto4,
                      sth_isk5: sth_iskonto5,
                      sth_isk6: sth_iskonto6,
                      total: calculateTotal(),
                      modalId: 0,
                      StokVade: StokVade,
                      sip_depono: productDepo,
                      KDVDahilMi: KDVDahilMi,
                    },
                  ]);
  
                  // State'leri sıfırlama
                  setCarpan();
                  resetFields();
                },
              },
              {
                text: 'Vazgeç',
                onPress: () => setModalVisible(false),
                style: 'cancel',
              },
            ]);
          } else {
            // İskontolar farklıysa, yeni ürün ekleme kısmı
            Alert.alert('İskonto Farklı', 'Bu ürün zaten eklenmiş ancak iskontolar farklı. Yeni satır eklemeyi veya vazgeçmeyi seçebilirsiniz.', [
              {
                text: 'Yeni Satır Ekle',
                onPress: () => {
                  setAddedAlinanSiparisProducts([
                    ...addedAlinanSiparisProducts,
                    {
                      id: `${selectedProduct?.Stok_Kod}-${Date.now()}`,
                      ...selectedProduct,
                      sth_miktar: calculatedQuantity,
                      sth_tutar: netUnitPrice.toFixed(2),
                      sth_birim_pntr: '1',
                      Birim_KDV: Birim_KDV,
                      sth_vergi_pntr: sth_vergi_pntr,
                      sip_doviz_cinsi: sip_doviz_cinsi,
                      resetTax,
                      aciklama,
                      birimFiyat,
                      sth_iskonto1: İsk1.toFixed(2),
                      sth_iskonto2: İsk2.toFixed(2),
                      sth_iskonto3: İsk3.toFixed(2),
                      sth_iskonto4: İsk4.toFixed(2),
                      sth_iskonto5: İsk5.toFixed(2),
                      sth_iskonto6: İsk6.toFixed(2),
                      sth_isk1: sth_iskonto1,
                      sth_isk2: sth_iskonto2,
                      sth_isk3: sth_iskonto3,
                      sth_isk4: sth_iskonto4,
                      sth_isk5: sth_iskonto5,
                      sth_isk6: sth_iskonto6,
                      total: calculateTotal(),
                      modalId: 0,
                      StokVade: StokVade,
                      sip_depono: productDepo,
                      KDVDahilMi: KDVDahilMi,
                    },
                  ]);
  
                  // State'leri sıfırlama
                  setCarpan();
                  resetFields();
                },
              },
              {
                text: 'Vazgeç',
                onPress: () => setModalVisible(false),
                style: 'cancel',
              },
            ]);
          }
        } else {
          // Yeni ürün ekleme kısmı
          setAddedAlinanSiparisProducts([
            ...addedAlinanSiparisProducts,
            {
              id: `${selectedProduct?.Stok_Kod}-${Date.now()}`,
              ...selectedProduct,
              sth_miktar: calculatedQuantity,
              sth_tutar: netUnitPrice.toFixed(2),
              sth_birim_pntr: '1',
              Birim_KDV: Birim_KDV,
              sth_vergi_pntr: sth_vergi_pntr,
              sip_doviz_cinsi: sip_doviz_cinsi,
              resetTax,
              aciklama,
              birimFiyat,
              toplam_vergi: 0,
              sth_iskonto1: İsk1.toFixed(2),
              sth_iskonto2: İsk2.toFixed(2),
              sth_iskonto3: İsk3.toFixed(2),
              sth_iskonto4: İsk4.toFixed(2),
              sth_iskonto5: İsk5.toFixed(2),
              sth_iskonto6: İsk6.toFixed(2),
              sth_isk1: sth_iskonto1,
              sth_isk2: sth_iskonto2,
              sth_isk3: sth_iskonto3,
              sth_isk4: sth_iskonto4,
              sth_isk5: sth_iskonto5,
              sth_isk6: sth_iskonto6,
              total: calculateTotal(),
              modalId: 0,
              StokVade: StokVade,
              sip_depono: productDepo,
              KDVDahilMi: KDVDahilMi,
            },
          ]);
  
          // State'leri sıfırlama
          setCarpan();
          resetFields();
          
        }
      } catch (error) {
        console.error('API çağrısı sırasında bir hata oluştu:', error);
      }
    }
  };
  
  const resetFields = () => {
    setSth_miktar('1'); 
    setSth_iskonto1('');
    setSth_iskonto2('');
    setSth_iskonto3('');
    setSth_iskonto4('');
    setSth_iskonto5('');
    setSth_iskonto6('');
    setAciklama(''); 
    setBirimFiyat(''); 
    setCarpan('');
    setSth_tutar(''); 
    setSip_doviz_cinsi(''); 
    setModalVisible(false); 
  };
  
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
       <KeyboardAvoidingView
        style={[MainStyles.flex1, MainStyles.backgroundColorWhite]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // iOS için varsayılan offset
      >
      <ScrollView flex={1} scrollEnabled>
      <View style={MainStyles.modalContainerDetail}>
      <CustomHeader
        title="Ürün Detayı"
        onClose={handleClose}
      />
       <View style={MainStyles.modalContainerProduct}>
        <View style={MainStyles.modalContainerProductName}>
          <Text style={MainStyles.modalStokAd}>Stok Kod:{selectedProduct?.Stok_Kod} </Text>
          <Text style={MainStyles.modalStokKodu}>Stok Adı:{selectedProduct?.Stok_Ad}</Text>
        </View>
          <View style={MainStyles.productModalContainer}>
            <View style={MainStyles.inputBirimGroup}>
              <Text style={MainStyles.inputtip}>Birim:</Text>
              <View style={MainStyles.productModalPickerContainer}>
              {Platform.OS === 'ios' ? (
                  <>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                      <Text style={MainStyles.pickerText}>
                        {sth_birim_pntr || 'Birim seçin'}
                      </Text>
                    </TouchableOpacity>

                    {/* iOS Modal */}
                    <Modal visible={isModalVisible} animationType="slide" transparent>
                      <View style={MainStyles.modalContainerPicker}>
                        <View style={MainStyles.modalContentPicker}>
                          <Picker
                            selectedValue={sth_birim_pntr}
                            onValueChange={(itemValue) => {
                              setSth_birim_pntr(itemValue);
                              handleMiktarChange(sth_miktar); 
                              setIsModalVisible(false); 
                            }}
                            style={MainStyles.picker}
                          >
                            {birimListesi.map((birim, index) => (
                              <Picker.Item
                                key={index}
                                label={`${birim} (${
                                  index === 1
                                    ? katsayi.sto_birim2_katsayi
                                    : index === 2
                                    ? katsayi.sto_birim3_katsayi
                                    : katsayi.sto_birim4_katsayi
                                })`}
                                value={birim}
                                style={MainStyles.textStyle}
                              />
                            ))}
                          </Picker>
                          <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
                        </View>
                      </View>
                    </Modal>
                  </>
                ) : (
                  // Android için düz Picker
                  <Picker
                    selectedValue={sth_birim_pntr}
                    itemStyle={{ height: 40, fontSize: 10 }}
                    style={{ marginHorizontal: -10 }}
                    onValueChange={(itemValue) => {
                      setSth_birim_pntr(itemValue);
                      handleMiktarChange(sth_miktar); 
                    }}
                  >
                    {birimListesi.map((birim, index) => (
                      <Picker.Item
                        key={index}
                        label={`${birim} (${
                          index === 1
                            ? katsayi.sto_birim2_katsayi
                            : index === 2
                            ? katsayi.sto_birim3_katsayi
                            : katsayi.sto_birim4_katsayi
                        })`}
                        value={birim}
                        style={MainStyles.textStyle}
                      />
                    ))}
                  </Picker>
                )}

              </View>
            </View>
          <View style={MainStyles.inputBirimGroup}>
            <Text style={MainStyles.inputtip}>Miktar:</Text>
            <TextInput
              ref={miktarInputRef}
              selectTextOnFocus={true}
              style={MainStyles.productModalMiktarInput}
              placeholderTextColor={colors.placeholderTextColor}
              keyboardType="numeric"
              value={sth_miktar}
              onChangeText={(value) => {
                let filteredValue = value.replace(/[^0-9.,]/g, ''); // Sadece rakam, nokta ve virgül

                // Birden fazla nokta veya virgüle izin verme
                filteredValue = filteredValue.replace(/([.,])(?=.*\1)/g, '');
                setSth_miktar(filteredValue);
              }}
            />
          </View>

        </View>
          <View style={MainStyles.inputRow}>
            <View style={MainStyles.inputGroup}>
                <Text style={MainStyles.inputtip}>Birim Fiyatı:</Text>
                <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor={colors.placeholderTextColor}
                  keyboardType="numeric"
                  value={sth_tutar}
                  editable={isEditable}
                  onChangeText={(value) => {
                    // Virgülü noktaya çevir
                    const formattedValue = value.replace(',', '.');

                    // Sadece rakamlar ve . (nokta) karakteri kabul edilsin
                    const validValue = formattedValue.replace(/[^0-9.]/g, '');

                    // Eğer birden fazla . (nokta) varsa, sonrasını kabul etme
                    const finalValue = validValue.split('.').length > 2 ? validValue.slice(0, -1) : validValue;

                    setSth_tutar(finalValue);
                  }}
                />
               <View style={MainStyles.inputGroupBirimKdv}>
                  <Text style={{ fontSize: 10, color: colors.blue, fontWeight: 'bold'  }}>
                  KDV Dahil Birim: {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateBirimFiyatWithKDV())} ₺
                  </Text>
                </View>
            </View>
              <View style={MainStyles.inputGroup}>
                <Text style={MainStyles.inputtip}>Tutar:</Text>
                  <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor={colors.placeholderTextColor}
                  editable={false}
                  value={String(calculateTotal()).replace('.', ',')}
                  keyboardType="numeric"  
                  />
                <View style={MainStyles.inputGroupKdv}>
                  <Text style={{ fontSize: 10, color: colors.blue, fontWeight: 'bold'  }}>
                  KDV Dahil: {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateTotalWithKDV())} ₺
                  </Text>
                </View>
              </View>
             
          </View>
          <Text style={MainStyles.inputtip}>Açıklama:</Text>
          <TextInput
            style={MainStyles.productModalMiktarInput}
            value={aciklama}
            placeholderTextColor={colors.placeholderTextColor}
            onChangeText={setAciklama}
            numberOfLines={1}
          />

               {/* Depo Seçim Alanı */}
              <View style={MainStyles.inputDepoSecim}>
                <Text style={MainStyles.inputtip}>Depo Seçimi:</Text>
                <View style={MainStyles.productModalPickerContainer}>
                  {Platform.OS === "ios" ? (
                    <>
                      <TouchableOpacity onPress={() => setIsDepoModalVisible(true)}>
                        <Text style={MainStyles.pickerText}>
                          {depoList.find((depo) => depo.No.toString() === productDepo)?.Adı || "Depo Seçin"}
                        </Text>
                      </TouchableOpacity>
                      <Modal visible={isDepoModalVisible} animationType="slide" transparent>
                        <View style={MainStyles.modalContainerPicker}>
                          <View style={MainStyles.modalContentPicker}>
                            <Picker
                              selectedValue={productDepo}
                              onValueChange={handleDepoChange}
                              style={MainStyles.picker}
                              enabled={pickerEditable}
                            >
                              <Picker.Item label="Depo Seçin" value="" />
                              {depoList.map((depo) => (
                                <Picker.Item key={depo.No} label={depo.Adı} value={depo.No.toString()} />
                              ))}
                            </Picker>
                            <Button title="Kapat" onPress={() => setIsDepoModalVisible(false)} />
                          </View>
                        </View>
                      </Modal>
                    </>
                  ) : (
                    <Picker
                      selectedValue={productDepo}
                      onValueChange={handleDepoChange}
                      enabled={pickerEditable}
                      itemStyle={{ height: 40, fontSize: 10 }}
                      style={{ marginHorizontal: -10 }}
                    >
                      <Picker.Item label="Depo Seçin" value="" />
                      {depoList.map((depo) => (
                        <Picker.Item key={depo.No} label={depo.Adı} value={depo.No.toString()} style={MainStyles.textStyle}/>
                      ))}
                    </Picker>
                  )}
                </View>
              </View>
              {/* Depo Seçim Alanı Bitti */}

              <View style={{ backgroundColor: colors.textInputBg, paddingVertical: 5, marginBottom: 10, borderRadius: 5 }}>
                {hesaplanmisBirimler.map((birim, index) => (
                  <Text key={index} style={{ color: colors.black, fontSize: 11, paddingHorizontal: 10 }}>
                    {`Birim ${index + 1} (${birim.ad}): ${birim.deger.toFixed(4).replace(/\.?0+$/, '')}`}
                  </Text>
                ))}
              </View>

          <View style={{flexDirection: 'row',}}>
            <TouchableOpacity
              style={{ backgroundColor: colors.textInputBg, paddingVertical: 5, marginBottom: 10, borderRadius: 5, width: '49%' }}
              onPress={fetchStokDetayData} 
            >
              <Text style={{ color: colors.black, textAlign: 'center', fontSize: 11 }}>Stok Depo Detayları</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: colors.textInputBg, paddingVertical: 5, paddingHorizontal: 5, marginBottom: 10,marginLeft: 2, borderRadius: 5, width: '49%' }}
              onPress={fetchStokOzelAlanDetayData} 
            >
              <Text style={{ color: colors.black, textAlign: 'center', fontSize: 11 }}>Özel Alan</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={isStokDetayVisible}
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
                        source={require('../res/images/image/pageloading.gif')}
                        resizeMode={FastImage.resizeMode.contain}/>
                    ) : (
                        <>
                            {stokDetayData && stokDetayData.length > 0 ? (
                              <ScrollView >
                                <ScrollView horizontal={true} style={MainStyles.horizontalScroll}>
                                    <Grid>
                                        {/* Başlık Satırı */}
                                        <Row style={MainStyles.tableHeader}>
                                            <Col style={[MainStyles.tableCell, { width: 100 }]}>
                                                <Text style={MainStyles.colTitle}>Depo No</Text>
                                            </Col>
                                            <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                                <Text style={MainStyles.colTitle}>Depo Adı</Text>
                                            </Col>
                                            <Col style={[MainStyles.tableCell, { width: 100 }]}>
                                                <Text style={MainStyles.colTitle}>Depo Miktar</Text>
                                            </Col>
                                        </Row>

                                        {/* Veri Satırları */}
                                        {stokDetayData.map((item, index) => (
                                            <Row key={index} style={MainStyles.tableRow}>
                                                <Col style={[MainStyles.tableCell, { width: 100 }]}>
                                                    <Text style={MainStyles.colText}>{item.dep_no}</Text>
                                                </Col>
                                                <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                                    <Text style={MainStyles.colText}>{item.dep_adi}</Text>
                                                </Col>
                                                <Col style={[MainStyles.tableCell, { width: 100 }]}>
                                                    <Text style={MainStyles.colText}>{item.DepoMiktarı}</Text>
                                                </Col>
                                            </Row>
                                        ))}
                                    </Grid>
                                </ScrollView>
                                </ScrollView>
                            ) : (
                                <Text style={MainStyles.modalCariDetayText}>Veri bulunamadı.</Text>
                            )}
                        </>
                    )}
                </View>
            </View>
        </Modal>

          <Modal
            visible={isStokOzelDetayVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <View style={MainStyles.modalBackground}>
                <View style={MainStyles.modalCariDetayContent}>
                <TouchableOpacity onPress={closeModal} style={MainStyles.closeAlinanProductButton}>
                        <Text style={MainStyles.closeButtonText}>Kapat</Text>
                    </TouchableOpacity>
                    {loading ? (
                        <FastImage
                        style={MainStyles.loadingGif}
                        source={require('../res/images/image/pageloading.gif')}
                        resizeMode={FastImage.resizeMode.contain}/>
                    ) : (
                        <>
                            {stokDetayOzelAlanData && stokDetayOzelAlanData.length > 0 ? (
                              <ScrollView >
                                <ScrollView horizontal={true} style={MainStyles.horizontalScroll}>
                                    <Grid>
                                        {/* Başlık Satırı */}
                                        <Row style={MainStyles.tableHeader}>
                                            <Col style={[MainStyles.tableCell, { width: 100 }]}>
                                                <Text style={MainStyles.colTitle}>Depo No</Text>
                                            </Col>
                                            <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                                <Text style={MainStyles.colTitle}>Depo Adı</Text>
                                            </Col>
                                          
                                        </Row>

                                        {/* Veri Satırları */}
                                        {stokDetayOzelAlanData.map((item, index) => (
                                            <Row key={index} style={MainStyles.tableRow}>
                                                <Col style={[MainStyles.tableCell, { width: 100 }]}>
                                                    <Text style={MainStyles.colText}>{item.Tip}</Text>
                                                </Col>
                                                <Col style={[MainStyles.tableCell, { width: 150 }]}>
                                                    <Text style={MainStyles.colText}>{item.Deger}</Text>
                                                </Col>
                                              
                                            </Row>
                                        ))}
                                    </Grid>
                                </ScrollView>
                                </ScrollView>
                            ) : (
                                <Text style={MainStyles.modalCariDetayText}>Veri bulunamadı.</Text>
                            )}
                        </>
                    )}
                  
                </View>
            </View>
        </Modal>


            <View style={MainStyles.modalInfoContainer}>
              <View style={MainStyles.modalInfoDoviz}>
                  <Text style={MainStyles.inputtip}>BekleyenSiparis : {selectedProduct?.BekleyenSiparis}</Text>
                </View>
              <View style={MainStyles.modalInfoKdv}>
                  <Text style={MainStyles.inputtip}>StokVade : {selectedProduct?.Vade}</Text>
                </View>
            </View>
            <View style={MainStyles.modalInfoContainer}>
          
              <View style={MainStyles.modalInfoDoviz}>
                  <Text style={MainStyles.inputtip}>Döviz : {DovizIsmi}</Text>
                </View>
               
                <View style={MainStyles.modalInfoKdv}>
                  <Text style={MainStyles.inputtip}>Kdv : {KDV}</Text>
                </View>
              </View>
              <View style={MainStyles.modalInfoContainer}>
                <View style={MainStyles.modalInfoDoviz}>
                  <Text style={MainStyles.inputtip}>Depo :</Text>
                </View>
                <View style={MainStyles.modalInfoKdv}>
                  <Text style={MainStyles.inputtip}>Çarpan : {Carpan}</Text>
                </View>
            </View>

            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.inputtip}>İskonto 1 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto1}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto1}
                  editable={isIskonto1Edit} 
                  onFocus={() => setSth_iskonto1('')}  
                  onBlur={() => {
                    if (!sth_iskonto1) {
                      setSth_iskonto1('0');
                    }
                  }}
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.inputtip}>İskonto 2 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto2}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto2}
                  editable={isIskonto2Edit}
                  onFocus={() => setSth_iskonto2('')}  
                  onBlur={() => {
                    if (!sth_iskonto2) {
                      setSth_iskonto2('0');
                    }
                  }}
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.inputtip}>İskonto 3 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto3}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto3}
                  editable={isIskonto3Edit}
                  onFocus={() => setSth_iskonto3('')}  
                  onBlur={() => {
                    if (!sth_iskonto3) {
                      setSth_iskonto3('0');
                    }
                  }}
                />
              </View>
            </View>
          
            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.inputtip}>İskonto 4 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto4}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto4}
                  editable={isIskonto4Edit}
                  onFocus={() => setSth_iskonto4('')}  
                  onBlur={() => {
                    if (!sth_iskonto4) {
                      setSth_iskonto4('0');
                    }
                  }}
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.inputtip}>İskonto 5 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto5}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto5}
                  editable={isIskonto5Edit}
                  onFocus={() => setSth_iskonto5('')}  
                  onBlur={() => {
                    if (!sth_iskonto5) {
                      setSth_iskonto5('0');
                    }
                  }}
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.inputtip}>İskonto 6 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto6}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto6}
                  editable={isIskonto6Edit}
                  onFocus={() => setSth_iskonto6('')}  
                  onBlur={() => {
                    if (!sth_iskonto6) {
                      setSth_iskonto6('0');
                    }
                  }}
                />
              </View>
            </View>
          
          <TouchableOpacity
            style={MainStyles.addButtonUrunDetay}
            onPress={handleAddProduct}
          >
            <Text style={MainStyles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlinanSiparisProductModal;
