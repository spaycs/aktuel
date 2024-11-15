import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
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

const ProductModal = ({
  selectedProduct,
  modalVisible,
  setModalVisible,
  setAddedProducts
}) => {
  const { defaults } = useAuthDefault();
  const { addedProducts, faturaBilgileri } = useContext(ProductContext);
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
  const [toplam_vergi, setToplam_vergi] = useState();
  const [isStokDetayVisible, setIsStokDetayVisible] = useState(false);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_IrsaliyeFiyatiDegistirebilir, IQ_IrsaliyeIskontosu1Degistirebilir, IQ_IrsaliyeIskontosu2Degistirebilir, IQ_IrsaliyeIskontosu3Degistirebilir, IQ_IrsaliyeIskontosu4Degistirebilir, IQ_IrsaliyeIskontosu5Degistirebilir, IQ_IrsaliyeIskontosu6Degistirebilir } = defaults[0];
  
      setIsEditable(IQ_IrsaliyeFiyatiDegistirebilir === 1);
      setIsIskonto1Edit(IQ_IrsaliyeIskontosu1Degistirebilir === 1);
      setIsIskonto2Edit(IQ_IrsaliyeIskontosu2Degistirebilir === 1);
      setIsIskonto3Edit(IQ_IrsaliyeIskontosu3Degistirebilir === 1);
      setIsIskonto4Edit(IQ_IrsaliyeIskontosu4Degistirebilir === 1);
      setIsIskonto5Edit(IQ_IrsaliyeIskontosu5Degistirebilir === 1);
      setIsIskonto6Edit(IQ_IrsaliyeIskontosu6Degistirebilir === 1);
    }
  }, [defaults]);

  useEffect(() => {
    if (modalVisible && selectedProduct) {
  
      if (birimListesi.length > 0) {
        setSth_birim_pntr(birimListesi[0]);
      }
    }
  }, [modalVisible, selectedProduct, birimListesi]);

  const fetchStokDetayData = async () => {
    if (!selectedProduct?.Stok_Kod) return; // Stok kodu olmadan isteği yapma
  
    setLoading(true); // Yükleniyor state'i aktif et
    try {
      // API'yi çağır
      const response = await axiosLinkMain.get(`/api/Raporlar/StokDurum?stok=${selectedProduct.Stok_Kod}&userno=${defaults[0].IQ_MikroPersKod}`);
      const data = response.data || []; // Hata durumunda boş dizi döner
  
      // Veriyi state'e ata
      setStokDetayData(data);
    } catch (error) {
      console.error('Bağlantı Hatası Stok Detay:', error);
    } finally {
      setLoading(false); // Yükleniyor state'ini kaldır
      setIsStokDetayVisible(true); // Modalı aç
    }
  };
  
  const closeModal = () => {
    setIsStokDetayVisible(false);
  };


  useEffect(() => {
    if (modalVisible && selectedProduct) {
      const fetchSatisFiyati = async () => {
        const cari = faturaBilgileri.sth_cari_kodu || faturaBilgileri.sip_musteri_kod  || faturaBilgileri.cha_kod;
        const stok = selectedProduct?.Stok_Kod;
        const somkod = faturaBilgileri.sth_stok_srm_merkezi || faturaBilgileri.sip_stok_sormerk || faturaBilgileri.cha_srmrkkodu;
        const odpno = faturaBilgileri.sth_odeme_op || faturaBilgileri.sip_opno  || faturaBilgileri.cha_vade;
        const apiUrl = `/Api/Stok/StokSatisFiyatı?cari=${cari}&stok=${stok}&somkod=${somkod}&odpno=${odpno}`;
        
        try {
          const response = await axiosLinkMain.get(apiUrl);
          const data = response.data;
  
          if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
  
            if (firstItem.fiyat) {
              setSth_tutar(firstItem.fiyat.toString());
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
            if (firstItem.DovizIsmi) {
              setDovizIsmi(firstItem.DovizIsmi.toString());  
            }
            if (firstItem.KDV) {
              setKDV(firstItem.KDV.toString());  
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
  }, [modalVisible, selectedProduct]);

// Miktar geçerliliğini kontrol eden fonksiyon
const validateQuantity = (quantity) => {
  const quantityFloat = parseFloat(quantity.replace(',', '.')) || 0;

  let minQuantity = 1; // Varsayılan minimum miktar
  let unitMultiplier = 1; // Varsayılan birim çarpanı

  // Seçilen birime göre katsayıyı belirliyoruz
  switch (sth_birim_pntr) {
    case birimListesi[1]: // KUT birimi
      unitMultiplier = katsayi.sto_birim2_katsayi || 1;
      minQuantity = unitMultiplier;
      break;
    case birimListesi[2]: // KOL birimi
      unitMultiplier = katsayi.sto_birim3_katsayi || 1;
      minQuantity = unitMultiplier;
      break;
    case birimListesi[3]: // Yeni eklenen birim, sto_birim4_ad
      unitMultiplier = katsayi.sto_birim4_katsayi || 1;
      minQuantity = unitMultiplier;
      break;
    case birimListesi[0]: // AD birimi
      unitMultiplier = 1; // AD biriminde çarpan yok
      minQuantity = 1; // AD biriminde minimum miktar 1
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
      case birimListesi[1]: // KL birimi
        finalQuantity = quantityFloat * katsayi.sto_birim2_katsayi;
        break;
      case birimListesi[2]: // KOL birimi
        finalQuantity = quantityFloat * katsayi.sto_birim3_katsayi;
        break;
      case birimListesi[3]: // Yeni eklenen birim
        finalQuantity = quantityFloat * katsayi.sto_birim4_katsayi;
        break;
      case birimListesi[0]: // SET birimi
      default:
        finalQuantity = quantityFloat; // Katsayı yok
        break;
    }

    return finalQuantity; // Hesaplanan miktarı döndürüyoruz
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
    
    return (sth_miktarFloat * sth_tutarPriceFloat).toFixed(2);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleAddProduct = async () => {
    const calculatedQuantity = handleMiktarChange(sth_miktar);
    if (validateQuantity(sth_miktar)) {
      const existingProduct = addedProducts.find(
        (product) => product.Stok_Kod === selectedProduct?.Stok_Kod
      );
      const newQuantity = parseFloat(sth_miktar.replace(',', '.')) || 0;
      const newTotalPrice = calculateTotal(); // Toplam tutar hesaplandı
      const newTotalMiktarPrice = (newQuantity * newTotalPrice).toFixed(2);
  
      try {
        // İlk API çağrısı - mevcut iskontoları hesaplamak için
        const apiUrl = `/Api/Iskonto/IskontoHesapla?tutar=${newTotalPrice}&isk1=${sth_iskonto1 || 0}&isk2=${sth_iskonto2 || 0}&isk3=${sth_iskonto3 || 0}&isk4=${sth_iskonto4 || 0}&isk5=${sth_iskonto5 || 0}&isk6=${sth_iskonto6 || 0}`;
        const response = await axiosLinkMain.get(apiUrl);
        const result = response.data;
        const { İsk1, İsk2, İsk3, İsk4, İsk5, İsk6 } = result; // İlk API'den dönen iskontolar
  
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

                  const updatedProducts = addedProducts.map((product) =>
                      product.Stok_Kod === selectedProduct?.Stok_Kod
                          ? {
                              ...product,
                              sth_miktar: updatedQuantity.toFixed(2),
                              sth_tutar:sth_tutar, // Tutarı güncelle
                              sth_iskonto1: updatedİsk1.toFixed(2),
                              sth_iskonto2: updatedİsk2.toFixed(2),
                              sth_iskonto3: updatedİsk3.toFixed(2),
                              sth_iskonto4: updatedİsk4.toFixed(2),
                              sth_iskonto5: updatedİsk5.toFixed(2),
                              sth_iskonto6: updatedİsk6.toFixed(2),
                              total: calculateTotal(),
                              modalId: 0,
                          }
                          : product
                  );

                  setAddedProducts(updatedProducts);

                  // State'leri sıfırlama
                  setCarpan();
                  resetFields();
              },
          },
              {
                text: 'Yeni Satır Ekle',
                onPress: () => {
                  setAddedProducts([
                    ...addedProducts,
                    {
                      id: `${selectedProduct?.Stok_Kod}-${Date.now()}`,
                      ...selectedProduct,
                      sth_miktar: calculatedQuantity,
                      sth_tutar: sth_tutar,
                      sth_birim_pntr: '1',
                      Birim_KDV: Birim_KDV,
                      sth_vergi_pntr: sth_vergi_pntr,
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
                  setAddedProducts([
                    ...addedProducts,
                    {
                      id: `${selectedProduct?.Stok_Kod}-${Date.now()}`,
                      ...selectedProduct,
                      sth_miktar: calculatedQuantity,
                      sth_tutar: sth_tutar,
                      sth_birim_pntr: '1',
                      Birim_KDV: Birim_KDV,
                      sth_vergi_pntr: sth_vergi_pntr,
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
          setAddedProducts([
            ...addedProducts,
            {
              id: `${selectedProduct?.Stok_Kod}-${Date.now()}`,
              ...selectedProduct,
              sth_miktar: calculatedQuantity,
              sth_tutar: sth_tutar,
              sth_birim_pntr: '1',
              Birim_KDV: Birim_KDV,
              sth_vergi_pntr: sth_vergi_pntr,
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
    setCarpan('');
    setModalVisible(false);
  };
  
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <ScrollView style={{backgroundColor: 'white'}}>
      <SafeAreaView style={MainStyles.modalContainerUrunDetay}>
        <View style={MainStyles.modalContentUrunDetay}>
          <Text style={MainStyles.modalTitle}>Ürün Detayı</Text>
          <Text style={MainStyles.modalStokAd}>{selectedProduct?.Stok_Kod} - <Text style={MainStyles.modalStokKodu}>{selectedProduct?.Stok_Ad}</Text></Text>
          
          <View style={MainStyles.modalBorder}></View>
          <View style={MainStyles.productModalContainer}>
            <View style={MainStyles.inputBirimGroup}>
              <Text style={MainStyles.inputtip}>Birim:</Text>
              <View style={MainStyles.productModalPickerContainer}>
              <Picker
                  selectedValue={sth_birim_pntr}
                  itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
                  onValueChange={(itemValue) => {
                    setSth_birim_pntr(itemValue);
                    // Miktar değiştiğinde katsayıyı göz önünde bulundur
                    handleMiktarChange(sth_miktar);
                  }}
                >
                  {birimListesi.map((birim, index) => (
                    <Picker.Item
                      itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10, fontSize: 12 }} 
                      key={index}
                      label={`${birim} (${index === 1 ? katsayi.sto_birim2_katsayi : index === 2 ? katsayi.sto_birim3_katsayi : katsayi.sto_birim4_katsayi})`}
                      value={birim}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={MainStyles.inputBirimGroup}>
            <Text style={MainStyles.inputtip}>Miktar:</Text>
            <TextInput
              style={MainStyles.productModalMiktarInput}
              placeholderTextColor={colors.placeholderTextColor}
              keyboardType="numeric"
              value={sth_miktar} // Kullanıcının girdiği değeri gösteriyoruz
              onChangeText={(value) => {
                // Karakter filtreleme (sadece rakamlar)
                const numericValue = value.replace(/[^0-9]/g, '');

                // İlk karakterin 0 olmasını engelleme
                if (numericValue === '' || numericValue === '0') {
                  setSth_miktar(''); // Eğer giriş 0 ise boş değer ayarlanır
                } else {
                  setSth_miktar(numericValue); // Sadece geçerli sayısal değer ayarlanır
                }
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

              </View>
              <View style={MainStyles.inputGroup}>
              <Text style={MainStyles.inputtip}>Tutar:</Text>
              <TextInput
              style={MainStyles.productModalMiktarInput}
              placeholderTextColor={colors.placeholderTextColor}
              editable={false}
              value={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateTotal())}
              keyboardType="numeric"  
            />

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
          {/* 
           <TouchableOpacity
            style={{ backgroundColor: colors.textInputBg, paddingVertical: 5, marginBottom: 10, borderRadius: 5 }}
            onPress={fetchStokDetayData} // sip_musteri_kod kaldırıldı
          >
            <Text style={{ color: colors.black, textAlign: 'center', fontSize: 11 }}>Stok Bilgi Detay</Text>
          </TouchableOpacity>
          */}

          <Modal
  visible={isStokDetayVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={closeModal}
>
  <View style={[MainStyles.modalBackground]}>
    <View style={MainStyles.modalCariDetayContent}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          {/* Stok Detay Verisi Modal */}
          {stokDetayData && stokDetayData.length > 0 ? (
            <View>
              <Text style={MainStyles.modalCariDetayTextTitle}>
                Depo Durum Detayı
              </Text>
              {stokDetayData.map((item, index) => (
                <View key={index} style={MainStyles.modalAlinanSiparisItem}>
                  <Text style={MainStyles.modalCariDetayText}>Depo No: {item.dep_no} -  Depo Adı: {item.dep_adi} - Depo Miktar {item.DepoMiktarı}</Text>
                </View>
              ))}
            </View>
          ) : (
            // Veri bulunamadı durumu
            <Text style={MainStyles.modalCariDetayText}>Veri bulunamadı.</Text>
          )}
        </>
      )}
      <TouchableOpacity onPress={closeModal} style={MainStyles.closeButton}>
        <Text style={MainStyles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


            <View style={MainStyles.modalInfoContainer}>
              <View style={MainStyles.modalInfoDoviz}>
                  <Text style={MainStyles.inputtip}>BekleyenSiparis : {faturaBilgileri.BekleyenSiparis}</Text>
                </View>
              <View style={MainStyles.modalInfoKdv}>
                  <Text style={MainStyles.inputtip}>StokVade : {faturaBilgileri.StokVade}</Text>
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
          
          {/* 
            <View style={MainStyles.checkboxContainer}>
              <CheckBox
                value={resetTax}
                onValueChange={setResetTax}
              />
              <Text>Vergi Sıfırla</Text>
            </View>
          */}
          <TouchableOpacity
            style={MainStyles.addButtonUrunDetay}
            onPress={handleAddProduct}
          >
            <Text style={MainStyles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{position :'absolute', marginTop: 20, }} onPress={handleClose}>
          <Left width={17} height={17}/>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default ProductModal;
