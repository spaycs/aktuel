import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { MainStyles } from '../res/style/MainStyles';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../res/colors';
import { useAuthDefault } from '../components/DefaultUser';
import { ProductContext } from '../context/ProductContext';
import axiosLinkMain from '../utils/axiosMain';
import axios from 'axios';

const SatisFaturasiProductModal = ({
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
  const [sth_iskonto1, setSth_iskonto1] = useState('0'); 
  const [sth_iskonto2, setSth_iskonto2] = useState('0'); 
  const [sth_iskonto3, setSth_iskonto3] = useState('0'); 
  const [sth_iskonto4, setSth_iskonto4] = useState('0'); 
  const [sth_iskonto5, setSth_iskonto5] = useState('0'); 
  const [sth_iskonto6, setSth_iskonto6] = useState('0'); 
  const [sth_isk1, setSth_isk1] = useState(''); 
  const [sth_isk2, setSth_isk2] = useState(''); 
  const [sth_isk3, setSth_isk3] = useState(''); 
  const [sth_isk4, setSth_isk4] = useState(''); 
  const [sth_isk5, setSth_isk5] = useState(''); 
  const [sth_isk6, setSth_isk6] = useState(''); 
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
  const [sth_vergi_pntr, setSth_vergi_pntr] = useState(selectedProduct?.sth_vergi_pntr || '');
  

  useEffect(() => {
    if (defaults && defaults[0]) {
      const { IQ_SatisFaturaSeriNoDegistirebilir, IQ_FaturaIskontosu1Degistirebilir, IQ_FaturaIskontosu2Degistirebilir, IQ_FaturaIskontosu3Degistirebilir, IQ_FaturaIskontosu4Degistirebilir, IQ_FaturaIskontosu5Degistirebilir, IQ_FaturaIskontosu6Degistirebilir } = defaults[0];
  
      setIsEditable(IQ_SatisFaturaSeriNoDegistirebilir === 1);
      setIsIskonto1Edit(IQ_FaturaIskontosu1Degistirebilir === 1);
      setIsIskonto2Edit(IQ_FaturaIskontosu2Degistirebilir === 1);
      setIsIskonto3Edit(IQ_FaturaIskontosu3Degistirebilir === 1);
      setIsIskonto4Edit(IQ_FaturaIskontosu4Degistirebilir === 1);
      setIsIskonto5Edit(IQ_FaturaIskontosu5Degistirebilir === 1);
      setIsIskonto6Edit(IQ_FaturaIskontosu6Degistirebilir === 1);
    }
  }, [defaults]);


  const calculateTotal = () => {
    let sth_miktarFloat = parseFloat(sth_miktar.replace(',', '.')) || 0;
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

  const validateQuantity = (quantity) => {
    const quantityFloat = parseFloat(quantity.replace(',', '.')) || 0;
  
    let minQuantity = 1; // Varsayılan minimum miktar
    let unitMultiplier = 1; // Varsayılan birim çarpanı
  
    switch (sth_birim_pntr) {
      case 'KUT':
        unitMultiplier = katsayi.sto_birim2_katsayi || 1;
        minQuantity = unitMultiplier;
        break;
      case 'KOL':
        unitMultiplier = katsayi.sto_birim3_katsayi || 1;
        minQuantity = unitMultiplier;
        break;
      case 'AD':
        unitMultiplier = katsayi.sto_birim4_katsayi || 1; // Burada unitMultiplier’ı 1 yapmanız gerekebilir, çünkü AD biriminde çarpan kullanılmaz.
        minQuantity = 1; // AD biriminde minimum miktar 1'dir
        break;
      default:
        Alert.alert(
          'Geçersiz Birim',
          'Birim geçersiz veya desteklenmiyor.',
          [{ text: 'Tamam' }]
        );
        return false;
    }
  
    if (quantityFloat < minQuantity) {
      Alert.alert(
        'Geçersiz Miktar',
        `Bu üründen minimum ${minQuantity} adet eklemeniz gerekiyor.`,
        [{ text: 'Tamam' }]
      );
      return false;
    }
  
    // 'AD' birimi dışında kalan durumlar için unitMultiplier ile kontrol yapılıyor
    if (sth_birim_pntr !== 'AD' && quantityFloat % unitMultiplier !== 0) {
      Alert.alert(
        'Geçersiz Miktar',
        `Miktar, ${unitMultiplier} ve katları olarak belirtilmelidir.`,
        [{ text: 'Tamam' }]
      );
      return false;
    }
  
    return true;
  };

  const handleMiktarChange = (value) => {
    const isValid = validateQuantity(value);
  
    if (isValid) {
      const quantityFloat = parseFloat(value.replace(',', '.')) || 0;
      let finalQuantity = quantityFloat;
  
      switch (sth_birim_pntr) {
        case 'KUT':
          finalQuantity = quantityFloat * katsayi.sto_birim2_katsayi;
          break;
        case 'KOL':
          finalQuantity = quantityFloat * katsayi.sto_birim3_katsayi;
          break;
        case 'AD':
          finalQuantity = quantityFloat; 
          break;
      }
  
      setSth_miktar(finalQuantity.toString());
    } else {
      setSth_miktar(''); // Geçersiz miktar durumunda miktarı sıfırla
    }
  };

  const handleAddProduct = async () => {
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
        const { İsk1, İsk2, İsk3, İsk4, İsk5, İsk6 } = response.data;
  
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
                  const updatedQuantity = parseFloat(existingProduct.sth_miktar.replace(',', '.')) + newQuantity;
                  const updatedTotalPrice = (updatedQuantity * newUnitPrice).toFixed(2);
  
                  const newApiUrl = `/Api/Iskonto/IskontoHesapla?tutar=${updatedTotalPrice}&isk1=${sth_iskonto1 || 0}&isk2=${sth_iskonto2 || 0}&isk3=${sth_iskonto3 || 0}&isk4=${sth_iskonto4 || 0}&isk5=${sth_iskonto5 || 0}&isk6=${sth_iskonto6 || 0}`;
                const newResponse = await axiosLinkMain.get(newApiUrl);
                const {
                  İsk1: updatedİsk1,
                  İsk2: updatedİsk2,
                  İsk3: updatedİsk3,
                  İsk4: updatedİsk4,
                  İsk5: updatedİsk5,
                  İsk6: updatedİsk6,
                } = newResponse.data;
  
                const updatedProducts = addedProducts.map((product) =>
                  product.Stok_Kod === selectedProduct?.Stok_Kod
                    ? {
                        ...product,
                        sth_miktar: updatedQuantity.toFixed(2),
                        sth_tutar: updatedTotalPrice,
                        sth_iskonto1: updatedİsk1.toFixed(2),
                        sth_iskonto2: updatedİsk2.toFixed(2),
                        sth_iskonto3: updatedİsk3.toFixed(2),
                        sth_iskonto4: updatedİsk4.toFixed(2),
                        sth_iskonto5: updatedİsk5.toFixed(2),
                        sth_iskonto6: updatedİsk6.toFixed(2),
                        sth_isk1: sth_iskonto1,
                        sth_isk2: sth_iskonto2,
                        sth_isk3: sth_iskonto3,
                        sth_isk4: sth_iskonto4,
                        sth_isk5: sth_iskonto5,
                        sth_isk6: sth_iskonto6,
                        total: calculateTotal(),
                        modalId: 0,
                      }
                    : product
                );
                setAddedProducts(updatedProducts);

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
                      sth_miktar: sth_miktar,
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
                      sth_miktar: sth_miktar,
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
              sth_miktar: sth_miktar,
              sth_tutar: sth_tutar,
              sth_birim_pntr: '1',
              Birim_KDV: Birim_KDV,
              sth_vergi_pntr: sth_vergi_pntr,
              resetTax,
              aciklama,
              birimFiyat : sth_tutar,
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
              modalId: modalId,
            },
          ]);
          // State'leri sıfırlama
          console.log('sth_vergi_pntr:', sth_vergi_pntr);
          resetFields();
        }
      } catch (error) {
        console.error('API çağrısı sırasında bir hata oluştu:', error);
      }
    }
  };
  
  
  const resetFields = () => {
    setSth_miktar('1');
    setSth_tutar('0');
    setSth_iskonto1('0');
    setSth_iskonto2('0');
    setSth_iskonto3('0');
    setSth_iskonto4('0');
    setSth_iskonto5('0');
    setSth_iskonto6('0');
    setAciklama('');
    setModalVisible(false);
    setSth_vergi_pntr(selectedProduct?.sth_vergi_pntr || '');
  };
  

  
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <ScrollView style={{backgroundColor: 'white'}}>
      <SafeAreaView style={MainStyles.modalContainer}>
        <View style={MainStyles.modalContent}>
          <Text style={MainStyles.modalTitle}>Satış Faturası Detayı</Text>
          <Text style={MainStyles.modalStokKodu}>Stok Kodu: {selectedProduct?.Stok_Kod}</Text>
          <Text style={MainStyles.modalStokKodu}>Stok Adı: {selectedProduct?.Stok_Ad}</Text>
          <View style={MainStyles.modalBorder}></View>
          <View style={MainStyles.productModalContainer}>
            <View style={MainStyles.inputBirimGroup}>
              <Text style={MainStyles.productModalText}>Miktar:</Text>
              <TextInput
                style={MainStyles.productModalMiktarInput} 
                placeholderTextColor={colors.placeholderTextColor}
                keyboardType="numeric"
                value={sth_miktar}
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
            <View style={MainStyles.inputGroup}>
              <Text>Birim Fiyatı:</Text>
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
              
          </View>
          <View style={MainStyles.inputRow}>
            <View style={MainStyles.inputGroupTutar}>
              <Text>Tutar:</Text>
              <TextInput
                style={MainStyles.productModalMiktarInput}
                placeholderTextColor={colors.placeholderTextColor}
                editable={false}
                value={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateTotal())}
                keyboardType="numeric"  
              />
            </View>
          </View>
          <Text>Açıklama:</Text>
          <TextInput
            style={MainStyles.productModalMiktarInput}
            value={aciklama}
            placeholderTextColor={colors.placeholderTextColor}
            onChangeText={setAciklama}
            numberOfLines={1}
          />

<View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 1 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto1}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto1}
                  editable={isIskonto1Edit} 
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 2 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto2}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto2}
                  editable={isIskonto2Edit}
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 3 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto3}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto3}
                  editable={isIskonto3Edit}
                />
              </View>
            </View>
          
            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 4 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto4}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto4}
                  editable={isIskonto4Edit}
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 5 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto5}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto5}
                  editable={isIskonto5Edit}
                />
              </View>
          
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 6 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sth_iskonto6}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSth_iskonto6}
                  editable={isIskonto6Edit}
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
            style={MainStyles.addButton}
            onPress={handleAddProduct}
          >
            <Text style={MainStyles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.closeOnizlemeButton}
            onPress={handleClose}
          >
            <Text style={MainStyles.addButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default SatisFaturasiProductModal;
