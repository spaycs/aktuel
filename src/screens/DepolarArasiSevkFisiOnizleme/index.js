import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button,  TextInput, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import EditDepolarArasiProductModal from '../../context/EditDepolarArasiProductModal';
import { useNavigation } from '@react-navigation/native';
import axiosLink from '../../utils/axios';

const DepolarArasiSevkFisiOnizleme = () => {
  const { authData, updateAuthData } = useAuth();
  const { addedProducts, setAddedProducts, faturaBilgileri } = useContext(ProductContext);
  const navigation = useNavigation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [explanations, setExplanations] = useState(Array(10).fill(''));
  const [savedExplanations, setSavedExplanations] = useState([]);
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

 // Açıklama Alanı
    const openExplanationModal = () => {
      setExplanationModalVisible(true);
    };

    const closeExplanationModal = () => {
      setExplanationModalVisible(false);
    };

    const handleExplanationChange = (index, value) => {
      const newExplanations = [...explanations];
      newExplanations[index] = value;
      setExplanations(newExplanations);
    };

    const formatExplanations = () => {
      // 10 açıklama alanını her zaman döndür
      return Array.from({ length: 10 }, (_, index) => {
        return { aciklama: explanations[index] || "" };
      });
    };


    const saveExplanations = () => {
      // Şu anki açıklamaları filtrele ve güncelle
      const formattedExplanations = formatExplanations();
      setSavedExplanations(formattedExplanations);
      closeExplanationModal(); 
    };

  // Açıklama Alanı

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={MainStyles.productContainer}>
        <Text style={MainStyles.productName}>Stok Adı: {item.Stok_Ad}</Text>
        <Text style={MainStyles.productTitle}>Stok Kodu: {item.Stok_Kod}</Text>
        <Text style={MainStyles.productDetail}>Miktar: {item.sth_miktar}</Text>
        <Text style={MainStyles.productDetail}>ListeFiyatı: {item.sth_listefiyati}</Text>
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
    const apiURL = `/Api/apiMethods/DahiliStokHareketKaydetV2`;
    
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
            evrak_aciklamalari: formatExplanations(),
            satirlar: addedProducts.map((product) => ({
              sth_tarih: faturaBilgileri.sth_tarih,
              sth_tip: 2,
              sth_cins: 6,
              sth_normal_iade: 0,
              sth_evraktip: 2,
              sth_evrakno_seri: faturaBilgileri.sth_evrakno_seri,
              sth_stok_kod: product.Stok_Kod,
              sth_miktar: product.sth_miktar,
              sth_tutar: product.sth_listefiyati,
              sth_birim_pntr: product.sth_birim_pntr,
              sth_tutar: product.total,
              sth_vergi_pntr: product.sth_vergi_pntr,
              sth_vergisiz_fl: false,
              sth_giris_depo_no: faturaBilgileri.kaynakDepo,
              sth_cikis_depo_no: faturaBilgileri.hedefDepo,
              sth_aciklama: product.aciklama,
              seriler: "",
              renk_beden: [
                {
                  renk_kirilim_kodu: "",
                  beden_kirilim_kodu: "",
                  miktar: 0,
                },
              ],
            })),
          },
        ],
      },
    };
  
    console.log("Gönderilecek JSON Payload:", JSON.stringify(jsonPayload, null, 2));
  
    try {
      const response = await axiosLink.post(apiURL, jsonPayload);
      console.log("apiURL", response);
      const { StatusCode, ErrorMessage, errorText } = response.data.result[0];
  
      if (StatusCode === 200) {
        Alert.alert(
            "Başarılı",
            "Veriler başarıyla kaydedildi.",
            [
                {
                    text: "Tamam",
                    onPress: () => {
                      navigation.replace('DepolarArasiSevkFisi');
                    }
                }
            ],
          
        );
      } else {
        Alert.alert("Hata", ErrorMessage || errorText || "Bilinmeyen bir hata oluştu.");
      }
      console.log("apiURL", response);
      console.log(response.data);
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
      <View style={MainStyles.summaryContainer}>
        <Text style={MainStyles.totalText}>Satır Sayısı: {addedProducts.length}</Text>
        <Text style={MainStyles.totalText}>
          Toplam Miktar: {addedProducts.reduce((sum, product) => sum + parseFloat(product.sth_miktar || 0), 0)}
        </Text>
      </View>

         {/* Apiye Giden Değerler
         <View style={MainStyles.faturaBilgileriContainer}>
          <Text style={MainStyles.faturaBilgileriText}>sth_tarih: {faturaBilgileri.sth_tarih}</Text>
          <Text style={MainStyles.faturaBilgileriText}>sth_evrakno_seri: {faturaBilgileri.sth_evrakno_seri}</Text>
          <Text style={MainStyles.faturaBilgileriText}>kaynakDepo: {faturaBilgileri.kaynakDepo}</Text>
          <Text style={MainStyles.faturaBilgileriText}>hedefDepo: {faturaBilgileri.hedefDepo}</Text>
          <Text style={MainStyles.faturaBilgileriText}>Personel Kodu: {faturaBilgileri.sth_personel_kodu}</Text>
        </View>
      {/* Apiye Giden Değerler */}
   
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

      {/* Açıklama Ekleme */}
      <TouchableOpacity style={MainStyles.aciklamaContainer} onPress={openExplanationModal}> 
        <Text style={MainStyles.saveButtonTextAciklama}>Açıklama Ekle</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={explanationModalVisible}
        onRequestClose={closeExplanationModal}
      >
        <SafeAreaView style={MainStyles.modalContainerAciklama}>
          <View style={MainStyles.modalContent}>
            <Text style={MainStyles.modalTitleAciklama}>Açıklamalar</Text>
            {Array.from({ length: 10 }, (_, index) => (
              <TextInput
                key={index}
                style={MainStyles.textInput}
                placeholder={`Açıklama ${index + 1}`}
                value={explanations[index] || ""} // Her zaman 10 açıklama alanı olmasını sağla
                onChangeText={(text) => handleExplanationChange(index, text)}
              />
            ))}
            <TouchableOpacity onPress={saveExplanations} style={MainStyles.addButton}>
              <Text style={MainStyles.addButtonText}>Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeExplanationModal} style={MainStyles.closeOnizlemeButton}>
              <Text style={MainStyles.closeOnizlemeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    {/* Açıklama Ekleme */}
    {/* Kaydet İptal Seçim */}
    {loading && (
        <View style={MainStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <View style={MainStyles.saveContainer}>
        <TouchableOpacity
          style={MainStyles.saveButton}
          onPress={handleSave}
          disabled={loading} // Kaydet butonunu devre dışı bırak
        >
          <Text style={MainStyles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={MainStyles.saveButton}
          onPress={handleCancel}
          disabled={loading} // İptal butonunu devre dışı bırak
        >
          <Text style={MainStyles.saveButtonText}>İptal</Text>
        </TouchableOpacity>
      </View>
    {/* Kaydet İptal Seçim */}
   
    </View>
  );
};

export default DepolarArasiSevkFisiOnizleme;
