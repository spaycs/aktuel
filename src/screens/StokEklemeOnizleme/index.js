import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, TextInput, Alert,  } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import { ScrollView } from 'react-native-virtualized-view'
import { useAuth } from '../../components/userDetail/Id';
import axiosLink from '../../utils/axios';
import EditProductModal from '../../context/EditProductModal';
import { useNavigation } from '@react-navigation/native';

const StokEklemeOnizleme = () => {
  const { authData, updateAuthData } = useAuth();
  const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
  const navigation = useNavigation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [vadeData, setVadeData] = useState(null);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [explanations, setExplanations] = useState(Array(10).fill(''));
  const [savedExplanations, setSavedExplanations] = useState([]);
  const [calculatedTutar, setCalculatedTutar] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Geri gitme işlemi
    const handleCancel = () => {
      navigation.goBack(); 
    };
  // Geri gitme işlemi

  const handleSave = async () => {
    setLoading(true);
    const apiURL = `/Api/apiMethods/StokKaydetV2`;
  
    // Check if faturaBilgileri is defined and not empty
    if (!faturaBilgileri) {
      console.error("Fatura bilgileri mevcut değil:", faturaBilgileri);
      Alert.alert("Hata", "Fatura bilgileri mevcut değil veya geçersiz.");
      return;
    }
  
    // Log the faturaBilgileri object to debug the structure
    console.log("Fatura Bilgileri:", JSON.stringify(faturaBilgileri, null, 2));
  
    // Prepare the payload using faturaBilgileri directly, without assuming it contains a 'products' array
    const jsonPayload = {
      Mikro: {
        FirmaKodu: authData.FirmaKodu,
        CalismaYili: authData.CalismaYili,
        ApiKey: authData.ApiKey,
        KullaniciKodu: authData.KullaniciKodu,
        Sifre: authData.Sifre,
        FirmaNo: authData.FirmaNo,
        stoklar: [
          {
            sto_kod: faturaBilgileri.sto_kod , 
            sto_isim: faturaBilgileri.sto_isim ,
            sto_kisa_ismi: faturaBilgileri.sto_kisa_ismi, 
            sto_cins: faturaBilgileri.sto_cins, 
            sto_doviz_cinsi: faturaBilgileri.sto_doviz_cinsi ,
            sto_birim1_ad: faturaBilgileri.sto_birim1_ad,
            sto_perakende_vergi: faturaBilgileri.sto_perakende_vergi,
            sto_toptan_vergi: faturaBilgileri.sto_toptan_vergi,
            barkodlar: [
              {
                bar_kodu: faturaBilgileri.bar_kodu,
                bar_barkodtipi: faturaBilgileri.bar_barkodtipi,
                bar_birimpntr: 1,
                bar_master: faturaBilgileri.bar_master,
              }
            ],
            satis_fiyatlari: [
              {
                sfiyat_listesirano: faturaBilgileri.sfiyat_listesirano,
                sfiyat_deposirano: faturaBilgileri.sfiyat_deposirano,
                sfiyat_odemeplan: faturaBilgileri.sfiyat_odemeplan,
                sfiyat_birim_pntr: faturaBilgileri.sfiyat_birim_pntr,
                sfiyat_fiyati: faturaBilgileri.sfiyat_fiyati,
                sfiyat_doviz: faturaBilgileri.sfiyat_doviz,
              }
            ]
          }
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
                      navigation.replace('StokEkleme');
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
    } finally {
      setLoading(false); 
    }
  };
  
  
  

  return (
  <View style={MainStyles.faturaContainer}>

    {/* Apiye Giden Değerler */}
    <Text style={MainStyles.sectionTitle}>Stok Bilgileri</Text>

    <View style={MainStyles.faturaBilgileriContainer}>
      <Text style={MainStyles.faturaBilgileriLabel}>Stok Kodu: <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.sto_kod}</Text></Text>
      <Text style={MainStyles.faturaBilgileriLabel}>Stok İsmi: <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.sto_isim}</Text></Text>
      <Text style={MainStyles.faturaBilgileriLabel}>Kısa İsim:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.sto_kisa_ismi}</Text></Text>
      <Text style={MainStyles.faturaBilgileriLabel}>Döviz Cinsi:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.sto_doviz_cinsi}</Text></Text>
      <Text style={MainStyles.faturaBilgileriLabel}>Perakende Vergi:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.sto_perakende_vergi}</Text></Text>
      <Text style={MainStyles.faturaBilgileriLabel}>Toptan Vergi:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.sto_toptan_vergi}</Text></Text>
     
    </View>
    {/* Apiye Giden Değerler */}


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

export default StokEklemeOnizleme;
