import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, TextInput, Alert, ActivityIndicator, Platform,  } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import { ScrollView } from 'react-native-virtualized-view'
import { useAuth } from '../../components/userDetail/Id';
import axiosLink from '../../utils/axios';
import EditProductModal from '../../context/EditProductModal';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import { useAuthDefault } from '../../components/DefaultUser';

const StokEklemeOnizleme = () => {
  const { authData, updateAuthData } = useAuth();
    const { defaults } = useAuthDefault();
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
    const apiURL = `/Api/apiMethods/CariKaydetV2`;
  
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
        cariler: [
          {
            cari_kod: faturaBilgileri.cari_kod , 
            cari_unvan1: faturaBilgileri.cari_unvan1 ,
            cari_unvan2: faturaBilgileri.cari_unvan2, 
            cari_vdaire_no: faturaBilgileri.cari_vdaire_no, 
            cari_vdaire_adi: faturaBilgileri.cari_vdaire_adi ,
            cari_doviz_cinsi1: faturaBilgileri.cari_doviz_cinsi1,
            cari_doviz_cinsi2: faturaBilgileri.cari_doviz_cinsi2,
            cari_doviz_cinsi3: faturaBilgileri.cari_doviz_cinsi3,
            cari_vade_fark_yuz: faturaBilgileri.cari_vade_fark_yuz,
            cari_KurHesapSekli: faturaBilgileri.cari_KurHesapSekli,
            cari_sevk_adres_no: faturaBilgileri.cari_sevk_adres_no,
            cari_fatura_adres_no: faturaBilgileri.cari_fatura_adres_no,
            cari_EMail: faturaBilgileri.cari_EMail,
            cari_CepTel: faturaBilgileri.cari_CepTel,
            cari_efatura_fl: faturaBilgileri.cari_efatura_fl,
            cari_def_efatura_cinsi: faturaBilgileri.cari_def_efatura_cinsi,
            cari_efatura_baslangic_tarihi: faturaBilgileri.cari_efatura_baslangic_tarihi,
            cari_vergidairekodu: faturaBilgileri.cari_vergidairekodu,
            cari_muh_kod2: faturaBilgileri.cari_muh_kod2,
            adres: [
              {
                adr_cadde: faturaBilgileri.adr_cadde,
                adr_mahalle: faturaBilgileri.adr_mahalle,
                adr_sokak: faturaBilgileri.adr_sokak,
                adr_Semt: faturaBilgileri.adr_Semt,
                adr_Apt_No: faturaBilgileri.adr_Apt_No,
                adr_Daire_No: faturaBilgileri.adr_Daire_No,
                adr_posta_kodu: faturaBilgileri.adr_posta_kodu,
                adr_ilce: faturaBilgileri.adr_ilce,
                adr_il: faturaBilgileri.adr_il,
                adr_ulke: faturaBilgileri.adr_ulke,
                adr_tel_ulke_kodu: faturaBilgileri.adr_tel_ulke_kodu,
                adr_tel_bolge_kodu: faturaBilgileri.adr_tel_bolge_kodu,
                adr_tel_no1: faturaBilgileri.adr_tel_no1,
                adr_tel_no2: faturaBilgileri.adr_tel_no2,
                adr_tel_faxno: faturaBilgileri.adr_tel_faxno,
              }
            ],
            yetkili: [
              {
                mye_isim: faturaBilgileri.mye_isim,
                mye_soyisim: faturaBilgileri.mye_soyisim,
                mye_dahili_telno: faturaBilgileri.mye_dahili_telno,
                mye_email_adres: faturaBilgileri.mye_email_adres,
                mye_cep_telno: faturaBilgileri.mye_cep_telno,
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
                        // Hareket Logunu burada yazdır
                    const logHareket = async () => {
                      const platform = Platform.OS === 'android' ? 'Android' : 'iOS';
                      const body = {
                        Message: `Cari Kaydedildi ${faturaBilgileri.cari_kod} - ${faturaBilgileri.cari_unvan1} - ${faturaBilgileri.cari_unvan2} - İşlem Yapılan Platform: ${platform}`,
                        User: defaults[0].IQ_MikroPersKod, 
                        database: defaults[0].IQ_Database,
                        data: 'Cari CariKaydetV2',
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
                      navigation.replace('CariEkleme');
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
  <View style={MainStyles.faturaContainer}>


        {/* Apiye Giden Değerler */}
        <Text style={MainStyles.sectionTitle}>Cari Bilgileri</Text>

<View style={MainStyles.faturaBilgileriContainer}>
  <Text style={MainStyles.faturaBilgileriLabel}>Cari Kodu: <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.cari_kod}</Text></Text>
  <Text style={MainStyles.faturaBilgileriLabel}>Cari Ünvan: <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.cari_unvan1}</Text></Text>
  <Text style={MainStyles.faturaBilgileriLabel}>Vergi Dairesi:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.cari_vdaire_adi}</Text></Text>
  <Text style={MainStyles.faturaBilgileriLabel}>Email:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.cari_EMail}</Text></Text>
  <Text style={MainStyles.faturaBilgileriLabel}>Tel:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.cari_CepTel}</Text></Text>
  <Text style={MainStyles.faturaBilgileriLabel}>Döviz Cinsi 1:  <Text style={MainStyles.faturaBilgileriValue}>{faturaBilgileri.cari_doviz_cinsi1}</Text></Text>
 
</View>
{/* Apiye Giden Değerler */}


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

export default StokEklemeOnizleme;
