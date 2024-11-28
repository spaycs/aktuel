import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainStyles } from '../../res/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlinanSiparis, Alisİrsaliyesi, Back, BeklenenOdeme, CariList, FiyatGor, DepolarArasiSevkFisi, DepoSayim, Doviz, Ekle,GunlukDurum, GunlukKazanc, GunlukSiparis, GunlukStardant, MikroIqTek, Rapor, SarfMalzeme, SatinAlmaTalepFisi, SatisFaturasi, Satisİrsaliyesi, SezginYilmaz, SMStokListele, StokList, TahsilatTediye, TeklifFisi } from '../../res/images';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { useFocusEffect } from '@react-navigation/native';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuthDefault } from '../../components/DefaultUser';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { color: colors.black };

const Home = ({ navigation }) => {  //tset4
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [gunlukDurum, setGunlukDurum] = useState(null); // Günlük durum için state
  const [menuIzinleri, setMenuIzinleri] = useState(null); // Menü izinleri için state
  const [hasAccess, setHasAccess] = useState(true); // Erişim izni kontrolü
  const [gunlukKazancVerileri, setGunlukKazancVerileri] = useState([]); 
  const [sohbetCount, setSohbetCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const temsilciId =  defaults[0].IQ_MikroUserId;
        const response = await axiosLinkMain.get(`/Api/Sohbet/SohbetVarmi?kod=${temsilciId}`);
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setSohbetCount(data.length); 
        } else { 
          setSohbetCount(0); 
        }
      } catch (error) {
        console.error('API2 çağrısı başarısız oldu:', error);
      }
    }, 2000000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchMenuIzinleri = async () => {
      try {
        if (defaults.length > 0) {
          const temsilciKod = defaults[0].IQ_MikroUserId;
          const response = await axiosLinkMain.get(`/Api/Kullanici/MenuIzin?kod=${temsilciKod}`);
          const izinData = response.data[0];
          setMenuIzinleri(izinData);
        }
      } catch (error) {
        console.error('Menü izinleri alınırken hata oluştu:', error);
      }
    };

    fetchMenuIzinleri();
  }, [defaults]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.isFocused()) {
          Alert.alert(
            'Çıkmak Üzeresiniz',
            'Uygulamadan çıkmak istediğinizden emin misiniz?',
            [
              { text: 'Evet', onPress: () => BackHandler.exitApp() },
              { text: 'Hayır', style: 'cancel' },
            ],
            { cancelable: false }
          );
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    const fetchGunlukDurum = async () => {
      try {
        if (!defaults || !defaults[0].IQ_MikroPersKod) {
          console.log('IQ_MikroPersKod değeri bulunamadı, API çağrısı yapılmadı.');
          return;
        }
  
        const temsilciId = defaults[0].IQ_MikroPersKod;
  
        const response = await axiosLinkMain.get(`/Api/Raporlar/GunlukDurum?temsilci=${temsilciId}`);
        setGunlukDurum(response.data[0]); // Gelen ilk veriyi state'e set edin
      } catch (error) {
        console.error('Günlük durum verisi alınırken hata oluştu:', error);
      }
    };
  
    const fetchMenuIzinleri = async () => {
      try {
        if (!defaults || !defaults[0].IQ_MikroUserId) {
          console.log('test', defaults[0].IQ_MikroUserId)
          console.log('IQ_MikroUserId değeri bulunamadı, API çağrısı yapılmadı.');
          return;
        }
  
        const temsilciKod = defaults[0].IQ_MikroUserId;
  
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
  
    const fetchGunlukKazancVerileri = async () => {
      try {
        if (!defaults || !defaults[0].IQ_MikroPersKod) {
          console.log('IQ_MikroPersKod değeri bulunamadı, API çağrısı yapılmadı.');
          return;
        }
  
        const temsilciId = defaults[0].IQ_MikroPersKod;
  
        const response = await axiosLinkMain.get(`/Api/Raporlar/GunlukDurum?temsilci=${temsilciId}`);
        const apiData = response.data; // API'den gelen tüm veriyi al
  
        // API'den gelen veriyi uygun formata dönüştür
        const formattedData = apiData.map((item) => ({
          Tip: item.Tip, // Tip verisi
          Deger: item.Deger, // Deger verisi
        }));
  
        setGunlukKazancVerileri(formattedData); // Dönüştürülmüş veriyi state'e set et
      } catch (error) {
        console.error('Günlük kazanç verileri alınırken hata oluştu:', error);
      }
    };
  
    if (defaults && defaults[0]) {
      fetchGunlukDurum(); // Component mount olduğunda API çağrısı yap
      fetchMenuIzinleri(); // Menü izinlerini fetch et
      fetchGunlukKazancVerileri(); // Günlük kazanç verilerini fetch et
    } else {
      console.log('Defaults2 henüz mevcut değil, API çağrısı yapılmadı.');
    }
  }, [defaults]);
  

  const menuItems = [
    { key: '1', title: 'Stok Listesi', icon: <StokList width={25} height={25} />, screen: 'StokList', izinKey: 'IQM_StokListesi', color: '#D6D6D6' },
    { key: '2', title: 'Cari Listesi', icon: <CariList width={25} height={25} />, screen: 'CariList', izinKey: 'IQM_CariListesi', color: '#D6D6D6' },
    { key: '3', title: 'Satış Faturası', icon: <SatisFaturasi width={25} height={25} />, screen: 'SatisFaturasi', izinKey: 'IQM_SatisFaturasi', color: '#D6D6D6' },
    { key: '4', title: 'Alınan Sipariş', icon: <AlinanSiparis width={25} height={25} />, screen: 'AlinanSiparis', izinKey: 'IQM_AlınanSiparis', color: '#D6D6D6' },
    { key: '5', title: 'Satış İrsaliyesi', icon: <Satisİrsaliyesi width={25} height={25} />, screen: 'SatisIrsaliyesi', izinKey: 'IQM_SatisIrsaliyesi', color: '#D6D6D6' },
    { key: '6', title: 'Alış İrsaliyesi', icon: <Alisİrsaliyesi width={25} height={25} />, screen: 'AlisIrsaliyesi', izinKey: 'IQM_AlisIrsaliyesi', color: '#D6D6D6' },
    { key: '7', title: 'Tahsilat Tediye', icon: <TahsilatTediye width={25} height={25} />, screen: 'TahsilatTediye', izinKey: 'IQM_TahsilatTediye', color: '#D6D6D6' },
    { key: '9', title: 'Depolar Arası S.Fişi', icon: <DepolarArasiSevkFisi width={25} height={25} />, screen: 'DepolarArasiSevkFisi', izinKey: 'IQM_DepolarASF', color: '#D6D6D6' },
    { key: '10', title: 'Depo Sayım', icon: <DepoSayim width={25} height={25} />, screen: 'DepoSayim', izinKey: 'IQM_DepoSayim', color: '#D6D6D6' },
    { key: '15', title: 'Sarf Malzeme', icon: <SarfMalzeme width={25} height={25} />, screen: 'SarfMalzeme', izinKey: 'IQM_SarfMalzeme', color: '#D6D6D6' },
    { key: '8', title: 'Teklif Fişi', icon: <TeklifFisi width={25} height={25} />, screen: 'TeklifFisi', izinKey: 'IQM_TeklifFisi', color: '#D6D6D6' },
    { key: '12', title: 'Raporlar', icon: <Rapor width={25} height={25} />, screen: 'Raporlar', izinKey: 'IQM_Raporlar', color: '#D6D6D6' },
    { key: '13', title: 'Stok Ekle', icon: <Ekle width={25} height={25} />, screen: 'StokEkleme', izinKey: 'IQM_StokEkle', color: '#D6D6D6' },
    { key: '14', title: 'Cari Ekle', icon: <Ekle width={25} height={25} />, screen: 'CariEkleme', izinKey: 'IQM_CariEkle', color: '#D6D6D6' },
    { key: '11', title: 'Patron Raporu', icon: <GunlukDurum width={25} height={25} />, screen: 'PatronRaporu', izinKey: 'IQM_PatronEkrani', color: '#D6D6D6' },
    { key: '16', title: 'Satın Alma Talep Fişi', icon: <SatinAlmaTalepFisi width={25} height={25} />, screen: 'SatinAlmaTalepFisi', izinKey: 'IQM_SatinAlmaTalepFisi', color: '#D6D6D6' },
    { key: '17', title: 'Fiyat Gör', icon: <FiyatGor width={25} height={25} />, screen: 'FiyatGor', izinKey: 'IQM_StokListesi', color: '#D6D6D6' },

  ];
  
  const handlePress = (item) => {
    if (menuIzinleri && menuIzinleri[item.izinKey] === 1) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert('Erişim Hatası', 'Bu menüye erişim izniniz bulunmamaktadır. Yöneticiniz ile iletişime geçiniz.');
    }
  };

  const renderItem = ({ item }) => {
    const hasAccess = menuIzinleri && menuIzinleri[item.izinKey] === 1;
    const iconStyle = hasAccess ? MainStyles.iconActive : MainStyles.iconDisabled;
    return (
      <TouchableOpacity
        style={[
          MainStyles.homeButtonContainer,!hasAccess && MainStyles.disabledMenuItem,
          {
            borderColor: item.color,
            borderWidth: 1,
            flex: 1,
            margin: 3,
            alignItems: 'center',
            borderRadius: 5,
            padding: 5
          }
        ]}
        activeOpacity={0.7}
        onPress={() => handlePress(item)}
        disabled={!hasAccess}
      >
         <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
         {React.cloneElement(item.icon, { style: iconStyle })}
         
        </View>
        <View>
        <Text style={[MainStyles.homeButtonTitle, !hasAccess && MainStyles.disabledTitle]}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  {/* 
  useEffect(() => {
    const checkUnsubmittedOrder = async () => {
      try {
        const savedOrder = await AsyncStorage.getItem('alinanSiparis');
        if (savedOrder) {
          const parsedOrder = JSON.parse(savedOrder);
          if (parsedOrder.sip_musteri_kod) { // Eğer `sip_musteri_kod` dolu ise
            Alert.alert(
              'Uyarı',
              'Henüz kaydedilmemiş bir siparişin var',
              [
                {
                  text: 'Siparişe Git',
                  onPress: () => navigation.navigate('AlinanSiparis'),
                },
                {
                  text: 'Kapat',
                  onPress: () => console.log('Alert kapatıldı'),
                  style: 'cancel',
                },
              ],
              { cancelable: true }
            );
          }
        }
      } catch (error) {
        console.error('Error checking unsubmitted order:', error);
      }
    };

    checkUnsubmittedOrder();
  }, [navigation]);
*/}
  return (
    <View style={[MainStyles.flex1, MainStyles.backgroundColorWhite, MainStyles.paddingHorizontal15, MainStyles.justifyContent]}>
       <View style={MainStyles.marginTop5}><Text style={[MainStyles.fontSize14, MainStyles.fontWeightBold, MainStyles.marginBottom10]}>Günlük Durum</Text></View>
      <ScrollView horizontal style={{ maxHeight: 145 }} showsHorizontalScrollIndicator={false}>
  <View style={{ flexWrap: 'wrap' }}>
        {gunlukKazancVerileri.map((item, index) => (
           <View
            key={index} 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              borderRadius: 5,
              borderColor: colors.islembuttongray,
              borderWidth: 1,
              paddingHorizontal: 10,
              marginRight: 10,
              marginBottom: 10,
              width: 200,
            }}
          >
            {/* İlk dört öğe için belirli ikonlar */}
            {index === 0 && <View ><GunlukKazanc width={30} height={30}/></View> }
            {index === 1 && <View ><GunlukSiparis width={30} height={30} /></View>} 
            {index === 2 && <View ><BeklenenOdeme width={30} height={30} /></View>} 
            {index === 3 && <View ><Doviz width={30} height={30} /></View>} 
            
            {/* Diğer öğeler için sabit ikon */}
            {index > 3 && <View ><GunlukStardant width={30} height={30} /></View>}
            
            <View style={MainStyles.marginLeft10}>
              <Text style={[MainStyles.fontSize14, MainStyles.fontWeightBold, MainStyles.textColorBlack]}>
                {item.Deger}
              </Text>
              <Text style={{  fontSize: 12, color: colors.black }}>
              {item.Tip}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>

      <View ><Text style={[MainStyles.fontWeightBold, MainStyles.fontSize14]}>Yönetim</Text></View>
     
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        numColumns={3}
        columnWrapperStyle={[MainStyles.justifySpaceBetween]}
        contentContainerStyle={MainStyles.homeContainerFlatlist}
      />
      <View style={{justifyContent:'center', alignItems:'center', position:'absolute', bottom:1, alignSelf:'center'}}>
       <SezginYilmaz width={80}/>
       </View>
    </View>
  );
  
};

export default Home;
