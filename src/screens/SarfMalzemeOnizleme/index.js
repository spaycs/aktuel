import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button,  TextInput, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import EditDepolarArasiProductModal from '../../context/EditDepolarArasiProductModal';
import { useNavigation } from '@react-navigation/native';
import axiosLink from '../../utils/axios';
import CustomHeader from '../../components/CustomHeader';

const SarfMalzemeOnizleme = () => {
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
  const [calculatedTutar, setCalculatedTutar] = useState(0);
  const [loading, setLoading] = useState(false);

  // Toplam Hesaplamalar
// Toplam Hesaplamalar
useEffect(() => {
  if (addedProducts.length > 0) {
    const selectedProduct = addedProducts[0]; 

    if (selectedProduct) {
      // sth_miktar'ı sayıya çeviriyoruz
      const newQuantity = parseFloat(selectedProduct.sth_miktar.toString().replace(',', '.')) || 0;
      const birimKDV = parseFloat(selectedProduct.Birim_KDV) || 0;

      const calculatedValue = (newQuantity * birimKDV).toFixed(2);
      setCalculatedTutar(calculatedValue);
    }
  }
}, [addedProducts]);

// Vergi hesaplama fonksiyonu
const calculateTotalTax = () => {
  let totalTax = 0;
  
  addedProducts.forEach((product) => {
    const quantity = parseFloat(product.sth_miktar.toString().replace(',', '.')) || 0;
    const unitPrice = parseFloat(product.sth_listefiyati.toString().replace(',', '.')) || 0;
    const kdvRate = parseFloat(product.sth_vergi.replace('%', '').replace(',', '.')) / 100;

    // Her ürün için vergi hesapla ve toplam vergiye ekle
    totalTax += (quantity * unitPrice * kdvRate);
  });

  // İki ondalıklı basamağa yuvarla ve sayıya dönüştür
  return parseFloat(totalTax.toFixed(2));
};

// Yekün hesaplama fonksiyonu (Vergiler dahil)
const calculateYekun = () => {
  let total = 0;

  addedProducts.forEach((product) => {
    const quantity = parseFloat(product.sth_miktar.toString().replace(',', '.')) || 0;
    const unitPrice = parseFloat(product.sth_listefiyati.toString().replace(',', '.')) || 0;
    const kdvRate = parseFloat(product.sth_vergi.replace('%', '').replace(',', '.')) / 100;
    
    // Her ürünün toplam fiyatı ve vergisi ile yekünü hesapla
    const productTotal = (quantity * unitPrice) + (quantity * unitPrice * kdvRate);
    total += productTotal;
  });

  return parseFloat(total.toFixed(2));
};

// Miktar toplamı hesaplama fonksiyonu
const calculateTotalQuantity = () => {
  let totalQuantity = 0;

  addedProducts.forEach((product) => {
    const quantity = parseFloat(product.sth_miktar.toString().replace(',', '.')) || 0;
    totalQuantity += quantity;
  });

  return parseFloat(totalQuantity.toFixed(2));
};

// Toplam Hesaplamalar

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
        <Text style={MainStyles.productDetail}>Tutar: {item.sth_listefiyati}</Text>
        <Text style={MainStyles.productDetail}>Vergi: {item.sth_vergi}</Text>
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
              sth_tip: 1,
              sth_cins: 5,
              sth_normal_iade: 0,
              sth_evraktip: 0,
              sth_evrakno_seri: faturaBilgileri.sth_evrakno_seri,
              sth_isemri_gider_kodu : faturaBilgileri.sth_isemri_gider_kodu,
              sth_stok_kod: product.Stok_Kod,
              sth_miktar: product.sth_miktar,
              sth_birim_pntr: product.sth_birim_pntr,
              sth_tutar: product.total,
              sth_vergi_pntr: product.sth_vergi_pntr,
              sth_vergisiz_fl: false,
              sth_cikis_depo_no: faturaBilgileri.kaynakDepo,
              sth_aciklama: product.aciklama,
              sth_isk_mas1: 0,
              sth_isk_mas2: 1,
              sth_isk_mas3: 1,
              sth_isk_mas4: 1,
              sth_isk_mas5: 1,
              sth_isk_mas6: 1,
              sth_isk_mas7: 1,
              sth_isk_mas8: 1,
              sth_isk_mas9: 1,
              sth_isk_mas10: 1,
              sth_cari_srm_merkezi: faturaBilgileri.sth_stok_srm_merkezi,
              sth_stok_srm_merkezi: faturaBilgileri.sth_stok_srm_merkezi,
              sth_proje_kodu: faturaBilgileri.sth_proje_kodu,

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
                      navigation.replace('SarfMalzeme');
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
     {/* Sipariş Toplam Hesap */}
      <View style={MainStyles.containerstf}>
        <View style={MainStyles.summaryContainer}>
          <Text style={MainStyles.headerText}>Sipariş Özeti</Text>
          <Text style={MainStyles.totalText}>Satır Sayısı: {addedProducts.length}</Text>
        </View>
        
        <View style={MainStyles.totalsContainer}>
          <View style={MainStyles.rowContainerOnizleme}>
            <Text style={MainStyles.totalText}>Toplam Miktar:</Text>
            <Text style={MainStyles.amountText}>{calculateTotalQuantity()} </Text>
          </View>
          <View style={MainStyles.rowContainerOnizleme}>
            <Text style={MainStyles.totalText}>Vergi Toplam:</Text>
            <Text style={MainStyles.amountText}>{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateTotalTax())} </Text>
          </View>
          <View style={MainStyles.rowContainerOnizleme}>
            <Text style={MainStyles.totalText}>Yekün:</Text>
            <Text style={MainStyles.amountTextYekun}>{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateYekun())} </Text>
          </View>
        </View>
      </View>
{/* Sipariş Toplam Hesap */}

      {/* Apiye Giden Değerler 
         <View style={MainStyles.faturaBilgileriContainer}>
          <Text style={MainStyles.faturaBilgileriText}>sth_tarih: {faturaBilgileri.sth_tarih}</Text>
          <Text style={MainStyles.faturaBilgileriText}>sth_evrakno_seri: {faturaBilgileri.sth_evrakno_seri}</Text>
          <Text style={MainStyles.faturaBilgileriText}>kaynakDepo: {faturaBilgileri.kaynakDepo}</Text>
          <Text style={MainStyles.faturaBilgileriText}>Personel Kodu: {faturaBilgileri.personelListesi}</Text>
          <Text style={MainStyles.faturaBilgileriText}>sth_isemri_gider_kodu: {faturaBilgileri.sth_isemri_gider_kodu}</Text>
          <Text style={MainStyles.faturaBilgileriText}>sth_stok_srm_merkezi: {faturaBilgileri.sth_stok_srm_merkezi}</Text>
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
       <View style={MainStyles.modalContainerAciklama}>
        <CustomHeader
          title="Açıklamalar"
          onClose={closeExplanationModal}
        />
          <View style={MainStyles.modalContent}>
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
          </View>
        </View>
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

export default SarfMalzemeOnizleme;
