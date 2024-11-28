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
import EditSatinAlmaTalepFisiProductModal from '../../context/EditSatinAlmaTalepFisiProductModal';

const SatinAlmaTalepFisiOnizleme = () => {
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
    const apiURL = '/Api/apiMethods/SatinAlmaTalepKaydetV2';
  
    // Ürünleri ve hizmetleri filtreleyin
    const products = addedProducts.filter(product => product.modalId === 0);
    const services = addedProducts.filter(product => product.modalId !== 0);
  
    // İndirim ve vergi hesaplamalarını yap
    const calculateValuesForProduct = (product) => {
        const discountRates = [
            parseFloat(product.sth_isk1) || 0,
            parseFloat(product.sth_isk2) || 0,
            parseFloat(product.sth_isk3) || 0,
            parseFloat(product.sth_isk4) || 0,
            parseFloat(product.sth_isk5) || 0,
            parseFloat(product.sth_isk6) || 0,
        ];
  
        let discountedPrice = product.sth_miktar * product.sth_tutar;
        discountRates.forEach(rate => {
            discountedPrice -= (discountedPrice * rate) / 100;
        });
  
        const kdvRate = parseFloat(product.sth_vergi.replace('%', '').replace(',', '.')) / 100;
        const calculatedTax = (discountedPrice * kdvRate).toFixed(2);
  
        return {
            discountedPrice: discountedPrice.toFixed(2),
            calculatedTax,
        };
    };
  
  // Ürünlerin detaylarını hazırlayın (modalId === 0 için)
  const detailedProducts = products.map((product) => {
    const { discountedPrice, calculatedTax } = calculateValuesForProduct(product);
    
    // cha_cins'e göre sth_cins değerini ayarla
    let sthCins = 0;
    if (faturaBilgileri.cha_cinsi === 6) {
        sthCins = 0;
    } else if (faturaBilgileri.cha_cinsi === 7) {
        sthCins = 1;
    } else if (faturaBilgileri.cha_cinsi === 13) {
        sthCins = 2;
    } else if (faturaBilgileri.cha_cinsi === 29) {
        sthCins = 12;
    }
  
    return {
      stl_tarihi: faturaBilgileri.sth_tarih,
      stl_belge_tarihi: faturaBilgileri.sth_tarih,
      stl_teslim_tarihi: faturaBilgileri.stl_teslim_tarihi,
      stl_evrak_seri: faturaBilgileri.sth_evrakno_seri,
      stl_Stok_kodu: product.Stok_Kod,
      stl_Sor_Merk : faturaBilgileri.sth_stok_srm_merkezi,
      stl_projekodu: faturaBilgileri.sth_proje_kodu,
      stl_miktari: product.sth_miktar,
      stl_teslim_miktari: 0,
      sth_birim_pntr: product.sth_birim_pntr,
      stl_cagrilabilir_fl: 1,
      stl_talep_eden: faturaBilgileri.personelListesi,
      stl_depo_no : faturaBilgileri.kaynakDepo,
      sth_aciklama: product.aciklama,
      stl_birim_pntr: product.stl_birim_pntr,
      stl_harekettipi: product.stl_harekettipi,
    };
  });
  
    // Evrakları ve hizmetleri modalId değerine göre kaydet
    let documents = [];
  
    // Eğer modalId === 0 olan ürünler varsa, sth alanlarıyla kaydet
    if (products.length > 0) {
        const productPayload = {
          stl_tarihi: faturaBilgileri.sth_tarih,
          stl_belge_tarihi: faturaBilgileri.sth_tarih,
          stl_teslim_tarihi: faturaBilgileri.stl_teslim_tarihi,
          stl_evrak_seri: faturaBilgileri.sth_evrakno_seri,
          stl_Stok_kodu: product.Stok_Kod,
          stl_Sor_Merk : faturaBilgileri.sth_stok_srm_merkezi,
          stl_projekodu: faturaBilgileri.sth_proje_kodu,
          stl_miktari: product.sth_miktar,
          stl_teslim_miktari: 0,
          sth_birim_pntr: product.sth_birim_pntr,
          stl_cagrilabilir_fl: 1,
          stl_talep_eden: faturaBilgileri.personelListesi,
          stl_depo_no : faturaBilgileri.kaynakDepo,
          sth_aciklama: product.aciklama,
          stl_birim_pntr: product.stl_birim_pntr,
          stl_harekettipi: product.stl_harekettipi,
          evrak_aciklamalari: formatExplanations(),
        };
        documents.push(productPayload);
    }
  
    // Eğer modalId !== 0 olan hizmetler varsa, her hizmet için ayrı bir payload oluşturun
    if (services.length > 0) {
        services.forEach(service => {
            const kasaHizmetValue = service.modalId === 1 ? 3 : (service.modalId === 2 ? 5 : 0);
            const servicePayload = {
              stl_tarihi: faturaBilgileri.sth_tarih,
              stl_belge_tarihi: faturaBilgileri.sth_tarih,
              stl_teslim_tarihi: faturaBilgileri.stl_teslim_tarihi,
              stl_evrak_seri: faturaBilgileri.sth_evrakno_seri,
              stl_Stok_kodu: product.Stok_Kod,
              stl_Sor_Merk : faturaBilgileri.sth_stok_srm_merkezi,
              stl_projekodu: faturaBilgileri.sth_proje_kodu,
              stl_miktari: product.sth_miktar,
              stl_teslim_miktari: 0,
              sth_birim_pntr: product.sth_birim_pntr,
              stl_cagrilabilir_fl: 1,
              stl_talep_eden: faturaBilgileri.personelListesi,
              stl_depo_no : faturaBilgileri.kaynakDepo,
              sth_aciklama: product.aciklama,
              stl_birim_pntr: product.stl_birim_pntr,
              stl_harekettipi: product.stl_harekettipi,
            };
            documents.push(servicePayload);
        });
    }
  
    // API çağrısı yapmak için toplu payload
    const finalPayload = {
        Mikro: {
            FirmaKodu: authData.FirmaKodu,
            CalismaYili: authData.CalismaYili,
            ApiKey: authData.ApiKey,
            KullaniciKodu: authData.KullaniciKodu,
            Sifre: authData.Sifre,
            evraklar: documents,
        }
    };
  
    console.log("Gönderilecek JSON Payload:", JSON.stringify(finalPayload, null, 2));
  
    try {
        const response = await axiosLink.post(apiURL, finalPayload);
        const { StatusCode, ErrorMessage, errorText } = response.data.result[0];
  
        if (StatusCode == 200) {
          Alert.alert(
              "Başarılı",
              "Veriler başarıyla kaydedildi.",
              [
                  {
                      text: "Tamam",
                      onPress: () => {
                        navigation.replace('SatinAlmaTalepFisi');
                      }
                  }
              ],
            
          );
        } else {
          Alert.alert("Hata", ErrorMessage || errorText || "Bilinmeyen bir hata oluştu.");
        }
    } catch (error) {
        Alert.alert('Hata', 'API ile veri kaydedilirken bir sorun oluştu: ' + error.message);
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
          <Text style={MainStyles.faturaBilgileriText}>sth_tarih: {faturaBilgileri.sth_tarih}</Text>
          <Text style={MainStyles.faturaBilgileriText}>sth_evrakno_seri: {faturaBilgileri.sth_evrakno_seri}</Text>
          <Text style={MainStyles.faturaBilgileriText}>kaynakDepo: {faturaBilgileri.kaynakDepo}</Text>
          <Text style={MainStyles.faturaBilgileriText}>sth_stok_srm_merkezi: {faturaBilgileri.sth_stok_srm_merkezi}</Text>
        </View>
      {/* Apiye Giden Değerler */}

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
         
        </View>
      </View>
{/* Sipariş Toplam Hesap */}

   
   
      {/* Modal for options */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={MainStyles.modalContainer}>
          <View style={MainStyles.modalContent}>
            <TouchableOpacity  onPress={() => editProduct(selectedProduct.id, selectedProduct.modalId)}
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
      <EditSatinAlmaTalepFisiProductModal
        selectedProduct={selectedProduct}
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        setAddedProducts={setAddedProducts}
        modalId={selectedProduct?.modalId}
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
            <TouchableOpacity onPress={closeExplanationModal} style={MainStyles.closeOnizlemeButton}>
              <Text style={MainStyles.closeOnizlemeButtonText}>Kapat</Text>
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

export default SatinAlmaTalepFisiOnizleme;
