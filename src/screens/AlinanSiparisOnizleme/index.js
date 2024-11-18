import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, TextInput, Alert,  } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import { ScrollView } from 'react-native-virtualized-view'
import { useAuth } from '../../components/userDetail/Id';
import axiosLink from '../../utils/axios';
import axiosLinkMain from '../../utils/axiosMain';
import EditProductModal from '../../context/EditProductModal';
import { useNavigation } from '@react-navigation/native';
import { useAuthDefault } from '../../components/DefaultUser';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditAlinanSiparisProductModal from '../../context/EditAlinanSiparisProductModal';
const AlinanSiparisOnizleme = () => {
  const { authData, updateAuthData } = useAuth();
  const { defaults } = useAuthDefault();
  const [sip_satici_kod , setSip_satici_kod ] = useState('');
  const { addedAlinanSiparisProducts, setAddedAlinanSiparisProducts, alinanSiparis, setAlinanSiparis } = useContext(ProductContext);
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
  const { isSaved, setIsSaved } = useContext(ProductContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('addedAlinanSiparisProducts', addedAlinanSiparisProducts);
  }, []);

  const saveDataToAsyncStorage = async (addedAlinanSiparisProducts, alinanSiparis) => {
    try {
      await AsyncStorage.setItem('addedAlinanSiparisProducts', JSON.stringify(addedAlinanSiparisProducts));
      await AsyncStorage.setItem('alinanSiparis', JSON.stringify(alinanSiparis));
      //console.log("Data saved successfully to AsyncStorage.");
    } catch (error) {
      console.error("Failed to save data to AsyncStorage:", error);
    }
  };

  const loadDataFromAsyncStorage = async () => {
    try {
      const addedProductsData = await AsyncStorage.getItem('addedAlinanSiparisProducts');
      const faturaBilgileriData = await AsyncStorage.getItem('alinanSiparis');

      if (addedProductsData) {
        setAddedAlinanSiparisProducts(JSON.parse(addedProductsData));
      }
      if (faturaBilgileriData) {
        setAlinanSiparis(JSON.parse(faturaBilgileriData));
      }
      console.log("Data loaded successfully from AsyncStorage.");
    } catch (error) {
      console.error("Failed to load data from AsyncStorage:", error);
    }
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('addedAlinanSiparisProducts');
      await AsyncStorage.removeItem('alinanSiparis');
      await AsyncStorage.removeItem('selectedDepo');
      await AsyncStorage.removeItem('selectedIrsaliyeTipi');
      await AsyncStorage.removeItem('selectedDoviz');
      setAddedAlinanSiparisProducts([]);
      setAlinanSiparis([]);
    } catch (error) {
      console.error("Failed to clear data from AsyncStorage:", error);
      Alert.alert("Hata", "AsyncStorage temizlenirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    loadDataFromAsyncStorage();
    console.log("caridengelsin", defaults[0].IQ_OPCaridenGelsin);
  }, []);

  useEffect(() => {
    saveDataToAsyncStorage(addedAlinanSiparisProducts, alinanSiparis);
  }, [addedAlinanSiparisProducts, alinanSiparis]);
  
  useEffect(() => {
    if (defaults && defaults[0].IQ_MikroPersKod) {
      setSip_satici_kod(defaults[0].IQ_MikroPersKod);
    }
  }, [defaults]);

  // Toplam Hesaplamalar
