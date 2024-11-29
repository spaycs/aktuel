import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
        const temsilciKod = defaults[0]?.IQ_MikroUserId; // authData'dan IQ Kod alın
        if (!temsilciKod) return;

        const response = await axiosLinkMain.get(`/Api/Kullanici/MenuIzin?kod=${temsilciKod}`);
        const izinData = response.data[0]; // İlk gelen veriyi alıyoruz
        setMenuIzinleri(izinData);

        // Eğer tüm menülere erişim izni 0 ise, erişim izni olmadığını belirleyelim
        const hasAnyAccess = Object.values(izinData).some((value) => value === 1);
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

  const renderButton = (title, screen, izinKey) => {
    const hasPermission = menuIzinleri && menuIzinleri[izinKey] === 1;

    return (
      <TouchableOpacity
        key={izinKey}
        style={[styles.card, !hasPermission && styles.disabledCard]}
        onPress={() => handlePress(screen, izinKey)}
        disabled={!hasPermission}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, !hasPermission && styles.disabledCardText]}>
            {title}
          </Text>
          <Text style={styles.cardSubtitle}>
            {!hasPermission ? 'Erişim Yok' : 'Rapor Detayına Git'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderButton('Cari Bakiye Yaşlandırma Aylık', 'CariBakiyeYaslandirmaAylik', 'IQM_CariBakiyeYasladirmaAylik')}
      {renderButton('Cari Bakiye Yasladirma Tekli', 'CariBakiyeYasladirmaCoklu', 'IQM_CariBakiyeYasladirmaCoklu')}
      {renderButton('Extre Föy', 'ExtreFoy', 'IQM_ExtreFoy')}
      {renderButton('Neler Sattık', 'NelerSattik', 'IQM_NelerSattik')}
      {renderButton('Krediler Özet', 'KredilerOzet', 'IQM_KredilerOzet')}
      {renderButton('Çek Senet Listesi', 'CekSenetListesi', 'IQM_CekSenetListesi')}
      {renderButton('Envanter Maliyet', 'EnvanterMaliyet', 'IQM_EnvanterMaliyetRaporu')}
      {renderButton('Kasa Borç', 'KasaBorc', 'IQM_KasaRaporuBorc')}
      {renderButton('Kasa Alacak', 'KasaAlacak', 'IQM_KasaRaporuAlacak')}
      {renderButton('Banka Bakiyeleri', 'BankaBakiyeleri', 'IQM_BankaBakiyeleri')}
      {renderButton('Yıllık Rapor', 'YillikRapor', 'IQM_YillikRapor')}
      {renderButton('Sipariş Karşılama', 'SiparisKarsilama', 'IQM_SiparisKarsilama')}
      {renderButton('Sorumluluk Bazında Bekleyen Sipariş', 'SorumlulukBazindaBekleyenSiparis', 'IQM_SrmBazindaBekleyenSiparis')}
      {renderButton('Tedarikçi Bazında Satış Karşılama', 'TedarikciBazindaSatisKarsilama', 'IQM_TdrkcBazindaSatisKarsilastirma')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledCard: {
    backgroundColor: '#dfdfdf', // Soluk renk
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 5,
  },
  disabledCardText: {
    color: '#999',
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.black,
  },
});

export default Raporlar;
