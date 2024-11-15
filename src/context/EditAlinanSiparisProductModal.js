import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axiosLinkMain from '../utils/axiosMain';
import axios from 'axios';
import { ProductContext } from '../context/ProductContext';
import { useAuthDefault } from '../components/DefaultUser';

const EditAlinanSiparisProductModal = ({ selectedProduct, modalVisible, setModalVisible, setAddedAlinanSiparisProducts }) => {
  const { alinanSiparis } = useContext(ProductContext);
  const { defaults } = useAuthDefault();
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
  const [isIskonto1Edit, setIsIskonto1Edit] = useState(false);
  const [isIskonto2Edit, setIsIskonto2Edit] = useState(false);
  const [isIskonto3Edit, setIsIskonto3Edit] = useState(false);
  const [isIskonto4Edit, setIsIskonto4Edit] = useState(false);
  const [isIskonto5Edit, setIsIskonto5Edit] = useState(false);
  const [isIskonto6Edit, setIsIskonto6Edit] = useState(false);
  const [birimListesi, setBirimListesi] = useState([]);
  const [sthBirimPntr, setSthBirimPntr] = useState('');
  const [sth_birim_pntr, setSth_birim_pntr] = useState('AD');
  const [katsayi, setKatsayi] = useState({});
  const [DovizIsmi, setDovizIsmi] = useState(null);
  const [Carpan, setCarpan] = useState('');
  const [KDV, setKDV] = useState('');

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

  useEffect(() => {
    if (modalVisible && selectedProduct) {
  
      if (birimListesi.length > 0) {
        setSth_birim_pntr(birimListesi[0]);
      }
    }
  }, [modalVisible, selectedProduct, birimListesi]);


  useEffect(() => {
    if (modalVisible && selectedProduct) {
      const fetchSatisFiyati = async () => {
        const cari = alinanSiparis?.sth_cari_kodu || alinanSiparis?.sip_musteri_kod || alinanSiparis?.cha_kod ;
        const stok = selectedProduct?.Stok_Kod;
        const somkod = alinanSiparis?.sth_stok_srm_merkezi || alinanSiparis?.sip_stok_sormerk || alinanSiparis?.cha_srmrkkodu ;
        const odpno = alinanSiparis?.sth_odeme_op || alinanSiparis?.sip_opno || alinanSiparis?.cha_vade;
        const apiUrl = `/Api/Stok/StokSatisFiyatı?cari=${cari}&stok=${stok}&somkod=${somkod}&odpno=${odpno}`;
  
        try {
          const response = await axiosLinkMain.get(apiUrl);
          const data = response.data;
  
          if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
  
            // KDV ve diğer bilgileri güncelle
            if (firstItem.Birim_KDV) {
              setVat(firstItem.Birim_KDV.toString());
            }
            if (firstItem.KDV) {
              setKDV(firstItem.KDV.toString());  
            }
            if (firstItem.Carpan !== undefined) {
              setCarpan(firstItem.Carpan.toString());
            } else {
              console.warn("Carpan değeri gelmedi.");
            }
            if (firstItem.DovizIsmi) {
              setDovizIsmi(firstItem.DovizIsmi.toString());  
            }
            
            // Birim listesini güncelle
            const newBirimListesi = [
              firstItem.sto_birim1_ad,
              firstItem.sto_birim2_ad,
              firstItem.sto_birim3_ad,
              firstItem.sto_birim4_ad
            ].filter(birim => birim && birim.trim() !== '');

            setBirimListesi(newBirimListesi);

            // Katsayıları güncelle
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
  }, [modalVisible, selectedProduct]);
  


// Miktarı doğrulama fonksiyonu
const validateQuantityEdit = (quantity) => {
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

const handleMiktarChangeEdit = (value) => {
  const quantityFloat = parseFloat(value.replace(',', '.')) || 0;
  
  if (validateQuantityEdit(value)) {
    let finalQuantity = quantityFloat;

    switch (sth_birim_pntr) {
      case birimListesi[1]: // KUT birimi
      finalQuantity = quantityFloat * katsayi.sto_birim2_katsayi;
        break;
      case birimListesi[2]: // KOL birimi
      finalQuantity = quantityFloat * katsayi.sto_birim3_katsayi;
        break;
      case birimListesi[3]: // Yeni birim
      finalQuantity = quantityFloat * katsayi.sto_birim4_katsayi;
        break;
      case birimListesi[0]: // AD birimi
      finalQuantity = quantityFloat; // AD biriminde çarpan yok
        break;
    }

    setQuantity(finalQuantity.toString());
    return finalQuantity; // Hesaplanan miktarı geri döndür
  } else {
    Alert.alert('Geçersiz Miktar', 'Lütfen geçerli bir miktar girin.');
    setQuantity(''); // Geçersiz miktar durumunda miktarı sıfırla
    return undefined; // Geçersiz durumda undefined döndür
  }
};

const calculateTotal = () => {

  let newmiktar = handleMiktarChangeEdit(quantity);
  let sth_miktarFloat = parseFloat(newmiktar) || 0;
  let sth_tutarPriceFloat = parseFloat(selectedProduct.sth_tutar.replace(',', '.')) || 0;
  
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


const calculateTotalWithoutDiscount = () => {
  const newQuantity = parseFloat(quantity) || 0;
  const newPrice = parseFloat(price) || 0;
  return (newQuantity * newPrice).toFixed(2); // Sadece miktar ve fiyatı çarp
};


const handleUpdate = async () => {
  if (!selectedProduct || !selectedProduct.id) { // ID kontrolü
    return;
  }

  // Satış fiyatı güncel değilse işlemi durdur
  if (!price || isNaN(price)) {
    console.error('Geçerli bir satış fiyatı girin');
    return;
  }

  // Miktarın geçerli olup olmadığını kontrol ediyoruz
  if (!validateQuantityEdit(quantity)) {
    return;
  }

  const calculatedQuantity = handleMiktarChangeEdit(quantity);

  if (calculatedQuantity === undefined) {
    return; // Eğer geçerli miktar yoksa işlemi durdur
  }

  // Yeni toplam fiyatı hesapla (güncel price değerini kullan)
  const newTotalPrice = calculateTotal();
  console.log('Hesaplanan yeni toplam fiyat:', newTotalPrice);
  console.log('Güncel fiyat:', price);

  // İskonto hesaplama API çağrısı
  const apiUrl = `/Api/Iskonto/IskontoHesapla?tutar=${calculatedQuantity * price}&isk1=${sthIskonto1 || 0}&isk2=${sthIskonto2 || 0}&isk3=${sthIskonto3 || 0}&isk4=${sthIskonto4 || 0}&isk5=${sthIskonto5 || 0}&isk6=${sthIskonto6 || 0}`;
  console.log(apiUrl);
  try {
    const response = await axiosLinkMain.get(apiUrl);

    const result = response.data;
    const { İsk1, İsk2, İsk3, İsk4, İsk5, İsk6 } = result; // API'den dönen iskonto değerleri
    console.log(İsk1, İsk2, İsk3);
    // Ürünleri güncelle
    setAddedAlinanSiparisProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === selectedProduct.id  // Ürünleri benzersiz id'ye göre eşleştiriyoruz
          ? {
              ...product, // Güncellenmiş ürün bilgilerini al
              sth_miktar: calculatedQuantity,
              sth_tutar: price,  // Güncellenmiş satış fiyatını kullanıyoruz
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
              total: calculatedQuantity * price,  // Hesaplanan yeni total değeri kullanıyoruz
            }
          : product  // Diğer ürünler aynı kalır
      )
    );
    
    setModalVisible(false); // Modalı kapat
  } catch (error) {
    console.error('İskontolar hesaplanırken bir hata oluştu:', error.message);
  }
};



  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <Modal visible={modalVisible} transparent={true} animationType="slide"  onRequestClose={handleClose}>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <SafeAreaView style={MainStyles.modalContainerUrunDetay}>
          <View style={MainStyles.modalContentUrunDetay}>
            <Text style={MainStyles.modalTitle}>Ürün Detayı</Text>
            <Text style={MainStyles.modalStokKodu}>Stok Kodu: {updatedProduct?.Stok_Kod}</Text>
            <Text style={MainStyles.modalStokKodu}>Stok Adı: {updatedProduct?.Stok_Ad}</Text>
            <View style={MainStyles.modalBorder}></View>
            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputBirimGroup}>
                <Text style={MainStyles.productModalText}>Birim:</Text>
                <View style={MainStyles.productModalPickerContainer}>
                <Picker
                    selectedValue={sth_birim_pntr}
                    itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
                    onValueChange={(itemValue) => {
                      setSth_birim_pntr(itemValue);
                      handleMiktarChangeEdit(quantity);
                    }}
                  >
                    {birimListesi.map((birim, index) => (
                      <Picker.Item
                        key={index}
                        style={MainStyles.productModalPicker}
                        label={`${birim} (${index === 1 ? katsayi.sto_birim2_katsayi : index === 2 ? katsayi.sto_birim3_katsayi : katsayi.sto_birim4_katsayi})`}
                        value={birim}
                      />
                    ))}
                  </Picker>

                </View>
              </View>
              <View style={MainStyles.inputBirimGroup}>
                <Text style={MainStyles.productModalText}>Miktar:</Text>
                <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={quantity} // Kullanıcının girdiği değeri gösteriyoruz
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
            </View>
            <View style={MainStyles.inputRow}>
              <View style={MainStyles.inputGroup}>
                <Text>Satış Fiyatı:</Text>
                <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={price}
                  editable={isEditable}
                  onChangeText={(value) => setPrice(value)}
                />
              </View>
              <View style={MainStyles.inputGroup}>
                <Text>Tutar:</Text>
                <TextInput
                  style={MainStyles.productModalMiktarInput}
                  placeholderTextColor="#999"
                  editable={false}
                  value={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateTotalWithoutDiscount())}
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
             <View style={MainStyles.modalInfoContainer}>
              <View style={MainStyles.modalInfoDoviz}>
                  <Text>Döviz : {DovizIsmi}</Text>
                </View>
                <View style={MainStyles.modalInfoKdv}>
                  <Text style={MainStyles.kdvText}>Kdv : {KDV}</Text>
                </View>
              </View>
              <View style={MainStyles.modalInfoContainer}>
                <View style={MainStyles.modalInfoDoviz}>
                  <Text>Depo :</Text>
                </View>
                <View style={MainStyles.modalInfoKdv}>
                  <Text style={MainStyles.kdvText}>Çarpan : {Carpan}</Text>
                </View>
            </View>

            <View style={MainStyles.productModalContainer}>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 1 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto1}
                  editable={isIskonto1Edit} 
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto1}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 2 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto2}
                  editable={isIskonto2Edit} 
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto2}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 3 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto3}
                  editable={isIskonto3Edit} 
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto3}
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
                  editable={isIskonto4Edit} 
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto4}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 5 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto5}
                  editable={isIskonto5Edit} 
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto5}
                />
              </View>
              <View style={MainStyles.inputIskontoGroup}>
                <Text style={MainStyles.productModalText}>İskonto 6 (%):</Text>
                <TextInput
                  style={MainStyles.productModalIskontoInput}
                  keyboardType="numeric"
                  value={sthIskonto6}
                  editable={isIskonto6Edit} 
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={setSthIskonto6}
                />
              </View>
            </View>
              <TouchableOpacity style={MainStyles.addButton} onPress={handleUpdate}>
                <Text style={MainStyles.addButtonText}>Güncelle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={MainStyles.closeProductModalButton} onPress={handleClose}>
                <Text style={MainStyles.addButtonText}>Kapat</Text>
              </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default EditAlinanSiparisProductModal;
