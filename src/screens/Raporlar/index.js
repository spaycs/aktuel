import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuth } from '../../components/userDetail/Id';
import { useAuthDefault } from '../../components/DefaultUser';

const Raporlar = ({ navigation }) => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [menuIzinleri, setMenuIzinleri] = useState(null); // Menü izinleri için state
  const [hasAccess, setHasAccess] = useState(true); // Erişim izni kontrolü

  
  useEffect(() => {
    const fetchMenuIzinleri = async () => {
      try {
        const temsilciKod = defaults[0].IQ_Kod; // authData'dan IQ Kod alın
        const response = await axiosLinkMain.get(`/Api/Kullanici/MenuIzin?kod=${temsilciKod}`);
        const izinData = response.data[0]; // İlk gelen veriyi alıyoruz
        setMenuIzinleri(izinData);

        // Eğer tüm menülere erişim izni 0 ise, erişim izni olmadığını belirleyelim
        const hasAnyAccess = Object.values(izinData).some(value => value === 1);
        setHasAccess(hasAnyAccess);
      } catch (error) {
        console.error('Menü izinleri alınırken hata oluştu:', error);
        setHasAccess(false); // Hata durumunda erişim izni olmadığını belirleyelim
      }
    };

    fetchMenuIzinleri(); // Menü izinlerini fetch et
  }, [authData]);

  const handlePress = (screen, izinKey) => {
    if (menuIzinleri && menuIzinleri[izinKey] === 1) {
      navigation.navigate(screen);
    } else {
      Alert.alert('Erişim Hatası', 'Bu menüye erişim izniniz bulunmamaktadır. Yöneticiniz ile iletişime geçiniz.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
    {/* Cari Bakiye Yaşlandırma Aylık */}
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('CariBakiyeYaslandirmaAylik', 'IQM_CariBakiyeYasladirmaAylik')}
    >
      <Text>Cari Bakiye Yaşlandırma Aylık</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('CariBakiyeYasladirmaCoklu', 'IQM_CariBakiyeYasladirmaCoklu')}
    >
      <Text>Cari Bakiye Yasladirma Tekli</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('ExtreFoy', 'IQM_ExtreFoy')}
    >
      <Text>Extre Föy</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('NelerSattik', 'IQM_NelerSattik')}
    >
      <Text>Neler Sattık</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('KredilerOzet', 'IQM_KredilerOzet')}
    >
      <Text>Krediler Özet</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('CekSenetListesi', 'IQM_CekSenetListesi')}
    >
      <Text>Çek Senet Listesi</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('EnvanterMaliyet', 'IQM_EnvanterMaliyetRaporu')}
    >
      <Text>Envanter Maliyet</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('KasaBorc', 'IQM_KasaRaporuBorc')}
    >
      <Text>Kasa Borç</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('KasaAlacak', 'IQM_KasaRaporuAlacak')}
    >
      <Text>Kasa Alacak</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('BankaBakiyeleri', 'IQM_BankaBakiyeleri')}
    >
      <Text>Banka Bakiyeleri</Text>
    </TouchableOpacity>

    {/* 
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('PatronEkrani', 'IQM_PatronEkrani')}
    >
      <Text>Patron Ekranı</Text>
    </TouchableOpacity>
    */}
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('YillikRapor', 'IQM_YillikRapor')}
    >
      <Text>Yıllık Rapor</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('SiparisKarsilama', 'IQM_YillikRapor')}
    >
      <Text>Sipariş Karşılama</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('SorumlulukBazindaBekleyenSiparis', 'IQM_YillikRapor')}
    >
      <Text>Sorumluluk Bazında Bekleyen Sipariş</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress('TedarikciBazindaSatisKarsilama', 'IQM_YillikRapor')}
    >
      <Text>Tedarikçi Bazında Satış Karşılama</Text>
    </TouchableOpacity>
    
  </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 20,
  backgroundColor: colors.white,
},
button: {
  height: 40,
  marginBottom: 10,
  borderRadius: 10,
  backgroundColor: colors.textInputBg,
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default Raporlar;