useEffect(() => {
  if (addedAlinanSiparisProducts.length > 0) {
    const selectedProduct = addedAlinanSiparisProducts[0];

    if (selectedProduct) {
      // sth_miktar değeri varsa kullan, yoksa 0 olarak varsay
      const newQuantity = selectedProduct.sth_miktar !== undefined && selectedProduct.sth_miktar !== null
        ? parseFloat(selectedProduct.sth_miktar.toString().replace(',', '.'))
        : 0;

      // Birim_KDV değeri varsa kullan, yoksa 0 olarak varsay
      const birimKDV = selectedProduct.Birim_KDV !== undefined && selectedProduct.Birim_KDV !== null
        ? parseFloat(selectedProduct.Birim_KDV)
        : 0;

      const total = birimKDV; // total hesaplama için kontrol eklenebilir

      // Hesaplanan değeri tutar
      const calculatedValue = (newQuantity * birimKDV).toFixed(2);
      setCalculatedTutar(calculatedValue);
    }
  }
}, [addedAlinanSiparisProducts]);


    const calculateIskonto = (selectedProductId = null) => {
      // Eğer belirli bir ürün için iskonto hesaplanacaksa
      if (selectedProductId) {
        const product = addedAlinanSiparisProducts.find((p) => p.id === selectedProductId);
        if (product) {
          const iskonto1 = parseFloat(product.sth_iskonto1) || 0;
          const iskonto2 = parseFloat(product.sth_iskonto2) || 0;
          const iskonto3 = parseFloat(product.sth_iskonto3) || 0;
          const iskonto4 = parseFloat(product.sth_iskonto4) || 0;
          const iskonto5 = parseFloat(product.sth_iskonto5) || 0;
          const iskonto6 = parseFloat(product.sth_iskonto6) || 0;

          // Toplam iskontoyu hesaplayın
          const productDiscount = iskonto1 + iskonto2 + iskonto3 + iskonto4 + iskonto5 + iskonto6;
          return productDiscount.toFixed(2);
        }
        return "0"; // Ürün bulunamazsa veya iskontolar yoksa 0 döndür
      } else {
        // Eğer tüm ürünler için toplam iskonto hesaplanacaksa
        const totalDiscount = addedAlinanSiparisProducts.reduce((sum, product) => {
          const iskonto1 = parseFloat(product.sth_iskonto1) || 0;
          const iskonto2 = parseFloat(product.sth_iskonto2) || 0;
          const iskonto3 = parseFloat(product.sth_iskonto3) || 0;
          const iskonto4 = parseFloat(product.sth_iskonto4) || 0;
          const iskonto5 = parseFloat(product.sth_iskonto5) || 0;
          const iskonto6 = parseFloat(product.sth_iskonto6) || 0;

          // Her ürün için iskontoları toplayın
          const productDiscount = iskonto1 + iskonto2 + iskonto3 + iskonto4 + iskonto5 + iskonto6;
          return sum + productDiscount;
        }, 0);

        // Toplam iskontoyu formatlayın ve döndürün
        return totalDiscount.toFixed(2);
      }
    };

    const calculateNetFiyat = () => {
      const { sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6 } = selectedProduct;
    
      // İskontoları sayıya çevir ve topla (boşsa 0 olarak al)
      const iskonto1 = parseFloat(sth_iskonto1) || 0;
      const iskonto2 = parseFloat(sth_iskonto2) || 0;
      const iskonto3 = parseFloat(sth_iskonto3) || 0;
      const iskonto4 = parseFloat(sth_iskonto4) || 0;
      const iskonto5 = parseFloat(sth_iskonto5) || 0;
      const iskonto6 = parseFloat(sth_iskonto6) || 0;
    
      // İskontoların toplamını hesapla
      const toplamIskonto = iskonto1 + iskonto2 + iskonto3 + iskonto4 + iskonto5 + iskonto6;
    
      // Net fiyatı hesapla
      const netFiyat = parseFloat(sth_tutar) - toplamIskonto;
    
      return netFiyat.toFixed(2); // İki ondalık basamakla döndür
    };

    const calculateTotalTax = () => {
      let totalTax = 0;

      addedAlinanSiparisProducts.forEach((product) => {
        // KDV değerini yüzde işaretini kaldırarak sayısal değere dönüştür
        const kdvRate = parseFloat(product.sth_vergi.replace('%', '').replace(',', '.')) / 100;
        
        // Ürün başına KDV hesaplama
        const discountedPrice = (product.sth_miktar * product.sth_tutar) - 
          (parseFloat(product.sth_iskonto1) || 0) - 
          (parseFloat(product.sth_iskonto2) || 0) - 
          (parseFloat(product.sth_iskonto3) || 0) - 
          (parseFloat(product.sth_iskonto4) || 0) - 
          (parseFloat(product.sth_iskonto5) || 0) - 
          (parseFloat(product.sth_iskonto6) || 0);

        // Vergi hesaplama
        const taxAmount = discountedPrice * kdvRate;
        totalTax += taxAmount;
      });

      // İki ondalıklı basamağa yuvarla ve sayıya dönüştür
      return parseFloat(totalTax.toFixed(2));
    };

    const calculateSubTotal = () => {
      // Ara Toplam hesaplama
      let araToplam = 0;
      addedAlinanSiparisProducts.forEach((product) => {
        araToplam += product.sth_miktar * product.sth_tutar;
      });
      return araToplam;
    };

    const calculateTax = () => {
      let vergiToplam = 0;
      addedAlinanSiparisProducts.forEach((product) => {
        const kdvRate = parseFloat(product.sth_vergi.replace('%', '').replace(',', '.')) / 100;
        // Her ürün için toplam indirimi hesapla
        const productDiscount = parseFloat(calculateIskonto(product.id));

        // İskonto sonrası fiyat hesaplama
        const discountedPrice = (product.sth_miktar * product.sth_tutar) - productDiscount;

        // Vergi hesaplama
        const taxAmount = discountedPrice * kdvRate;
        vergiToplam += taxAmount;
      });

      return parseFloat(vergiToplam.toFixed(2));
    };
    
    // Yekün hesaplama
      const calculateYekun = () => {
        // Subtotal ve discount hesaplamaları
        const subTotal = parseFloat(calculateSubTotal());
        const taxTotal = calculateTax();
        const discountTotal = parseFloat(calculateIskonto());
      
        // NaN durumlarını kontrol et
        if (isNaN(subTotal) || isNaN(taxTotal) || isNaN(discountTotal)) {
          console.error("Bir hesaplama hatası oluştu. Değerler: ", { subTotal, taxTotal, discountTotal });
          return "Hata"; // veya uygun bir hata mesajı
        }
        return (subTotal + taxTotal - discountTotal).toFixed(2);
      };
    // Yekün hesaplama
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

    const editProduct = (productId) => {
      // Seçilen ürünü benzersiz ID'ye göre bul
      const productToEdit = addedAlinanSiparisProducts.find(product => product.id === productId);
      if (!productToEdit) return;
    
      // Seçili ürünü state'e kaydet
      setSelectedProduct(productToEdit);
    
      // İlk modalı kapat ve düzenleme modalını aç
      setModalVisible(false);
      setEditModalVisible(true);
    };
    
    const deleteProduct = () => {
      if (!selectedProduct) return;
    
      const updatedProducts = addedAlinanSiparisProducts.filter(product => product.id !== selectedProduct.id);
      setAddedAlinanSiparisProducts(updatedProducts);
      closeModal();
    };

  // Ürün Düzenleme modal
  
  // Ürün Bilgileri
    const renderItem = ({ item }) => {
    // Ürün başına iskonto toplamını hesaplayan fonksiyon
      const calculateItemDiscount = () => {
        const discountRates = [
          parseFloat(item.sth_isk1) || 0,
          parseFloat(item.sth_isk2) || 0,
          parseFloat(item.sth_isk3) || 0,
          parseFloat(item.sth_isk4) || 0,
          parseFloat(item.sth_isk5) || 0,
          parseFloat(item.sth_isk6) || 0
        ];
      
        let discountedPrice = item.sth_miktar * item.sth_tutar; // İlk tutar
        discountRates.forEach((rate) => {
          discountedPrice -= (discountedPrice * rate) / 100;
        });
      
        return discountedPrice.toFixed(2);
      };

      // Ürün başına KDV hesaplama fonksiyonu
      const calculateItemTax = () => {
        const discountedTotal = calculateItemDiscount(); // İskonto sonrası tutar
        const kdvRate = parseFloat(item.sth_vergi.replace('%', '').replace(',', '.')) / 100;
        const taxAmount = (discountedTotal * kdvRate).toFixed(2);
        return taxAmount;
      };
      const totalPrice = (item.sth_miktar * item.sth_tutar).toFixed(2);
      const netPrice = calculateItemDiscount();

      return (
        <TouchableOpacity onPress={() => openModal(item)}>
          <View style={MainStyles.productContainer}>
            <View style={MainStyles.stokContainer}>
              <Text style={MainStyles.productName}>Stok Adı: {item.Stok_Ad}</Text>
              <Text style={MainStyles.productTitle}>Stok Kodu: {item.Stok_Kod}</Text>
              <Text style={MainStyles.productTitle}>Vade: {item.Vade}</Text>
            </View>

            <View style={MainStyles.rowContainer}>
              <View style={MainStyles.columnContainer}>
                <Text style={MainStyles.productDetail}>Miktar: {item.sth_miktar}</Text>
                <Text style={MainStyles.productDetail}>
                  Birim Fiyat: {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.sth_tutar)}
                </Text>

                <Text style={MainStyles.productDetail}>Net Fiyat: {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(netPrice)} </Text>
              </View>
              <View style={MainStyles.columnContainer}>
              <Text style={MainStyles.productDetail}>
                KDV: {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateItemTax())} 
              </Text>
                <Text style={MainStyles.productDetail}>Vergi: {item.sth_vergi}</Text>
              </View>
            </View>
    
            <View style={MainStyles.rowContainer}>
            <Text style={MainStyles.productDetail}>
              Tutar: {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.sth_miktar * item.sth_tutar)}
            </Text>

              <Text style={MainStyles.productDetail}>Açıklama: {item.aciklama}</Text>
            </View>

            <View style={MainStyles.rowContainer}>
              <Text style={MainStyles.productDetail}>İskonto 1: {item.sth_isk1}</Text>
              <Text style={MainStyles.productDetail}>İskonto 2: {item.sth_isk2}</Text>
              <Text style={MainStyles.productDetail}>İskonto 3: {item.sth_isk3}</Text>
            </View>
            <View style={MainStyles.rowContainer}>
              <Text style={MainStyles.productDetail}>İskonto 4: {item.sth_isk4}</Text>
              <Text style={MainStyles.productDetail}>İskonto 5: {item.sth_isk5}</Text>
              <Text style={MainStyles.productDetail}>İskonto 6: {item.sth_isk6}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
  // Ürün Bilgileri

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

  // Ortalama Vade Hesabı
    useEffect(() => {
      if (alinanSiparis.sip_musteri_kod) {
        const fetchVadeData = async () => {
          try {
            const response = await axiosLinkMain.get(`/Api/Cari/CariOrtalamaVade?cari=${alinanSiparis.sip_musteri_kod}`);
            const data = response.data;
    
            if (Array.isArray(data) && data.length > 0) {
              setVadeData(data[0].Vade); 
            } else {
              console.error("API yanıtı beklenen formatta değil:", data);
            }
          } catch (error) {
            console.error("API çağrısında hata oluştu:", error);
          }
        };
    
        fetchVadeData();
      }
    }, [alinanSiparis.sip_musteri_kod]);
  // Ortalama Vade Hesabı


  

  const handleCancel = async () => {
    await clearAsyncStorage(); // AsyncStorage temizle
    navigation.goBack();       // Geri git
};

  const handleSave = async () => {

    console.log("API yanı", addedAlinanSiparisProducts.StokVade);
    if (addedAlinanSiparisProducts.length === 0) {
      Alert.alert(
          "Uyarı",
          "Kaydetmeden önce en az bir ürün eklemelisiniz.",
          [{ text: "Tamam" }]
      );
      return; // Fonksiyonu burada durdur
    }

    setLoading(true);
    const apiURL = `/Api/apiMethods/SiparisKaydetV2`;

     // Tüm ürünler için iskonto ve vergi hesaplamalarını yapıyoruz
     const productsWithCalculatedValues = addedAlinanSiparisProducts.map((product) => {
      // Ürün başına iskonto toplamını hesaplayan fonksiyon
      const calculateItemDiscount = () => {
        const discountRates = [
          parseFloat(product.sth_isk1) || 0,
          parseFloat(product.sth_isk2) || 0,
          parseFloat(product.sth_isk3) || 0,
          parseFloat(product.sth_isk4) || 0,
          parseFloat(product.sth_isk5) || 0,
          parseFloat(product.sth_isk6) || 0,
        ];
  
        let discountedPrice = product.sth_miktar * product.sth_tutar; // İlk tutar
        discountRates.forEach((rate) => {
          discountedPrice -= (discountedPrice * rate) / 100;
        });
  
        return discountedPrice.toFixed(2);
      };
  
      // Ürün başına KDV hesaplama fonksiyonu
      const calculateItemTax = () => {
        const discountedTotal = calculateItemDiscount(); // İskonto sonrası tutar
        const kdvRate = parseFloat(product.sth_vergi.replace('%', '').replace(',', '.')) / 100;
        const taxAmount = (discountedTotal * kdvRate).toFixed(2);
        return taxAmount;
      };
  
      // İskonto ve KDV'yi hesapla ve ürüne ekle
      const calculatedTax = calculateItemTax();
      const calculatedDiscountedPrice = calculateItemDiscount();
  
      return {
        ...product,
        sth_vergi: calculatedTax, // Hesaplanan KDV
      };
    });

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
            satirlar: productsWithCalculatedValues.map((product) => ({
              sip_tarih: alinanSiparis.sip_tarih,
              sip_tip: alinanSiparis.sip_tip,
              sip_cins: alinanSiparis.sip_cins,
              sip_evrakno_seri: alinanSiparis.sip_evrakno_seri,
              sip_stok_kod: product.Stok_Kod,
              sip_musteri_kod: alinanSiparis.sip_musteri_kod,
              sip_adresno: alinanSiparis.sip_adresno,
              sip_stok_sormerk: alinanSiparis.sip_stok_sormerk,
              sip_cari_sormerk: alinanSiparis.sip_stok_sormerk,
              sip_projekodu: alinanSiparis.sip_projekodu,
              sip_miktar: product.sth_miktar,
              sip_birim_pntr: product.sth_birim_pntr,
              sip_tutar: product.total,
              sip_vergi_pntr: product.sth_vergi_pntr,
              sip_vergi: product.sth_vergi,
              sip_vergisiz_fl: false,
              sip_iskonto_1: product.sth_iskonto1,
              sip_iskonto_2: product.sth_iskonto2,
              sip_iskonto_3: product.sth_iskonto3,
              sip_iskonto_4: product.sth_iskonto4,
              sip_iskonto_5: product.sth_iskonto5,
              sip_iskonto_6: product.sth_iskonto6,
              sip_b_fiyat : product.sth_tutar,
              sth_giris_depo_no: alinanSiparis.sth_giris_depo_no,
              sip_depono: alinanSiparis.sip_depono,
              sip_opno: defaults[0]?.IQ_OPCaridenGelsin === 1 
            ? alinanSiparis.sip_opno 
            : product.StokVade || product.Vade,
              sip_satici_kod : sip_satici_kod ,
              sip_aciklama: product.aciklama,
              seriler: "",
              renk_beden: [
                {
                  renk_no: "",
                  beden_no: "",
                  miktar: 0
                }
              ],
            
            }))
          }
        ]
      }
    };
    console.log("Gönderilecek JSON Payload:", JSON.stringify(jsonPayload, null, 2));
    try {
      const response = await axiosLink.post(apiURL, jsonPayload);
      const { StatusCode, ErrorMessage, errorText } = response.data.result[0];
      
    
      if (StatusCode === 200) {
        await clearAsyncStorage();
        setIsSaved(true);
        Alert.alert(
            "Başarılı",
            "Veriler başarıyla kaydedildi.",
            [
                {
                    text: "Tamam",
                    onPress: () => {
                      navigation.replace('AlinanSiparis');
                    }
                }
            ],
          
        );
      } else {
        Alert.alert("Hata", ErrorMessage || errorText || "Bilinmeyen bir hata oluştu.");
      }
      
      console.log("apiURL",response);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Alert.alert('Hata', 'Veriler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }finally {
      setLoading(false); 
    }
  };

  return (
  <View style={MainStyles.container}>
      <View style={MainStyles.vadeContainer}>
          <Text style={MainStyles.vadeText}>Ortalama Vade: {vadeData ? new Date(vadeData).toLocaleDateString() : ''}</Text>
      </View>
      <FlatList
        data={addedAlinanSiparisProducts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Stok_Kod}-${index}`}
      />

    {/* Apiye Giden Değerler 
      <View style={MainStyles.faturaBilgileriContainer}>
        <Text style={MainStyles.fontSize11}>sip_evrakno_seri: {alinanSiparis.sip_evrakno_seri}</Text>
        <Text style={MainStyles.fontSize11}>sip_evrakno_sira: {alinanSiparis.sip_evrakno_sira}</Text>
        <Text style={MainStyles.fontSize11}>sip_tip: {alinanSiparis.sip_tip}</Text>
        <Text style={MainStyles.fontSize11}>sip_cins: {alinanSiparis.sip_cins}</Text>
        <Text style={MainStyles.fontSize11}>sip_tarih: {alinanSiparis.sip_tarih}</Text>
        <Text style={MainStyles.fontSize11}>sip_musteri_kod: {alinanSiparis.sip_musteri_kod}</Text>
        <Text style={MainStyles.fontSize11}>sip_cari_unvan1: {alinanSiparis.sip_cari_unvan1}</Text>
        <Text style={MainStyles.fontSize11}>sip_adresno: {alinanSiparis.sip_adresno}</Text>
        <Text style={MainStyles.fontSize11}>sip_projekodu: {alinanSiparis.sip_projekodu}</Text>
        <Text style={MainStyles.fontSize11}>sip_opno: {alinanSiparis.sip_opno}</Text>
        <Text style={MainStyles.fontSize11}>sip_depono: {alinanSiparis.sip_depono}</Text>
        <Text style={MainStyles.fontSize11}>sip_stok_sormerk: {alinanSiparis.sip_stok_sormerk}</Text>
      </View>
    {/* Apiye Giden Değerler */}

    {/* Ürün İşlem Seçim */}
      <View style={{ flex: 1 }}>
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
        
        <EditAlinanSiparisProductModal
          selectedProduct={selectedProduct}
          modalVisible={editModalVisible}
          setModalVisible={setEditModalVisible}
          setAddedAlinanSiparisProducts={setAddedAlinanSiparisProducts}
        />
      </View>
    {/* Ürün İşlem Seçim */}

    {/* Sipariş Toplam Hesap */}
    <View style={MainStyles.containerstf}>
    <View style={MainStyles.summaryContainer}>
      <Text style={MainStyles.headerText}>Sipariş Özeti</Text>
      <Text style={MainStyles.totalText}>Satır Sayısı: {addedAlinanSiparisProducts.length}</Text>
    </View>
    
    <View style={MainStyles.totalsContainer}>
      <View style={MainStyles.rowContainerOnizleme}>
        <Text style={MainStyles.totalText}>Net Fiyat:</Text>
        <Text style={MainStyles.amountText}>
        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateSubTotal() - calculateIskonto())}
      </Text>
      </View>
      <View style={MainStyles.rowContainerOnizleme}>
        <Text style={MainStyles.totalText}>Ara Toplam:</Text>
        <Text style={MainStyles.amountText}>
          {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateSubTotal())}
        </Text>
      </View>
      <View style={MainStyles.rowContainerOnizleme}>
        <Text style={MainStyles.totalText}>İskonto Toplam:</Text>
        <Text style={MainStyles.amountText}>{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateIskonto())}</Text>
      </View>
      <View style={MainStyles.rowContainerOnizleme}>
        <Text style={MainStyles.totalText}>Vergi Toplam:</Text>
        <Text style={MainStyles.amountText}>{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateTax())} </Text>
      </View>
      <View style={MainStyles.rowContainerOnizleme}>
        <Text style={MainStyles.totalText}>Yekün:</Text>
        <Text style={MainStyles.amountTextYekun}>{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateYekun())} </Text>
      </View>
    </View>
  </View>
{/* Sipariş Toplam Hesap */}

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
          <ActivityIndicatorBase size="large" color="#fff" />
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

export default AlinanSiparisOnizleme;
