import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axiosLinkMain from '../utils/axiosMain';
import axios from 'axios';
import { ProductContext } from '../context/ProductContext';

const EditSatisFaturasiProductModal = ({ selectedProduct, modalVisible, setModalVisible, setAddedProducts }) => {
  const { faturaBilgileri } = useContext(ProductContext);
  const [updatedProduct, setUpdatedProduct] = useState(selectedProduct || {});
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [sthIskonto1, setSthIskonto1] = useState('');
  const [sthIskonto2, setSthIskonto2] = useState('');
  const [sthIskonto3, setSthIskonto3] = useState('');
  const [sthIskonto4, setSthIskonto4] = useState('');
  const [sthIskonto5, setSthIskonto5] = useState('');
  const [sthIskonto6, setSthIskonto6] = useState('');
  const [birimFiyat, setbirimFiyat] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [vat, setVat] = useState(0);
  const [isEditable, setIsEditable] = useState(true);
  const [isIskontoEditable, setIsIskontoEditable] = useState(true);
  const [birimListesi, setBirimListesi] = useState([]);
  const [sthBirimPntr, setSthBirimPntr] = useState('');
  const [katsayi, setKatsayi] = useState({});

  useEffect(() => {
    if (selectedProduct) {
      setUpdatedProduct(selectedProduct);
      setQuantity(String(selectedProduct.sth_miktar || ''));
      setPrice(String(selectedProduct.sth_tutar || ''));
      setbirimFiyat(String(selectedProduct.birimFiyat || ''));
      setSthIskonto1(String(selectedProduct.sth_isk1 || ''));
      setSthIskonto2(String(selectedProduct.sth_isk2 || ''));
      setSthIskonto3(String(selectedProduct.sth_isk3 || ''));
      setSthIskonto4(String(selectedProduct.sth_isk4 || ''));
      setSthIskonto5(String(selectedProduct.sth_isk5 || ''));
      setSthIskonto6(String(selectedProduct.sth_isk6 || ''));
      setCurrency(selectedProduct.DovizIsmi || 'TRY');
      setVat(selectedProduct.KDV || 0);
    }
    
  }, [selectedProduct]);


  // Miktarı doğrulama fonksiyonu
const validateQuantityEdit = (quantity) => {
  const quantityFloat = parseFloat(quantity.replace(',', '.')) || 0;

  let minQuantity = 1; // Varsayılan minimum miktar
  let unitMultiplier = 1; // Varsayılan birim çarpanı

  // Seçilen birime göre katsayıyı belirliyoruz
  switch (sthBirimPntr) {
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

  if (sthBirimPntr !== birimListesi[0] && quantityFloat % unitMultiplier !== 0) {
    Alert.alert(
      'Geçersiz Miktar',
      `Miktar, ${unitMultiplier} ve katları olarak belirtilmelidir.`,
      [{ text: 'Tamam' }]
    );
    return false;
  }

  return true;
};

  
  

const handleMiktarChangeEdit = (value) => {
  const isValid = validateQuantityEdit(value);

  if (isValid) {
    const quantityFloat = parseFloat(value.replace(',', '.')) || 0;
    let finalQuantity = quantityFloat;

    switch (sthBirimPntr) {
      case birimListesi[1]: // KUT birimi
      finalQuantity = quantityFloat * katsayi.sto_birim2_katsayi;
      break;
    case birimListesi[2]: // KOL birimi
      finalQuantity = quantityFloat * katsayi.sto_birim3_katsayi;
      break;
    case birimListesi[3]: // Yeni eklenen birim, sto_birim4_ad
      finalQuantity = quantityFloat * katsayi.sto_birim4_katsayi;
      break;
    case birimListesi[0]: // AD birimi
      finalQuantity = quantityFloat; // AD biriminde çarpan yok
      break;
    }

    setQuantity(finalQuantity.toString());
  } else {
    setQuantity(''); // Geçersiz miktar durumunda miktarı sıfırla
  }
};


 const handleUpdate = async () => {
  if (!selectedProduct || !selectedProduct.id) { // ID kontrolü
    return;
  }

   // Miktarın geçerli olup olmadığını kontrol ediyoruz
   if (!validateQuantityEdit(quantity)) {
    return;
  }

  // Yeni toplam fiyatı hesapla
  const newTotalPrice = calculateTotal(); 

  // İskonto hesaplama API çağrısı
  const apiUrl = `/Api/Iskonto/IskontoHesapla?tutar=${newTotalPrice}&isk1=${sthIskonto1 || 0}&isk2=${sthIskonto2 || 0}&isk3=${sthIskonto3 || 0}&isk4=${sthIskonto4 || 0}&isk5=${sthIskonto5 || 0}&isk6=${sthIskonto6 || 0}`;
  try {
    const response = await axiosLinkMain.get(apiUrl);

    const result = response.data;
    const { İsk1, İsk2, İsk3, İsk4, İsk5, İsk6 } = result; // API'den dönen iskonto değerleri

    // Ürünleri güncelle
    setAddedProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === selectedProduct.id  // Ürünleri benzersiz id'ye göre eşleştiriyoruz
          ? {
              ...product, // Güncellenmiş ürün bilgilerini al
              sth_miktar: quantity,
              sth_tutar: price,
              birimFiyat: price,
              aciklama: updatedProduct.aciklama,
              sth_iskonto1: İsk1.toFixed(2), // API'den gelen iskonto değerleri kullanılıyor
              sth_iskonto2: İsk2.toFixed(2),
              sth_iskonto3: İsk3.toFixed(2),
              sth_iskonto4: İsk4.toFixed(2),
              sth_iskonto5: İsk5.toFixed(2),
              sth_iskonto6: İsk6.toFixed(2),
              sth_isk1: sthIskonto1,
              sth_isk2: sthIskonto2,
              sth_isk3: sthIskonto3,
              sth_isk4: sthIskonto4,
              sth_isk5: sthIskonto5,
              sth_isk6: sthIskonto6,
              total: calculateTotal(),
            }
          : product  // Diğer ürünler aynı kalır
      )
    );

    setModalVisible(false); // Modalı kapat
  } catch (error) {
    console.error('İskontolar hesaplanırken bir hata oluştu:', error.message);
  }
};

