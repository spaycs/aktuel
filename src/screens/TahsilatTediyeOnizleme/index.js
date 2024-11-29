import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, TextInput, Alert, ActivityIndicator,  } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import { ScrollView } from 'react-native-virtualized-view'
import { useAuth } from '../../components/userDetail/Id';
import axiosLink from '../../utils/axios';
import { useNavigation } from '@react-navigation/native';
import EditProductModal from '../../context/EditProductModal';
import EditTahsilatTediyeModal from '../../context/EditTahsilatTediyeModal';
import EditSatisFaturasiProductModal from '../../context/EditSatisFaturasiProductModal';
import EditTahsilatTediyeNakitKrediModal from '../../context/EditTahsilatTediyeNakitKrediModal';
import FastImage from 'react-native-fast-image';

const TahsilatTediyeOnizleme = () => {
  const { authData, updateAuthData } = useAuth();
  const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [vadeData, setVadeData] = useState(null);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [explanations, setExplanations] = useState(Array(10).fill(''));
  const [savedExplanations, setSavedExplanations] = useState([]);
  const [calculatedTutar, setCalculatedTutar] = useState(0);
  const navigation = useNavigation();
  const [editTahsilatTediyeModalVisible, setEditTahsilatTediyeModalVisible] = useState(false);
  const [editTahsilatTediyeNakitKrediModalVisible, setEditTahsilatTediyeNakitKrediModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const apiURL = `/Api/apiMethods/TahsilatTediyeKaydetV3`;
    
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
                cha_tarihi: faturaBilgileri.sth_tarih,
                cha_tip: faturaBilgileri.sth_tip,
                cha_cinsi: product.cha_cinsi,
                cha_normal_Iade: faturaBilgileri.sth_normal_iade,
                cha_evrak_tip: faturaBilgileri.sth_evraktip,
                cha_evrakno_seri: faturaBilgileri.sth_evrakno_seri,
                cha_cari_cins: faturaBilgileri.sth_cari_cinsi, // Denenecek.
                cha_kod: faturaBilgileri.sth_cari_kodu,
                //cha_d_kurtar: null,
                cha_d_cins: faturaBilgileri.sth_har_doviz_cinsi,
                cha_d_kur: 1,
                cha_srmrkkodu: faturaBilgileri.sth_stok_srm_merkezi,
                cha_karsisrmrkkodu: faturaBilgileri.sth_stok_srm_merkezi,
                cha_projekodu: faturaBilgileri.sth_proje_kodu,
                cha_kasa_hizmet: product.cha_kasa_hizmet,
                cha_aciklama: product.cha_aciklama,
                //cha_kasa_hizkod: product.cha_kasa_hizkod,
                cha_kasa_hizkod: product.cha_kasa_hizkod,
                cha_vade: faturaBilgileri.cha_vade, // vade yapılacak.
                cha_meblag: product.cha_meblag,
                cha_sntck_poz: product.cha_sntck_poz,
                odeme_emirleri: {
                  //sck_tip: 6,
                  sck_banka_adres1: product.sck_TCMB_Banka_adi || product.sck_banka_adres1,
                  sck_sube_adres2: product.sck_TCMB_Sube_kodu || product.sck_sube_adres2,
                  sck_bankano: product.sck_bankano || product.cha_kasa_hizkod,
                  sck_hesapno_sehir: product.hesapNo || product.sck_hesapno_sehir,
                  sck_no: product.cekNo,
                  sck_kesideyeri: product.kesideYeri,
                  Sck_TCMB_Banka_kodu: product.sck_TCMB_Banka_kodu,
                  Sck_TCMB_Sube_kodu: product.sck_TCMB_Sube_kodu,
                  Sck_TCMB_il_kodu: product.sck_TCMB_il_kodu,
                  SckTasra_fl: product.tasrami,
                  sck_vade: product.adatVadesi, // vade yapılacak.
                  sck_borclu: faturaBilgileri.sth_cari_unvan1,
                  sck_borclu_isim: product.borcluIsim,
                  sck_tutar: product.cha_meblag
                  //sck_vdaire_no: 'DAVUTPASA 4730037510'
                },
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
                        navigation.replace('TahsilatTediye');
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
    // Ürün Düzenleme modal
    const openModal = (product) => {
      setSelectedProduct(product);
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
      setSelectedProduct(null);
    };

    const editProduct = (productId) => {
      // Seçilen ürünü benzersiz ID'ye göre bul
      const productToEdit = addedProducts.find((product) => product.id === productId);
      if (!productToEdit) return;
    
      // Seçili ürünü state'e kaydet
      setSelectedProduct(productToEdit);
    
      // Modal'ı tediyeturu değerine göre aç
      switch (productToEdit.tediyeturu) {
        case 'Nakit':
        case 'Kredi Karti':
          // Eğer tediyeturu 'Nakit' veya 'Kredi Karti' ise EditTahsilatTediyeNakitKrediModal'ı aç
          setEditTahsilatTediyeNakitKrediModalVisible(true);
          setEditTahsilatTediyeModalVisible(false);
          setModalVisible(false);
          break;
    
        case 'Musteri Ceki':
        case 'Musteri Senedi':
          // Eğer tediyeturu 'Musteri Ceki' veya 'Musteri Senedi' ise EditTahsilatTediyeModal'ı aç
          setEditTahsilatTediyeModalVisible(true);
          setEditTahsilatTediyeNakitKrediModalVisible(false);
          setModalVisible(false);
          break;
    
        default:
          // Eğer tediyeturu diğer değerlerde ise varsayılan bir işlem veya hata durumu
          console.warn('Bilinmeyen tediyeturu değeri:', productToEdit.tediyeturu);
          break;
      }
    };
    

  const deleteProduct = () => {
    if (!selectedProduct || !selectedProduct.id) return;
  
    // Seçilen ürünün id'sini içermeyen ürünleri filtreleyin
    const updatedProducts = addedProducts.filter(product => product.id !== selectedProduct.id);
  
    setAddedProducts(updatedProducts);
    closeModal();
  };

    // Geri gitme işlemi
    const handleCancel = () => {
      navigation.goBack(); 
    };
  // Geri gitme işlemi
  
  // Ürünleri listelemek için renderItem fonksiyonu
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={MainStyles.productContainer}>
        <View style={MainStyles.stokContainer}>
          <Text style={MainStyles.productName}>Kasa Banka Kodu: {item.cha_kasa_hizkod}</Text>
          <Text style={MainStyles.productTitle}>Kasa Banka İsmi: {item.cha_kasa_isim}</Text>
          <Text style={MainStyles.productDetail}>Tarih : {item.date}</Text>
          <Text style={MainStyles.productDetail}>Tutar: {item.cha_meblag}</Text>
          <Text style={MainStyles.productDetail}>Açıklama: {item.cha_aciklama}</Text>
          <Text style={MainStyles.productDetail}>Tediye türü: {item.tediyeturu}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={MainStyles.container}>
    <FlatList
      data={addedProducts}
      keyExtractor={(item) => item.someUniqueProperty ? item.someUniqueProperty.toString() : Math.random().toString()}
      renderItem={renderItem}
    />

<View style={{ flex: 1 }}>

    {/* Ürün İşlem Seçim */}
    <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={MainStyles.modalContainer}>
            <View style={MainStyles.modalContent}>
              <TouchableOpacity
                onPress={() => editProduct(selectedProduct.id)}
                style={MainStyles.onizlemeButton}
              >
                <Text style={MainStyles.buttonText}>Seçili Satırı Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteProduct} style={MainStyles.onizlemeButton}>
                <Text style={MainStyles.buttonText}>Seçili Satırı Sil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={MainStyles.onizlemeButton}>
                <Text style={MainStyles.buttonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
    <EditTahsilatTediyeNakitKrediModal
      selectedProduct={selectedProduct}
      modalVisible={editTahsilatTediyeNakitKrediModalVisible}
      setModalVisible={setEditTahsilatTediyeNakitKrediModalVisible}
      setAddedProducts={setAddedProducts}
    />
    <EditTahsilatTediyeModal
      selectedProduct={selectedProduct}
      modalVisible={editTahsilatTediyeModalVisible}
      setModalVisible={setEditTahsilatTediyeModalVisible}
      setAddedProducts={setAddedProducts}
    />

    {/* Kaydet İptal Seçim */}
    {loading && (
        <View style={MainStyles.loadingOverlay}>
         <FastImage
            style={MainStyles.loadingGif}
            source={require('../../res/images/image/pageloading.gif')}
            resizeMode={FastImage.resizeMode.contain}/>
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

export default TahsilatTediyeOnizleme;
