import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button,  TextInput, Alert, Linking, Platform } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import EditDepolarArasiProductModal from '../../context/EditDepolarArasiProductModal';
import { useNavigation } from '@react-navigation/native';
import axiosLink from '../../utils/axios';
import axiosLinkMain from '../../utils/axiosMain';
import axios from 'axios';
import { useAuthDefault } from '../../components/DefaultUser';

const DepoSayimOnizleme = () => {
  const { authData, updateAuthData } = useAuth();
  const { defaults } = useAuthDefault();
  const { addedProducts, setAddedProducts, faturaBilgileri } = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const calculateSubTotal = () => {
    return addedProducts.reduce((sum, product) => sum + parseFloat(product.total || 0), 0).toFixed(2);
  };

  const calculateTax = () => {
    return (calculateSubTotal() * 0.2).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return (parseFloat(calculateSubTotal()) + parseFloat(calculateTax())).toFixed(2);
  };

  // Ürün Düzenleme modal
    const openModal = (product) => {
      setSelectedProduct(product);
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
      setSelectedProduct(null);
    };

    const editProduct = () => {
      if (!selectedProduct) return;

      setEditedProduct(selectedProduct);
      // Close the initial modal and open the edit modal
      setModalVisible(false);
      setEditModalVisible(true);
    };


    const deleteProduct = () => {
      if (!selectedProduct) return;

      const updatedProducts = addedProducts.filter(product => product.id !== selectedProduct.id);
      setAddedProducts(updatedProducts);
      closeModal();
    };

  // Ürün Düzenleme modal

   // Geri gitme işlemi
    const handleCancel = () => {
      navigation.goBack(); 
    };
  // Geri gitme işlemi

  const handlePdfClick = async (Evrak_No, Depo_No) => {
    try {
      // API'ye isteği yaparken evrakno_seri ve evrakno_sira değerlerini gönderiyoruz
      const response = await axiosLinkMain.get(`/Api/PDF/SayimPDF?evrakno=${Evrak_No}&depo=${Depo_No}`);
      console.log(response);
      console.log('API Yanıtı:', response.data); // Yanıtı kontrol etmek için 
  
      const pdfPath = response.data; 
      
      if (pdfPath) {
        const fullPdfUrl = `${pdfPath}`;
  
        Linking.openURL(fullPdfUrl);
      } else {
        throw new Error('PDF dosya yolu alınamadı');
      }
    } catch (error) {
      console.error('PDF almakta hata oluştu2:', error);
      Alert.alert('Hata', 'PDF alınırken bir sorun oluştu.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={MainStyles.productContainer}>
        <Text style={MainStyles.productName}>Stok Adı: {item.Stok_Ad}</Text>
        <Text style={MainStyles.productTitle}>Stok Kodu: {item.Stok_Kod}</Text>
        <Text style={MainStyles.productDetail}>Miktar: {item.sth_miktar}</Text>
      </View>
    </TouchableOpacity>
  );

   const handleSave = async () => {

    if (addedProducts.length === 0) {
      Alert.alert(
          "Uyarı",
          "Kaydetmeden önce en az bir ürün eklemelisiniz.",
          [{ text: "Tamam" }]
      );
      return; // Fonksiyonu burada durdur
    }
    setLoading(true);
    const apiURL = `/Api/apiMethods/SayimSonuclariKaydetV2`;
  
    const jsonPayload = {
      Mikro: {
        FirmaKodu: authData.FirmaKodu,
        CalismaYili: authData.CalismaYili,
        ApiKey: authData.ApiKey,
        KullaniciKodu: authData.KullaniciKodu,
        Sifre: authData.Sifre,
        FirmaNo: authData.FirmaNo,
        SubeNo: authData.SubeNo,
        evraklar: [
          {
            satirlar: addedProducts.map((product) => ({
              sym_tarihi: faturaBilgileri.sym_tarihi,
              sym_depono: faturaBilgileri.sym_depono,
              sym_Stokkodu: product.Stok_Kod,
              sym_miktar1: product.sth_miktar,
              sym_serino: faturaBilgileri.rafKodu,
            })),
          },
        ],
      },
    };
  
    console.log("Gönderilecek JSON Payload:", JSON.stringify(jsonPayload, null, 2));
  
    try {
      const response = await axiosLink.post(apiURL, jsonPayload);
      const { StatusCode, ErrorMessage, errorText } = response.data.result[0];
  
      if (StatusCode === 200) {
        // Kaydetme işlemi başarılı
        Alert.alert("Başarılı", "Veriler başarıyla kaydedildi.", [
          {
            text: "Yazdır",
            onPress: async () => {
              const Evrak_No = faturaBilgileri.evrakNo; // Burada evrak numarasını alıyorsunuz
              const Depo_No = faturaBilgileri.sym_depono; // Depo numarasını alıyorsunuz
              await handlePdfClick(Evrak_No, Depo_No); // Yazdırma işlemi
                // Hareket Logunu burada yazdır
                const logHareket = async () => {
                  const platform = Platform.OS === 'android' ? 'Android' : 'iOS';
                  const body = {
                    Message: `Depo Sayım Kaydedildi ${faturaBilgileri.sym_tarihi} - ${faturaBilgileri.sym_depono} - ${faturaBilgileri.rafKodu} - İşlem Yapılan Platform: ${platform}`,
                    User: defaults[0].IQ_MikroPersKod, 
                    database: defaults[0].IQ_Database,
                    data: 'Depo Sayım SayimSonuclariKaydetV2',
                  };

                  try {
                    const logResponse = await axios.post('http://80.253.246.89:8055/api/Kontrol/HareketLogEkle', body);
                    if (logResponse.status === 200) {
                      console.log('Hareket Logu başarıyla eklendi');
                    } else {
                      console.log('Hareket Logu eklenirken bir hata oluştu');
                    }
                  } catch (error) {
                    console.error('API çağrısı sırasında hata oluştu:', error);
                  }
                };

                logHareket();
              navigation.replace('DepoSayim')
            },
          },
          {
            text: "Kapat",
            onPress: () => navigation.replace('DepoSayim'),
            style: "cancel",
          },
        ]);
      } else {
        Alert.alert("Hata", ErrorMessage || errorText || "Bilinmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      Alert.alert("Hata", "Veriler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }finally {
      setLoading(false); 
    }
  };

  return (
    <View style={MainStyles.container}>
      <FlatList
        data={addedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.Stok_Kod}
      />

       {/* Apiye Giden Değerler 
      <View style={MainStyles.faturaBilgileriContainer}>
        <Text style={MainStyles.fontSize11}>sym_depono: {faturaBilgileri.sym_depono}</Text>
       
      </View>
    {/* Apiye Giden Değerler */}
    <View style={MainStyles.summaryContainer}>
      <Text style={MainStyles.totalText}>Satır Sayısı: {addedProducts.length}</Text>
      <Text style={MainStyles.totalText}>
        Toplam Miktar: {addedProducts.reduce((sum, product) => sum + parseFloat(product.sth_miktar || 0), 0)}
      </Text>
    </View>

      {/* Modal for options */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={MainStyles.modalContainer}>
          <View style={MainStyles.modalContent}>
            <TouchableOpacity  onPress={() => editProduct(selectedProduct.id)}
                style={MainStyles.onizlemeButton}>
              <Text style={MainStyles.buttonText}>Seçili Satırı Düzenle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={deleteProduct} style={MainStyles.onizlemeButton}>
              <Text style={MainStyles.buttonText}>Seçili Satırı Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={MainStyles.onizlemeButton}>
              <Text style={MainStyles.buttonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <EditDepolarArasiProductModal
        selectedProduct={selectedProduct}
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        setAddedProducts={setAddedProducts}
      />

{/* Kaydet İptal Seçim */}
      <View style={MainStyles.saveContainer}>
      <TouchableOpacity style={MainStyles.saveButton} onPress={handleSave} > 
          <View>
              <Text style={MainStyles.saveButtonText}>Kaydet</Text>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={MainStyles.saveButton} onPress={handleCancel}> 
          <View>
              <Text style={MainStyles.saveButtonText}>İptal</Text>
          </View>
      </TouchableOpacity>
      </View>
{/* Kaydet İptal Seçim */}
    </View>
  );
};

export default DepoSayimOnizleme;