const calculateTotal = () => {
  // Get quantity and price values
  const newQuantity = parseFloat(quantity) || 0;
  const newPrice = parseFloat(price) || 0;

  // Calculate total as the product of quantity and price
  const total = newQuantity * newPrice;

  // Return total with two decimal places
  return total.toFixed(2);
};


const calculateTotalWithoutDiscount = () => {
  const newQuantity = parseFloat(quantity) || 0;
  const newPrice = parseFloat(price) || 0;
  return (newQuantity * newPrice).toFixed(2); // Sadece miktar ve fiyatı çarp
};

  const handleClose = () => {
    setModalVisible(false);
  };

  

  return (
    <Modal visible={modalVisible} transparent={true} animationType="slide"  onRequestClose={handleClose}>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <SafeAreaView style={MainStyles.modalContainer}>
          <View style={MainStyles.modalContent}>
            <Text style={MainStyles.modalTitle}>Satış Faturası Detayı</Text>
            <Text style={MainStyles.modalStokKodu}>Stok Kodu: {updatedProduct?.Stok_Kod}</Text>
            <Text style={MainStyles.modalStokKodu}>Stok Adı: {updatedProduct?.Stok_Ad}</Text>
            <View style={MainStyles.modalBorder}></View>
            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputBirimGroup}>
                <Text style={MainStyles.productModalText}>Miktar:</Text>
                <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={(value) => {
                    // Karakter filtreleme (sadece rakamlar)
                    const numericValue = value.replace(/[^0-9]/g, '');
    
                    // İlk karakterin 0 olmasını engelleme
                    if (numericValue === '' || numericValue === '0') {
                      setQuantity(''); // Eğer giriş 0 ise boş değer ayarlanır
                    } else {
                      setQuantity(numericValue); // Sadece geçerli sayısal değer ayarlanır
                    }
                  }}
                />


              </View>
              <View style={MainStyles.inputGroup}>
                <Text>Satış Fiyatı:</Text>
                <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={price}
                  editable={isEditable}
                  onChangeText={(value) => {
                    // Virgülü noktaya çevir
                    const formattedValue = value.replace(',', '.');
  
                    // Sadece rakamlar ve . (nokta) karakteri kabul edilsin
                    const validValue = formattedValue.replace(/[^0-9.]/g, '');
  
                    // Eğer birden fazla . (nokta) varsa, sonrasını kabul etme
                    const finalValue = validValue.split('.').length > 2 ? validValue.slice(0, -1) : validValue;
  
                    setPrice(finalValue);
                  }}
                />
              </View>
            </View>
            <View style={MainStyles.inputRow}>
             
              <View style={MainStyles.inputGroupTutar}>
                <Text>Tutar:</Text>
                <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor="#999"
                  editable={false}
                  keyboardType="numeric"  
                  value={calculateTotalWithoutDiscount()}
                />
              </View>
            </View>
            <Text>Açıklama:</Text>
            <TextInput
              style={MainStyles.productModalMiktarInput}
              value={updatedProduct.aciklama}
              placeholderTextColor="#999"
              onChangeText={(text) => setUpdatedProduct({ ...updatedProduct, aciklama: text })}
              numberOfLines={1}
            />
            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 1 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto1}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto1}
                  editable={isIskontoEditable}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 2 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto2}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto2}
                  editable={isIskontoEditable}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 3 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto3}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto3}
                  editable={isIskontoEditable}
                />
              </View>
            </View>
            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 4 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto4}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto4}
                  editable={isIskontoEditable}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 5 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto5}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto5}
                  editable={isIskontoEditable}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 6 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto6}
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto6}
                  editable={isIskontoEditable}
                />
              </View>
            </View>
              <TouchableOpacity style={MainStyles.addButton} onPress={handleUpdate}>
                <Text style={MainStyles.addButtonText}>Güncelle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={MainStyles.onizlemeButton} onPress={handleClose}>
                <Text style={MainStyles.addButtonText}>Kapat</Text>
              </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default EditSatisFaturasiProductModal;
