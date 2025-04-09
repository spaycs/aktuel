import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { AlinanSiparis, Alisİrsaliyesi, Camera, CameraMenu, DepolarArasiSevkFisi, DepoSayim,FiyatGor, Down, Rapor, Right, SatisFaturasi, Satisİrsaliyesi, StokList, TahsilatTediye, TeklifFisi, MikroIQLogin, Patron, SMFiyatGor, SMStokListele, SMSatisYonetimi, SMStokYonetimi, SMFiyatYonetimi, SMRaporlar, SMSatinAlmaYonetimi, SMDepoSayim, SMDepolarArasiSevkFisi, SMAlinanSiparisFisi, SMTahsilatTediye, SMRapor, SMMenu, Back, Left } from '../../res/images'; // Ensure these are React components
import { useAuth } from '../userDetail/Id';
import axiosLink from '../../utils/axios';
import { colors } from '../../res/colors';
import { useAuthDefault } from '../../components/DefaultUser';
import axiosLinkMain from '../../utils/axiosMain';
import { CommonActions } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
  const { authData } = useAuth(); 
  const { defaults } = useAuthDefault();
  const [menuIzinleri, setMenuIzinleri] = useState(null); 
  const [isStokExpanded, setIsStokExpanded] = useState(false); 
  const [isSatisExpanded, setIsSatisExpanded] = useState(false); 
  const [isFinansExpanded, setIsFinansxpanded] = useState(false); 
  const [isSatinAlmaExpanded, setIsSatinAlmaxpanded] = useState(false); 
  const [isCikisYapExpanded, setIsCikisYapExpanded] = useState(false); 
  const [isRaporlarExpanded, setIsRaporlarExpanded] = useState(false); 
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);

  // Çıkış yapma işlemi
  const handleLogout = async () => {
    if (isLoggingOut) return; // Eğer zaten çıkış işlemi devam ediyorsa, tekrar çalıştırma
    setIsLoggingOut(true); // Butonu disable et
    try {
      const response = await axiosLink.post('/Api/apiMethods/APILogoffV2', {
        Mikro: {
          FirmaKodu: authData.FirmaKodu,
          CalismaYili: authData.CalismaYili,
          ApiKey: authData.ApiKey,
          KullaniciKodu: authData.KullaniciKodu,
          Sifre: authData.Sifre,
        },
        KullaniciKodu: authData.KullaniciKodu
      });
  
      if (response.status === 200) {
        Alert.alert('Başarılı', 'Başarıyla çıkış yaptınız.');
  
        props.navigation.closeDrawer();
  
        // Navigasyonu sıfırla ve Login sayfasına yönlendir
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0, 
            routes: [{ name: 'Login' }], 
          })
        );
      } else {
        Alert.alert('Hata', 'Çıkış yapılamadı, lütfen tekrar deneyin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(error);
    } finally {
      setIsLoggingOut(false); // İşlem bittiğinde butonu tekrar aktif hale getir
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <DrawerItemList {...props} />

    {/* Kullanıcı Bilgileri */}
      <View style={{
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: 'row', 
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: colors.textInputBg,
        paddingHorizontal: 10 
      }}>
         <TouchableOpacity style={{}} onPress={() => props.navigation.closeDrawer()}>
          <Left width={16} height={16}/>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}> 
          <MikroIQLogin width={90} height={40} />
        </View>
       
        </View>

    {/* Bilgi Kartları */}
      <View style={{paddingVertical: 10, flexDirection :'row', paddingHorizontal: 10, }}>
      
        <View style={{flex:1}}>
        <View
          style={{
            paddingVertical: 20,
            backgroundColor: colors.textInputBg,
            borderRadius: 10,
            paddingLeft: 10,
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Veri Tabanı:</Text>{' '}
            {defaults.length > 0
              ? authData.FirmaKodu === 'HilalMuhasebe'
                ? 'Deneme'
                : authData.FirmaKodu
              : '---'}
          </Text>
        </View>
        <View style={{paddingVertical: 20, backgroundColor: colors.textInputBg, borderRadius: 10, paddingLeft:10, marginBottom: 5 }}>
         
         <Text style={{ fontSize: 12 }}>
         <Text style={{ fontSize: 12, fontWeight: 'bold' }}> Versiyon: </Text> 
          15.0</Text>
           </View>
          <View style={{paddingVertical: 20, backgroundColor: colors.textInputBg, borderRadius: 10, paddingLeft:10, marginBottom: 5 }}>
         
          <Text style={{ fontSize: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}> Mali Yılı: </Text> 
            {defaults.length > 0 ? defaults[0].IQ_MaliYıl : '---'}</Text>
            </View>
            <View style={{paddingVertical: 20, backgroundColor: colors.textInputBg, borderRadius: 10, paddingLeft:10, marginBottom: 5 }}>
           
          <Text style={{ fontSize: 12 }}> <Text style={{ fontSize: 12, fontWeight: 'bold' }}> Kullanıcı: </Text> 
            {defaults.length > 0 ? defaults[0].Adi : '---'}</Text>
            </View>
        </View>
      </View>
        
     {/* Çıkış Yap */}
      <TouchableOpacity
        style={styles.categoryCikisYap}
        onPress={handleLogout}
      >
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryMainTitleHeader}>Çıkış Yap</Text>
        </View>
      </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  category: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    paddingTop: 15,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderColor: colors.textInputBg

  },
  categoryCikisYap: {
    position: 'absolute', 
    alignItems: 'center',
    bottom: 0,
    left: 0, 
    right: 0, 
    padding: 16, 
    backgroundColor: colors.textInputBg,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryTitle: {
    marginLeft: 10,
    fontSize: 12,
    color: '#424242'
  },
  categoryMainTitle: {
    fontSize: 12,
    color: '#424242',
  },
  categoryMainTitleHeader: {
    fontSize: 12,
    color: '#424242',
    fontWeight: 'bold',
  },
  subItems: {
    paddingLeft:35,
  },
  subItem: {
    paddingVertical: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom:10,
    borderColor: colors.textInputBg,

  },

  
});

export default CustomDrawerContent;

