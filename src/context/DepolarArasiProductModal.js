import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { MainStyles } from '../res/style/MainStyles';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../res/colors';
import { useAuthDefault } from '../components/DefaultUser';
import { ProductContext } from '../context/ProductContext';
import axiosLinkMain from '../utils/axiosMain';
import axios from 'axios';

const DepolarArasiProductModal = ({
  selectedProduct,
  modalVisible,
  setModalVisible,
  setAddedProducts
}) => {
  const { defaults } = useAuthDefault();
  const { addedProducts, faturaBilgileri } = useContext(ProductContext);
  const [sth_miktar, setSth_miktar] = useState('1');
  const [aciklama, setAciklama] = useState('');
  const [sth_listefiyati, setSth_listefiyati] = useState(selectedProduct?.Liste_Fiyatı || ''); 
  const [sth_vergi, setSth_vergi] = useState(selectedProduct?.sth_vergi || ''); 
 
  const handleAddProduct = async () => {
    if (sth_miktar) {
      try {
        // Mevcut ürün listesinde, eklenmek istenen ürünün stok kodunu kontrol et
        const existingProductIndex = addedProducts.findIndex(
          (product) => product.Stok_Kod === selectedProduct?.Stok_Kod
        );
  
        if (existingProductIndex !== -1) {
          // Ürün zaten mevcutsa, kullanıcıya miktarı arttırmak isteyip istemediğini sor
          Alert.alert(
            "Ürün Zaten Mevcut",
            "Bu ürün zaten mevcut. Miktarı arttırmak ister misiniz?",
            [
              {
                text: "Evet",
                onPress: () => {
                  // Kullanıcı "Evet" derse, miktarı arttır
                  const updatedProducts = [...addedProducts];
                  const existingProduct = updatedProducts[existingProductIndex];
                  const newQuantity = (
                    parseFloat(existingProduct.sth_miktar) + parseFloat(sth_miktar)
                  ).toFixed(2); // Yeni miktar hesapla
                  updatedProducts[existingProductIndex] = {
                    ...existingProduct,
                    sth_miktar: newQuantity,
                    sth_listefiyati: sth_listefiyati // Fiyatı güncelle (isteğe bağlı)
                  };
                  setAddedProducts(updatedProducts);
                  resetFields(); // Form alanlarını sıfırla
                },
              },
              {
                text: "Hayır",
                style: "cancel", // İptal işlemi
                onPress: () => {
                  // Kullanıcı "Hayır" derse hiçbir işlem yapılmaz
                  console.log("Miktar arttırma işlemi iptal edildi.");
                },
              },
            ]
          );
        } else {
          // Ürün mevcut değilse yeni bir ürün ekle
          setAddedProducts([
            ...addedProducts,
            {
              id: `${selectedProduct?.Stok_Kod}-${Date.now()}`,
              ...selectedProduct,
              sth_miktar: sth_miktar,
              sth_listefiyati: sth_listefiyati,
              sth_vergi: sth_vergi,
            },
          ]);
          resetFields(); // Form alanlarını sıfırla
        }
      } catch (error) {
        console.error('API çağrısı sırasında bir hata oluştu:', error);
      }
    }
  };
  
  useEffect(() => {
    if (selectedProduct?.Liste_Fiyatı) {
      setSth_listefiyati(selectedProduct.Liste_Fiyatı);
    }
  }, [selectedProduct]);
  useEffect(() => {
    if (selectedProduct?.sth_vergi) {
      setSth_vergi(selectedProduct.sth_vergi);
    }
  }, [selectedProduct]);
  
  const resetFields = () => {
    setSth_miktar('1');
    setModalVisible(false);
  };
  
  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={MainStyles.modalStokContainer}>
        <View style={MainStyles.modalStokContent}>
          <Text style={MainStyles.modalTitle}>Ürün Detayı</Text>
          <Text style={MainStyles.modalStokKodu}>Stok Kodu: {selectedProduct?.Stok_Kod}</Text>
          <Text style={MainStyles.modalStokKodu}>Stok Adı: {selectedProduct?.Stok_Ad}</Text>
          <View style={MainStyles.modalBorder}></View>
          <View style={MainStyles.productModalContainer}>
            <View style={MainStyles.inputProductModalBirimGroup}>
              <Text style={MainStyles.productModalText}>Miktar:</Text>
              <TextInput
                style={MainStyles.productDepolarArasiModalMiktarInput} 
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
              <View style={MainStyles.productDepolarArasiModalMiktarInput}>
               <Text style={MainStyles.inputDepolarArasiModalFiyat}>Liste Fiyatı: {selectedProduct?.Liste_Fiyatı}</Text>
               </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={MainStyles.addButton}
            onPress={handleAddProduct}
          >
            <Text style={MainStyles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainStyles.closeProductModalButton}
            onPress={handleClose}
          >
            <Text style={MainStyles.addButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DepolarArasiProductModal;
