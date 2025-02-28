import React, { useEffect, useState } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../components/userDetail/Id';
import axiosLinkMain from '../../utils/axiosMain';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import { RNCamera } from 'react-native-camera';
import { Camera } from '../../res/images';
import axiosLink from '../../utils/axios';
import { useNavigation } from '@react-navigation/native';
import { useAuthDefault } from '../../components/DefaultUser';

const DepoOtomasyonu = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [seri, setSeri] = useState('');
  const [siparisListesi, setSiparisListesi] = useState([]);
  const [selectedSiparis, setSelectedSiparis] = useState(null);
  const [miktar, setMiktar] = useState('');
  const [kalanMiktar, setKalanMiktar] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [barkodCameraVisible, setBarkodCameraVisible] = useState(false);
  const [barkod, setBarkod] = useState('');
  const [barkodVerified, setBarkodVerified] = useState(false);
  const [teslimMiktarlari, setTeslimMiktarlari] = useState({});
  const navigation = useNavigation();

  const handleSeriBarkodRead = ({ data }) => {
    console.log("📸 Okunan Barkod:", data);
    
    setSeri(data); 
    setCameraVisible(false);
  
    // State'in güncellendiğinden emin olmak için doğrudan yeni değeri alarak fetchSiparis çağır
    setTimeout(() => {
      fetchSiparis(data);
    }, 100);
  };

  const fetchSiparis = async (seriNumarasi) => {
    const aktifSeri = seriNumarasi || seri; // Eğer parametre yoksa state'ten al
  
    if (!aktifSeri) {
      Alert.alert('Hata', 'Lütfen bir seri numarası girin veya barkod okutun.');
      return;
    }
  
    try {
      const response = await axiosLinkMain.get(`/Api/Siparis/DO_SiparisBilgisiGetir?sipno=${aktifSeri}`);
      setSiparisListesi(response.data || []);
    } catch (error) {
      console.error('Sipariş getirme hatası:', error);
      Alert.alert('Hata', 'Sipariş getirilemedi.');
    }
  };

   // 📌 Teslim edilen miktara göre arka plan rengini belirle
   const getBackgroundColor = (stokKod, toplamMiktar) => {
    const teslimEdilen = teslimMiktarlari[stokKod] || 0;

    if (teslimEdilen === toplamMiktar) {
      return '#6ef173'; // 🟩 Tam teslim edildi
    } else if (teslimEdilen > 0) {
      return '#fdcc69'; // 🟧 Eksik teslim edildi
    } else {
      return '#ff7a7a'; // 🟥 Hiç teslim edilmedi
    }
  };

   // 📌 "Tamam" butonuna basıldığında veriyi hafızaya kaydet
   const handleTamam = () => {
    if (!selectedSiparis || miktar === '') {
      Alert.alert('Hata', 'Lütfen teslim miktarını girin.');
      return;
    }
    const kalanMiktar = selectedSiparis.Miktar - (teslimMiktarlari[selectedSiparis.StokKod] || 0);
    
    if (parseInt(miktar) > kalanMiktar) {
      Alert.alert('Hata', `En fazla ${kalanMiktar} adet teslim edebilirsiniz.`);
      return;
    }

    // 📌 Teslim edilen miktarı güncelle (hafızada tut)
    setTeslimMiktarlari(prev => ({
      ...prev,
      [selectedSiparis.StokKod]: (prev[selectedSiparis.StokKod] || 0) + parseInt(miktar)
    }));

    closePopup();
  };


  const handleEvrakKaydet = async () => {
    const todayDate = new Date().toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    console.log("📆 Günün Tarihi:", todayDate);

    // 🔹 Sadece miktar girilmiş siparişleri filtrele
    const teslimEdilenSiparisler = siparisListesi
      .filter(item => teslimMiktarlari[item.StokKod] > 0) // **Sadece işlem yapılanları al**
      .map(product => {
        const miktar = teslimMiktarlari[product.StokKod] || 0;
        const birimFiyat = parseFloat(product.Birim_Fiyat) || 0;
        const vergi = parseFloat(product.Vergi) || 0;
        const iskonto1 = parseFloat(product.BirimIsk1) || 0;
        const iskonto2 = parseFloat(product.BirimIsk2) || 0;
        const iskonto3 = parseFloat(product.BirimIsk3) || 0;
        const iskonto4 = parseFloat(product.BirimIsk4) || 0;
        const iskonto5 = parseFloat(product.BirimIsk5) || 0;
        const iskonto6 = parseFloat(product.BirimIsk6) || 0;

        return {
          sth_tarih: todayDate,
          sth_stok_kod: product.StokKod,
          sth_miktar: miktar,
          sth_tip: 1,
          sth_cins: 0,
          sth_cari_kodu: product.Cari,
          sth_normal_iade: 0,
          sth_evraktip: 1,
          sth_evrakno_seri: defaults[0]?.IQ_SatisIrsaliyeSeriNo,
          sth_cari_cinsi: 0,
          sth_adres_no: product.AdresNo,
          sth_stok_srm_merkezi: product.SorumlulukM,
          sth_proje_kodu: product.ProjeKod,
          sth_birim_pntr: product.Birim,
          sth_vergi_pntr: product.VergiPntr,
          sth_vergi: miktar * vergi, // 📌 Vergi hesaplama (Miktar * Vergi)
          sth_vergisiz_fl: false,
          sth_iskonto1: miktar * iskonto1, // 📌 İskonto hesaplama (Miktar * BirimIsk1)
          sth_iskonto2: miktar * iskonto2,
          sth_iskonto3: miktar * iskonto3,
          sth_iskonto4: miktar * iskonto4,
          sth_iskonto5: miktar * iskonto5,
          sth_iskonto6: miktar * iskonto6,
          sth_giris_depo_no: product.Depo,
          sth_cikis_depo_no: product.Depo,
          sth_malkbl_sevk_tarihi: todayDate,
          sth_odeme_op: product.OpNo,
          sth_plasiyer_kodu: product.Temsilci,
          sth_tutar: miktar * birimFiyat, // 📌 Tutar hesaplama (Miktar * BirimFiyat)
          sth_belge_no: product.BelgeNo,
          sth_stok_doviz_kuru: product.DovizKur,
          sth_sip_uid: product.Guid,
        };
      });

    if (teslimEdilenSiparisler.length === 0) {
      Alert.alert("Uyarı", "Herhangi bir ürün için miktar girişi yapılmadı.");
      return;
    }

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
            evrak_aciklamalari: "Depo Teslimatı",
            satirlar: teslimEdilenSiparisler
          }
        ]
      }
    };

    console.log("📤 Gönderilecek JSON Payload:", JSON.stringify(jsonPayload, null, 2));

    try {
      const response = await axiosLink.post(`/Api/apiMethods/IrsaliyeKaydetV2`, jsonPayload);

      console.log("📥 API Yanıtı:", response.data);

      if (response.data.result[0].StatusCode === 200) {
        Alert.alert(
          "Başarılı",
          "Tüm teslim edilen siparişler başarıyla kaydedildi.",
          [
            {
              text: "Tamam",
              onPress: async () => {
                // Kullanıcıyı geri yönlendir
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert("Hata", response.data.result[0].ErrorMessage || "Evrak kaydedilemedi.");
      }
    } catch (error) {
      console.error("❌ API Hatası:", error.response ? error.response.data : error.message);
      Alert.alert("Hata", "Evrak kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };


 const updateSiparisMiktarlari = async (siparisler) => {
     try {
         const updatePromises = siparisler.map(async (item) => {
             const miktar = item.sth_miktar;
             const guid = item.sth_sip_uid; // 📌 API'de kullanılacak GUID
 
             const updateUrl = `/Api/Siparis/DO_SiparisTeslimMiktarGuncelle?miktar=${miktar}&guid=${guid}`;
             console.log("📡 Güncelleme API'ye gönderiliyor:", updateUrl);
 
             const response = await axiosLinkMain.post(updateUrl);
 
             console.log("✅ Güncelleme API Yanıtı:", response.data);
         });
 
         // **Tüm isteklerin tamamlanmasını bekle**
         await Promise.all(updatePromises);
     } catch (error) {
         console.error("❌ Sipariş miktar güncelleme hatası:", error.response ? error.response.data : error.message);
         Alert.alert("Hata", "Sipariş miktarları güncellenirken bir hata oluştu.");
     }
 };
  

  const handleBarkodRead = async ({ data }) => {
    setBarkod(data);
    setBarkodCameraVisible(false);
  
    try {
      const response = await axiosLinkMain.get(`/Api/Barkod/BarkodAra?barkod=${data}`);
  
      console.log("📌 API Yanıtı:", response.data);
  
      // API dizininin ilk elemanını al
      const stokKodFromApi = response.data.length > 0 ? response.data[0].Stok_Kod : null;
  
      console.log("📌 API'den gelen Stok Kodu:", stokKodFromApi); 
  
      if (selectedSiparis && stokKodFromApi === selectedSiparis.StokKod) {
        setBarkodVerified(true);
      } else {
        Alert.alert('Hata', 'Barkod eşleşmedi, lütfen tekrar deneyin.');
        setBarkod('');
        setBarkodVerified(false);
      }
    } catch (error) {
      console.error('❌ Barkod API hatası:', error);
      Alert.alert('Hata', 'Barkod bilgisi getirilemedi.');
      setBarkod('');
      setBarkodVerified(false);
    }
  };
  
  
  // 📌 Teslim Miktarı Güncelleme
  const handleTeslimEt = async () => {
    if (!selectedSiparis || miktar === '') {
      Alert.alert('Hata', 'Lütfen teslim miktarını girin.');
      return;
    }
    const kalanMiktar = selectedSiparis.Miktar - (teslimMiktarlari[selectedSiparis.StokKod] || 0);
    
    if (parseInt(miktar) > kalanMiktar) {
      Alert.alert('Hata', `En fazla ${kalanMiktar} adet teslim edebilirsiniz.`);
      return;
    }

    try {
      await axiosLinkMain.post(`/Api/Siparis/TeslimEt`, {
        stokKodu: selectedSiparis.StokKod,
        teslimMiktar: parseInt(miktar),
      });

      Alert.alert('Başarılı', 'Teslimat başarıyla güncellendi.');

      // 📌 Teslim edilen miktarı güncelle
      setTeslimMiktarlari(prev => ({
        ...prev,
        [selectedSiparis.StokKod]: (prev[selectedSiparis.StokKod] || 0) + parseInt(miktar)
      }));

      closePopup();
    } catch (error) {
      console.error('Teslimat güncelleme hatası:', error);
      Alert.alert('Hata', 'Teslimat güncellenemedi.');
    }
  };

  // 📌 Popup açılınca seçilen siparişi kaydet
  const openPopup = (siparis) => {
    const teslimEdilen = teslimMiktarlari[siparis.StokKod] || 0;
    const kalan = siparis.Miktar - teslimEdilen;

    setSelectedSiparis(siparis);
    setKalanMiktar(kalan);
    setMiktar('');
    setPopupVisible(true);
    setBarkodVerified(false);
    setBarkod('');
  };

  // 📌 Popup kapatma fonksiyonu
  const closePopup = () => {
    setPopupVisible(false);
    setSelectedSiparis(null);
    setBarkodVerified(false);
    setBarkod('');
  };

  useEffect(() => {
    console.log("🔍 barkodCameraVisible:", barkodCameraVisible);
  }, [barkodCameraVisible]);


  const openBarkodCamera = () => {
    console.log("📸 Barkod Kamerası Açılmaya Çalışılıyor...");
  
    // Popup'ı kapatmadan direkt barkod kamerasını aç
    setTimeout(() => {
      console.log("📸 Barkod Kamerası Açılıyor...");
      setBarkodCameraVisible(true);
    }, Platform.OS === 'ios' ? 500 : 0); // 📌 iOS için 500ms gecikme ekledik
  };
  
  
  
 // 🔹 FlatList için renderItem fonksiyonu
 const renderSiparisItem = ({ item }) => {
  const teslimEdilen = teslimMiktarlari[item.StokKod] || 0;
  const kalanMiktar = item.Miktar - teslimEdilen;

  return (
    <TouchableOpacity onPress={() => openPopup(item)}>
      <View style={[MainStyles.itemContainerCariList, { backgroundColor: getBackgroundColor(item.StokKod, item.Miktar) }]}>
        <View style={MainStyles.itemTextContainer}>
          <Text style={MainStyles.itemText}>Cari Unvan: {item.CariUnvan}</Text>
          <Text style={MainStyles.itemText}>Stok Kodu: {item.StokKod}</Text>
          <Text style={MainStyles.itemText}>Stok Adı: {item.StokAd}</Text>
          <Text style={MainStyles.itemText}>Miktar: {item.Miktar}</Text>
          <Text style={MainStyles.itemText}>Teslim Edilen: {teslimEdilen}</Text>
          <Text style={MainStyles.itemText}>Kalan Miktar: {kalanMiktar}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
    style={[MainStyles.flex1, MainStyles.backgroundColorWhite]}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // iOS için varsayılan offset
  >
  <ScrollView flex={1} scrollEnabled>
    <View style={MainStyles.slContainer}>
 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.slinputUrunAra}
          placeholder="Evrak Seri Sıra Okut"
          value={seri}
          onChangeText={setSeri}
          placeholderTextColor={colors.placeholderTextColor}
        />
        <TouchableOpacity onPress={() => setCameraVisible(true)} style={MainStyles.slbuttonUrunAra}>
          <Camera />
        </TouchableOpacity>
      </View>

      <TouchableOpacity  onPress={() => fetchSiparis()} style={MainStyles.depoOtomasyonuButton}>
        <Text style={MainStyles.depoOtomasyonuButtonText}>Getir</Text>
      </TouchableOpacity>

      <Text style={MainStyles.depoOtomasyonuTitle}>Sipariş Ürün Bilgileri</Text>

      <FlatList 
        data={siparisListesi}
        renderItem={renderSiparisItem}
        keyExtractor={(item, index) => `${item.StokKod}-${index}`}
      />

      {/* 📌 Kamera Modal */}
      <Modal visible={cameraVisible} animationType="slide">
            <View style={MainStyles.cameraContainer}>
            <Text style={MainStyles.barcodeTitle}>Barkodu Okutunuz</Text>
            <View style={MainStyles.cameraWrapper}>
                <RNCamera
                  style={{ flex: 1 }}
                  onBarCodeRead={handleSeriBarkodRead}
                  captureAudio={false}
                  androidCameraPermissionOptions={{
                    title: 'Kamera İzni',
                    message: 'Barkod okutmak için kameranıza erişim izni vermelisiniz.',
                    buttonPositive: 'Tamam',
                    buttonNegative: 'İptal',
                  }}
                />
                <View style={MainStyles.overlay}>
                    <View style={MainStyles.overlayMask} />
                      <View style={MainStyles.overlayBox}>
                        <View style={MainStyles.overlayLine} />
                      </View>
                    </View>
                </View>
              </View>
            <TouchableOpacity onPress={() => setCameraVisible(false)} style={MainStyles.kapat}>
              <Text style={MainStyles.kapatTitle}>Kapat</Text>
            </TouchableOpacity>
      </Modal>

     {/* 📌 Popup Modal */}
     <Modal visible={popupVisible} transparent>
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // iOS için varsayılan offset
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={MainStyles.modalContainer}>
          <View style={MainStyles.modalContent}>
            {selectedSiparis && (
              <>
                <Text style={MainStyles.itemText}>
                  {selectedSiparis.StokKod} - {selectedSiparis.StokAd} -   Kalan Miktar: {kalanMiktar}
                </Text>

                {/* 📌 Barkod Okutma veya Elle Girme */}
                <TouchableOpacity
                  onPress={openBarkodCamera} 
                  style={MainStyles.depoOtomasyonuBarkodButton}
                >
                  <Text style={MainStyles.doButtonText}>Barkod Okutun</Text>
                </TouchableOpacity>


                <TextInput
                  style={MainStyles.depoOtomasyonInputUrunAra}
                  placeholder="Barkodu Elle Girin veya Kameradan Okutun"
                  placeholderTextColor={colors.black}
                  value={barkod}
                  onChangeText={setBarkod}
                  keyboardType="numeric"
                />

                {/* 📌 Onayla Butonu */}
                <TouchableOpacity onPress={() => handleBarkodRead({ data: barkod })} style={MainStyles.fullWidthButton}>
                  <Text style={MainStyles.depoOtomasyonButtunText}>Ürünü Getir</Text>
                </TouchableOpacity>

                {/* {barkodVerified && ( */}
                  <TextInput
                    style={MainStyles.depoOtomasyonInputUrunAra}
                    placeholder="Teslim Miktarı"
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    value={miktar}
                    onChangeText={setMiktar}
                  />
                {/*)}*/}

                {/* 📌 Tamam ve Vazgeç Butonları  */}
                <View style={MainStyles.doButtonRow}>
                  <TouchableOpacity onPress={handleTamam} style={MainStyles.halfWidthButton}>
                    <Text style={MainStyles.doButtonText}>Tamam</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closePopup} style={MainStyles.halfWidthButton}>
                    <Text style={MainStyles.doButtonText}>Vazgeç</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
      </Modal>

      {barkodCameraVisible && (
  <Modal
    visible={barkodCameraVisible}
    animationType="slide"
    presentationStyle="fullScreen" // 📌 iOS için tam ekran yapıyoruz
    transparent={false} // 📌 Arka planın düzgün açıldığını doğrulamak için
    onShow={() => console.log("📸 Barkod Kamerası Açıldı!")}
    onRequestClose={() => setBarkodCameraVisible(false)}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}> 
      {/* 📌 Modal gerçekten açılıyor mu kontrol için arka plan rengi ekledik */}
      <Text style={{ color: 'white', textAlign: 'center', marginTop: 20, fontSize: 18 }}>
        📸 Barkodu Okutunuz (Modal Açıldı mı?)
      </Text>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {console.log("🔍 Kamera Render Ediliyor...")}
        <RNCamera
          style={{ width: '100%', height: '100%', flex: 1 }} // 📌 Kamera tam ekran olacak
          onBarCodeRead={handleBarkodRead}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Kamera İzni',
            message: 'Barkod okutmak için kameranıza erişim izni vermelisiniz.',
            buttonPositive: 'Tamam',
            buttonNegative: 'İptal',
          }}
        />
      </View>

      {/* 📌 Kapat Butonu */}
      <TouchableOpacity 
        onPress={() => setBarkodCameraVisible(false)} 
        style={{
          backgroundColor: 'red', 
          padding: 15, 
          alignSelf: 'center', 
          borderRadius: 10,
          marginBottom: 20
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Kapat</Text>
      </TouchableOpacity>
    </View>
  </Modal>
)}



     
          
    </View>
    </ScrollView>
    <View style={MainStyles.saveContainer}>
              <TouchableOpacity
                style={MainStyles.saveButton}
                onPress={handleEvrakKaydet}
              >
                <Text style={MainStyles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MainStyles.saveButton}
                onPress={navigation.goBack}
              >
                <Text style={MainStyles.saveButtonText}>Vazgeç</Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
  );
};

export default DepoOtomasyonu;
