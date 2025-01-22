import React, { useContext, useEffect, useState } from 'react';
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
import CustomHeader from '../components/CustomHeader';

const SatinAlmaTalepFisiProductModal = ({
  selectedProduct,
  modalVisible,
  setModalVisible,
  setAddedProducts,
  modalId,
}) => {
  const { defaults } = useAuthDefault();
  const { addedProducts, faturaBilgileri } = useContext(ProductContext);
  const [sth_miktar, setSth_miktar] = useState('1');
  const [sth_tutar, setSth_tutar] = useState(''); 
  const [birimFiyat, setBirimFiyat] = useState(''); 
  const [sth_birim_pntr, setSth_birim_pntr] = useState('AD');
  const [resetTax, setResetTax] = useState(false);
  const [aciklama, setAciklama] = useState('');
  const [stokDetayData, setStokDetayData] = useState(''); 
  const [birimListesi, setBirimListesi] = useState([]);
  const [katsayi, setKatsayi] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [DovizIsmi, setDovizIsmi] = useState(null);
  const [Birim_KDV, setBirim_KDV] = useState('');
  const [KDV, setKDV] = useState('');
  const [Carpan, setCarpan] = useState('');
  const [sth_vergi_pntr, setSth_vergi_pntr] = useState('');
  const [toplam_vergi, setToplam_vergi] = useState();
  const [HareketTipi, setHareketTipi] = useState();
  const [isStokDetayVisible, setIsStokDetayVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [sth_iskonto1, setSth_iskonto1] = useState('0'); 
  const [sth_iskonto2, setSth_iskonto2] = useState('0'); 
  const [sth_iskonto3, setSth_iskonto3] = useState('0'); 
  const [sth_iskonto4, setSth_iskonto4] = useState('0'); 
  const [sth_iskonto5, setSth_iskonto5] = useState('0'); 
  const [sth_iskonto6, setSth_iskonto6] = useState('0'); 

  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_IrsaliyeFiyatiDegistirebilir} = defaults[0];
      setIsEditable(IQ_IrsaliyeFiyatiDegistirebilir === 1);
    }
  }, [defaults]);

  useEffect(() => {
    if (modalVisible && selectedProduct) {
      if (birimListesi.length > 0) {
        setSth_birim_pntr(birimListesi[0]);
      }
    }
  }, [modalVisible, selectedProduct, birimListesi]);


  
  const closeModal = () => {
    setIsStokDetayVisible(false);
  };


  useEffect(() => {
    if (modalVisible && selectedProduct && modalId < 1 ) {
      const fetchSatisFiyati = async () => {
        const stok = selectedProduct?.Stok_Kod ;
        const apiUrl = `/Api/Stok/StokSatisFiyatiSatinAlma?stok=${stok}`;
        console.log(apiUrl);
        
        try {
          const response = await axiosLinkMain.get(apiUrl);
          const data = response.data;
  
          if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
  
  
            if (firstItem.fiyat) {
              setSth_tutar(firstItem.fiyat.toString());
            }
          
            if (firstItem.fiyat) {
              setSth_tutar(firstItem.fiyat.toString());
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

          } else {
            console.error("API yanıtı beklenen formatta değil:", data);
          }
        } catch (error) {
          console.error("API çağrısında hata oluştu:", error);
        }
      };
  
      fetchSatisFiyati();
    }
  }, [modalVisible, selectedProduct, modalId]);

// Miktar geçerliliğini kontrol eden fonksiyon
const validateQuantity = (quantity) => {
  if (modalId === 1 || modalId === 2 || modalId === 3) {
    // Eğer modalId 1 veya 2 ise doğrulama yapma
    return true;
  }

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

  if (Carpan > 0) {
    const adjustedQuantity = quantityFloat * unitMultiplier;
    if (adjustedQuantity % Carpan !== 0) {
      Alert.alert(
        'Geçersiz Miktar',
        `Miktar  ve katları olmalıdır.`,
        [{ text: 'Tamam' }]
      );
      return false;
    }
  } else {
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
        (product) =>
          product.Stok_Kod === selectedProduct?.Stok_Kod && product.modalId === modalId // Stok kodu ve modalId kontrolü
      );
      const newQuantity = parseFloat(sth_miktar.replace(',', '.')) || 0;
      const newTotalPrice = calculateTotal(); // Toplam tutar hesaplandı
      const newTotalMiktarPrice = (newQuantity * newTotalPrice).toFixed(2);
  
      if (existingProduct) {
        // Ürün zaten eklendiğinde kullanıcıya iki seçenek sunulur
        Alert.alert('Ürün Zaten Ekli', 'Bu ürün zaten eklenmiş. Miktarı güncellemek ister misiniz?', [
          {
            text: 'Miktarı Güncelle',
            onPress: () => {
              const updatedQuantity = parseFloat(existingProduct.sth_miktar.replace(',', '.')) + newQuantity;
              const updatedProducts = addedProducts.map((product) =>
                product.Stok_Kod === selectedProduct?.Stok_Kod && product.modalId === modalId
                  ? {
                      ...product,
                      sth_miktar: updatedQuantity.toFixed(2),
                      sth_tutar: (updatedQuantity * parseFloat(product.birimFiyat || 0)).toFixed(2),
                    }
                  : product
              );
              setAddedProducts(updatedProducts);
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
                  birimFiyat: sth_tutar,
                  toplam_vergi: 0,
                  modalId: modalId,
                  total: (newQuantity * parseFloat(sth_tutar || 0)).toFixed(2),
                },
              ]);
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
        // Yeni ürün ekleme
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
            birimFiyat: sth_tutar,
            toplam_vergi: 0,
            modalId: modalId,
            total: (newQuantity * parseFloat(sth_tutar || 0)).toFixed(2),
          },
        ]);
        setCarpan();
        resetFields();
      }
    }
  };
  
  
  const resetFields = () => {
    setSth_miktar('1');
    setAciklama('');
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
        style={[MainStyles.flex1]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // iOS için varsayılan offset
      >
      <View style={MainStyles.modalContainerDetail}>
      <CustomHeader
        title="Ürün Detayı"
        onClose={handleClose}
      />
       <View style={MainStyles.modalContainerProduct}>
        <View style={MainStyles.modalContainerProductName}>
          <Text style={MainStyles.modalStokAd}>Stok Kod:{selectedProduct?.Stok_Kod} </Text>
          <Text style={MainStyles.modalStokAd}>Stok Adı:{selectedProduct?.Stok_Ad} </Text>
        </View>

        <View style={MainStyles.productModalContainer}>
        {modalId < 1 ? ( // "Birim" ve Picker alanını kontrol eder
    <View style={MainStyles.inputBirimGroup}>
      <Text style={MainStyles.inputtip}>Birim:</Text>
      <View style={MainStyles.productModalPickerContainer}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
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
  ) : null}

            <View style={modalId < 1  ? MainStyles.inputBirimGroup : MainStyles.inputBirimOzelGroup}>
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

          {/* 
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
          */}
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
          {/* 
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
          */}
          {/* 
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
          */}
          {/* 
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
         
        </View>
        </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SatinAlmaTalepFisiProductModal;
