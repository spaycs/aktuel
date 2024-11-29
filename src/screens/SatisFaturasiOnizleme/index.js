import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, TextInput, Alert, SafeAreaView, ActivityIndicator,  } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { Iptal, Kaydet, Yazdir } from '../../res/images';
import { ScrollView } from 'react-native-virtualized-view'
import { useAuth } from '../../components/userDetail/Id';
import axiosLink from '../../utils/axios';
import axiosLinkMain from '../../utils/axiosMain';
import EditProductModal from '../../context/EditProductModal';
import EditSatisFaturasiProductModal from '../../context/EditSatisFaturasiProductModal';
import { useNavigation } from '@react-navigation/native';
import { useAuthDefault } from '../../components/DefaultUser';
import CustomHeader from '../../components/CustomHeader';
import FastImage from 'react-native-fast-image';

const SatisFaturasiOnizleme = () => {
  const { authData, updateAuthData } = useAuth();
  const { defaults } = useAuthDefault();
  const [sth_plasiyer_kodu, setSth_plasiyer_kodu] = useState('');
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
  const [editSatisFaturasiModalVisible, setEditSatisFaturasiModalVisible] = useState(false);
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // defaults içindeki IQ_MikroPersKod değerini sth_plasiyer_kodu'na atayın
    if (defaults && defaults[0].IQ_MikroPersKod) {
      setSth_plasiyer_kodu(defaults[0].IQ_MikroPersKod);
    }
  }, [defaults]);

   // Toplam Hesaplamalar
   useEffect(() => {
    if (addedProducts.length > 0) {
      const selectedProduct = addedProducts[0]; 
  
      if (selectedProduct) {
        // sth_miktar'ı string'e çeviriyoruz
        const newQuantity = parseFloat(selectedProduct.sth_miktar.toString().replace(',', '.')) || 0;
        const birimKDV = parseFloat(selectedProduct.Birim_KDV) || 0;
  
        const calculatedValue = (newQuantity * birimKDV).toFixed(2);
        setCalculatedTutar(calculatedValue);
      }
    }
  }, [addedProducts]);



  const calculateIskonto = (selectedProductId = null) => {
    // Eğer belirli bir ürün için iskonto hesaplanacaksa
    if (selectedProductId) {
      const product = addedProducts.find((p) => p.id === selectedProductId);
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
      const totalDiscount = addedProducts.reduce((sum, product) => {
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
  
  const calculateTotalTax = () => {
    let totalTax = 0;
  
    addedProducts.forEach((product) => {
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
    addedProducts.forEach((product) => {
      araToplam += product.sth_miktar * product.sth_tutar;
    });
    return araToplam;
  };

  const calculateTax = () => {
    let vergiToplam = 0;
    addedProducts.forEach((product) => {
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
    const productToEdit = addedProducts.find(product => product.id === productId);
    if (!productToEdit) return;
  
    // Seçili ürünü state'e kaydet
    setSelectedProduct(productToEdit);
  
    // Modal ID'ye göre uygun modalı aç
    switch (productToEdit.modalId) {
      case 1:
      case 2:
        // Eğer modalId 1 veya 2 ise EditSatisFaturasiProductModal'ı aç
        setEditProductModalVisible(false);
        setEditSatisFaturasiModalVisible(true);
        setModalVisible(false);
        break;
  
      case 0:
        // Eğer modalId 0 ise EditProductModal'ı aç
        setEditSatisFaturasiModalVisible(false);
        setEditProductModalVisible(true);
        setModalVisible(false);
        break;
  
      default:
        // Eğer modalId diğer değerlerde ise varsayılan bir işlem veya hata durumu
        console.warn('Bilinmeyen modalId değeri:', productToEdit.modalId);
        break;
        
    }
  };

  const deleteProduct = () => {
    if (!selectedProduct) return;
  
    const updatedProducts = addedProducts.filter(product => product.id !== selectedProduct.id);
    setAddedProducts(updatedProducts);
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
    if (faturaBilgileri.cha_kod) {
      const fetchVadeData = async () => {
        try {
          const response = await axiosLinkMain.get(`/Api/Cari/CariOrtalamaVade?cari=${faturaBilgileri.cha_kod}`);
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
  }, [faturaBilgileri.cha_kod]);
// Ortalama Vade Hesabı

// Geri gitme işlemi
  const handleCancel = () => {
    navigation.goBack(); 
  };
// Geri gitme işlemi

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
  const apiURL = '/Api/APIMethods/FaturaKaydetV3';

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
      sth_tarih: faturaBilgileri.cha_tarihi,
      sth_tip: 1,
      sth_cins: sthCins,
      sth_normal_iade: faturaBilgileri.cha_normal_Iade,
      sth_evraktip: 4,
      sth_evrakno_seri: faturaBilgileri.cha_evrakno_seri,
      sth_stok_kod: product.Stok_Kod,
      sth_cari_cinsi: faturaBilgileri.cha_cari_cins,
      sth_cari_kodu: faturaBilgileri.cha_kod,
      sth_exim_kodu: faturaBilgileri.cha_exim_kodu,
      sth_miktar: product.sth_miktar,
      sth_birim_pntr: product.sth_birim_pntr,
      sth_tutar: product.total,
      sth_vergi: product.sth_vergi,
      sth_aciklama: product.aciklama || faturaBilgileri.cha_aciklama,
      sth_cari_srm_merkezi: faturaBilgileri.cha_srmrkkodu,
      sth_stok_srm_merkezi: faturaBilgileri.cha_srmrkkodu,
      sth_subeno: 0,
      sth_iskonto1: product.sth_iskonto1,
      sth_iskonto2: product.sth_iskonto2,
      sth_iskonto3: product.sth_iskonto3,
      sth_iskonto4: product.sth_iskonto4,
      sth_iskonto5: product.sth_iskonto5,
      sth_iskonto6: product.sth_iskonto6,
      sth_isk_mas1: 0,
      sth_giris_depo_no: faturaBilgileri.sth_giris_depo_no,
      sth_cikis_depo_no: faturaBilgileri.sth_cikis_depo_no,
      sth_plasiyer_kodu: sth_plasiyer_kodu,
  };
});

  // Evrakları ve hizmetleri modalId değerine göre kaydet
  let documents = [];

  // Eğer modalId === 0 olan ürünler varsa, sth alanlarıyla kaydet
  if (products.length > 0) {
      const productPayload = {
          cha_tip:  faturaBilgileri.cha_tip,
          cha_cinsi: faturaBilgileri.cha_cinsi, // modalId === 0 olduğu için
          cha_normal_Iade: faturaBilgileri.cha_normal_Iade,
          cha_evrak_tip: faturaBilgileri.cha_evrak_tip,
          cha_cari_cins: faturaBilgileri.cha_cari_cins,
          cha_d_cins: faturaBilgileri.cha_d_cins,
          cha_d_kur: faturaBilgileri.cha_d_kur,
          cha_tarihi: faturaBilgileri.cha_tarihi,
          cha_evrakno_seri: faturaBilgileri.cha_evrakno_seri,
          cha_kod: faturaBilgileri.cha_kod,
          cha_EXIMkodu: faturaBilgileri.cha_exim_kodu,
          cha_projekodu: faturaBilgileri.cha_projekodu,
          cha_srmrkkodu: faturaBilgileri.cha_srmrkkodu,
          cha_vade: faturaBilgileri.cha_vade,
          cha_aciklama: faturaBilgileri.cha_aciklama,
          detay: detailedProducts, // sth alanları
          cha_adres_no: faturaBilgileri.cha_adres_no,
          cha_satici_kodu: sth_plasiyer_kodu,
          evrak_aciklamalari: formatExplanations(),
      };
      documents.push(productPayload);
  }

  // Eğer modalId !== 0 olan hizmetler varsa, her hizmet için ayrı bir payload oluşturun
  if (services.length > 0) {
      services.forEach(service => {
          const kasaHizmetValue = service.modalId === 1 ? 3 : (service.modalId === 2 ? 5 : 0);

          const servicePayload = {
              cha_tip: faturaBilgileri.cha_tip,
              cha_cinsi: 8, // modalId !== 0 olduğu için
              cha_normal_Iade: faturaBilgileri.cha_normal_Iade,
              cha_evrak_tip: faturaBilgileri.cha_evrak_tip,
              cha_cari_cins: 0,
              cha_d_cins: faturaBilgileri.cha_d_cins,
              cha_d_kur: faturaBilgileri.cha_d_kur,
              cha_tarihi: faturaBilgileri.cha_tarihi,
              cha_evrakno_seri: faturaBilgileri.cha_evrakno_seri,
              cha_kod: faturaBilgileri.cha_kod,
              cha_projekodu: faturaBilgileri.cha_projekodu,
              cha_srmrkkodu: faturaBilgileri.cha_srmrkkodu,
              cha_vade: faturaBilgileri.cha_vade,
              cha_EXIMkodu: faturaBilgileri.cha_exim_kodu,
              cha_aciklama: service?.aciklama,
              cha_kasa_hizkod: service?.Stok_Kod || "",
              cha_kasa_hizmet: kasaHizmetValue,
              cha_miktari: service?.sth_miktar || 1,
              cha_aratoplam: service?.total || 0,
              cha_vergipntr: service?.sth_vergi_pntr || 0,
              cha_ft_iskonto1: service?.sth_iskonto1 || 0,
              cha_ft_iskonto2: service?.sth_iskonto2 || 0,
              cha_ft_iskonto3: service?.sth_iskonto3 || 0,
              cha_ft_iskonto4: service?.sth_iskonto4 || 0,
              cha_ft_iskonto5: service?.sth_iskonto5 || 0,
              cha_ft_iskonto6: service?.sth_iskonto6 || 0,
              cha_isk_mas1: "0",
              cha_satici_kodu: sth_plasiyer_kodu,
              evrak_aciklamalari: formatExplanations(),
              cha_adres_no: faturaBilgileri.cha_adres_no,
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
                      navigation.replace('SatisFaturasi');
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
      <View style={MainStyles.vadeContainer}>
          <Text style={MainStyles.vadeText}>Ortalama Vade: {vadeData ? new Date(vadeData).toLocaleDateString() : ''}</Text>
      </View>
      <FlatList
        data={addedProducts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Stok_Kod}-${index}`}
      />

    {/* Apiye Giden Değerler 
      <View style={MainStyles.faturaBilgileriContainer}>
        <Text style={MainStyles.faturaBilgileriText}>cha_evrakno_seri: {faturaBilgileri.cha_evrakno_seri}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_evrakno_sira: {faturaBilgileri.cha_evrakno_sira}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_tip: {faturaBilgileri.cha_tip}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_cinsi: {faturaBilgileri.cha_cinsi}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_normal_iade: {faturaBilgileri.cha_normal_iade}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_evrak_tip: {faturaBilgileri.cha_evrak_tip}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_ticaret_turu: {faturaBilgileri.cha_ticaret_turu}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_tarihi: {faturaBilgileri.cha_tarihi}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_cari_cins: {faturaBilgileri.cha_cari_cins}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_kod: {faturaBilgileri.cha_kod}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_cari_unvan1: {faturaBilgileri.cha_cari_unvan1}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_adres_no: {faturaBilgileri.cha_adres_no}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_projekodu: {faturaBilgileri.cha_projekodu}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_vade: {faturaBilgileri.cha_vade}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_srmrkkodu: {faturaBilgileri.cha_srmrkkodu}</Text>
        <Text style={MainStyles.faturaBilgileriText}>cha_d_cins: {faturaBilgileri.cha_d_cins}</Text>
        <Text style={MainStyles.faturaBilgileriText}>sth_cikis_depo_no: {faturaBilgileri.sth_cikis_depo_no}</Text>
        <Text style={MainStyles.faturaBilgileriText}>sth_cikis_depo_no: {faturaBilgileri.cha_exim_kodu}</Text>
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
        <EditProductModal
          selectedProduct={selectedProduct}
          modalVisible={editProductModalVisible}
          setModalVisible={setEditProductModalVisible}
          setAddedProducts={setAddedProducts}
        />
        <EditSatisFaturasiProductModal
          selectedProduct={selectedProduct}
          modalVisible={editSatisFaturasiModalVisible}
          setModalVisible={setEditSatisFaturasiModalVisible}
          setAddedProducts={setAddedProducts}
        />
      </View>
    {/* Ürün İşlem Seçim */}

     {/* Sipariş Toplam Hesap */}
     <View style={MainStyles.containerstf}>
    <View style={MainStyles.summaryContainer}>
      <Text style={MainStyles.headerText}>Sipariş Özeti</Text>
      <Text style={MainStyles.totalText}>Satır Sayısı: {addedProducts.length}</Text>
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

export default SatisFaturasiOnizleme;
