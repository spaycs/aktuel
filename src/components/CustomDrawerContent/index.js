import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { AlinanSiparis, Alisİrsaliyesi, Camera, CameraMenu, DepolarArasiSevkFisi, DepoSayim,FiyatGor, Down, Rapor, Right, SatisFaturasi, Satisİrsaliyesi, StokList, TahsilatTediye, TeklifFisi, MikroIQLogin, Patron, SMFiyatGor, SMStokListele, SMSatisYonetimi, SMStokYonetimi, SMFiyatYonetimi, SMRaporlar, SMSatinAlmaYonetimi, SMDepoSayim, SMDepolarArasiSevkFisi, SMAlinanSiparisFisi, SMTahsilatTediye, SMRapor, SMMenu, Back, Left } from '../../res/images'; // Ensure these are React components
import { useAuth } from '../userDetail/Id';
import axiosLink from '../../utils/axios';
import { colors } from '../../res/colors';
import { ProductContext } from '../../context/ProductContext';
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
  const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);

  useEffect(() => {
    const fetchMenuIzinleri = async () => {
      try {
        if (defaults.length > 0) {
          const temsilciKod = defaults[0].IQ_Kod;
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

  const handleNavigation = (navigation, route, izinKontrol) => {
    if (izinKontrol) {
      if (menuIzinleri && menuIzinleri[izinKontrol] === 1) {
        handleNavigationWithReset(navigation, route);
      } else {
        Alert.alert("Uyarı", "Bu menüye erişim izniniz bulunmamaktadır. Yöneticiniz ile iletişime geçiniz.");
      }
    }
  };


  const handleNavigationWithReset = (navigation, route) => {
    Alert.alert(
      "Uyarı",
      "Başka bir sayfaya geçiyorsunuz. Girdiğiniz veriler kaybolacak. Devam etmek istiyor musunuz?",
      [
        {
          text: "Evet",
          onPress: () => {
            setFaturaBilgileri({});
            setAddedProducts([]);
            navigation.navigate(route);
          }
        },
        {
          text: "Hayır",
          onPress: () => {},
          style: "cancel"
        }
      ]
    );
  };

  const handleLogout = async () => {
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
  
        // Çekmeceyi kapat
        props.navigation.closeDrawer();
  
        // Navigasyonu sıfırla ve Login sayfasına yönlendir
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0, // Yeni yığın indeksi
            routes: [{ name: 'Login' }], // Yönlendirilecek sayfa
          })
        );
      } else {
        Alert.alert('Hata', 'Çıkış yapılamadı, lütfen tekrar deneyin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(error);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <DrawerItemList {...props} />
      <View style={{
        justifyContent: 'space-between', // Logo ve X arasında boşluk oluşturur
        alignItems: 'center',
        flexDirection: 'row', // Yatayda hizalar
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: colors.textInputBg,
        paddingHorizontal: 10 // İçerikler için sağ ve sol boşluklar
      }}>
         <TouchableOpacity style={{}} onPress={() => props.navigation.closeDrawer()}>
          <Left width={16} height={16}/>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}> 
          <MikroIQLogin width={90} height={40} />
        </View>
       
        </View>
       
      <View style={{paddingVertical: 10, flexDirection :'row', paddingHorizontal: 10, borderBottomWidth: 1, borderColor: colors.textInputBg }}>
        <View style={{justifyContent: 'center'}}>
          <Patron width={50} height={30}/>
        </View>
        <View>
         
          <Text style={{ fontSize: 11 }}><Text style={{ fontSize: 11, fontWeight: 'bold' }}>Veri Tabanı:</Text> {defaults.length > 0 ? defaults[0].IQ_Database : '---'}</Text>
          <Text style={{ fontSize: 11 }}><Text style={{ fontSize: 11, fontWeight: 'bold' }}>Mali Yılı:</Text> {defaults.length > 0 ? defaults[0].IQ_MaliYıl : '---'}</Text>
          <Text style={{ fontSize: 11 }}><Text style={{ fontSize: 11, fontWeight: 'bold' }}>Kullanıcı:</Text> {defaults.length > 0 ? defaults[0].Adi : '---'}</Text>
         
        </View>
      </View>
       <TouchableOpacity onPress={() => props.navigation.navigate ('Anasayfa')}>
        <View style={styles.category}>
          <Text style={styles.categoryMainTitle}>Anasayfa</Text>
        </View>
      </TouchableOpacity>
      {/* Stok Yönetimi Category */}
      <TouchableOpacity
        style={styles.category}
        onPress={() => setIsStokExpanded(!isStokExpanded)}
      >
        
        <View style={styles.categoryHeader}>
        <View style={styles.leftContainer}>
          <SMStokYonetimi width={16} height={16} />
          <Text style={styles.categoryTitle}>Stok Yönetimi</Text>
        </View>
          {isStokExpanded ? <Down width={16} height={16} /> : <Right width={16} height={16} />}
        </View>
      </TouchableOpacity>
      {isStokExpanded && (
        <View style={styles.subItems}>
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigationWithReset(props.navigation, 'Fiyat Gör')}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconDetail}><SMFiyatGor width={16} height={16} /></View>
              <View><Text style={styles.categoryTitle}>Fiyat Gör</Text></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Depo Sayım', 'IQM_DepoSayim')}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconDetail}><SMDepoSayim width={16} height={16} /></View>
              <View><Text style={styles.categoryTitle}>Depo Sayım</Text></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Depolar Arası Sevk Fişi', 'IQM_DepolarASF')}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconDetail}><SMDepolarArasiSevkFisi width={16} height={16} /></View>
              <View><Text style={styles.categoryTitle}>Depolar Arası Sevk Fişi</Text></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Stok Listesi', 'IQM_StokListesi')}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconDetail}><SMStokListele width={16} height={16} /></View>
              <View><Text style={styles.categoryTitle}>Stok Listesi</Text></View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Satış Yönetimi */}
      <TouchableOpacity
        style={styles.category}
        onPress={() => setIsSatisExpanded(!isSatisExpanded)}
      >
        <View style={styles.categoryHeader}>
        <View style={styles.leftContainer}>
        <SMSatisYonetimi width={16} height={16} />
          <Text style={styles.categoryTitle}>Satış Yönetimi</Text>
          </View>
          {isSatisExpanded ? <Down width={16} height={16} /> : <Right width={16} height={16} />}
        </View>
      </TouchableOpacity>
      {isSatisExpanded && (
        <View style={styles.subItems}>
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Alınan Sipariş Fişi', 'IQM_AlınanSiparis')}
          >
             <View style={styles.iconContainer}>
             <View style={styles.iconDetail}><SMAlinanSiparisFisi width={16} height={16}/></View>
              <View><Text style={styles.categoryTitle}>Alınan Sipariş Fişi</Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Satış İrsaliyesi', 'IQM_SatisIrsaliyesi')}
          >
            <View style={styles.iconContainer}>
            <View style={styles.iconDetail}><SMAlinanSiparisFisi width={16} height={16}/></View>
              <View><Text style={styles.categoryTitle}>Satış İrsaliyesi</Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Satış Faturası', 'IQM_SatisFaturasi')}
          >
            <View style={styles.iconContainer}>
            <View style={styles.iconDetail}><SMAlinanSiparisFisi width={16} height={16}/></View>
              <View><Text style={styles.categoryTitle}>Satış Faturası</Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'TeklifFisi', 'IQM_TeklifFisi')}
          >
            <View style={styles.iconContainer}>
            <View style={styles.iconDetail}><SMAlinanSiparisFisi width={16} height={16}/></View>
              <View><Text style={styles.categoryTitle}>Teklif Fişi</Text></View>
            </View>
          </TouchableOpacity>
        </View>
      )}


      {/* Finans Yönetimi */}
      <TouchableOpacity
        style={styles.category}
        onPress={() => setIsFinansxpanded(!isFinansExpanded)}
      >
        <View style={styles.categoryHeader}>
        <View style={styles.leftContainer}>
        <SMFiyatYonetimi width={16} height={16} />
          <Text style={styles.categoryTitle}>Finans Yönetimi</Text>
          </View>
          {isFinansExpanded ? <Down width={16} height={16} /> : <Right width={16} height={16} />}
        </View>
      </TouchableOpacity>
      {isFinansExpanded && (
        <View style={styles.subItems}>
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Tahsilat Tediye', 'IQM_TahsilatTediye')}
          >
             <View style={styles.iconContainer}>
             <View style={styles.iconDetail}><SMTahsilatTediye width={16} height={16}/></View>
              <View><Text style={styles.categoryTitle}>Tahsilat Tediye</Text></View>
            </View>
          </TouchableOpacity>
        </View>

        
      )}

      {/* Satın Alma Yönetimi */}
      <TouchableOpacity
        style={styles.category}
        onPress={() => setIsSatinAlmaxpanded(!isSatinAlmaExpanded)}
      >
        <View style={styles.categoryHeader}>
        <View style={styles.leftContainer}>
        <SMSatinAlmaYonetimi width={16} height={16} />
          <Text style={styles.categoryTitle}>Satın Alma Yönetimi</Text>
          </View>
          {isSatinAlmaExpanded ? <Down width={16} height={16} /> : <Right width={16} height={16} />}
        </View>
      </TouchableOpacity>
      {isSatinAlmaExpanded && (
        <View style={styles.subItems}>
          <TouchableOpacity
            style={styles.subItem}
            onPress={() => handleNavigation(props.navigation, 'Alış İrsaliyesi', 'IQM_AlisIrsaliyesi')}
          >
            <View style={styles.iconContainer}>
            <View style={styles.iconDetail}><SMAlinanSiparisFisi width={16} height={16}/></View>
              <View><Text style={styles.categoryTitle}>Alış İrsaliyesi</Text></View>
            </View>
          </TouchableOpacity>
        </View>

        
      )}

      {/* Raporlar */}
        <TouchableOpacity
          style={styles.category}
          onPress={() => setIsRaporlarExpanded(!isRaporlarExpanded)}
        >
          <View style={styles.categoryHeader}>
          <View style={styles.leftContainer}>
          <SMRaporlar width={16} height={16} />
            <Text style={styles.categoryTitle}>Raporlar</Text>
            </View>
            {isRaporlarExpanded ? <Down width={16} height={16} /> : <Right width={16} height={16} />}
          </View>
        </TouchableOpacity>
        {isRaporlarExpanded && (
          <View style={styles.subItems}>
            <TouchableOpacity
              style={styles.subItem}
              onPress={() => handleNavigation(props.navigation, 'Raporlar', 'IQM_Raporlar')}
            >
              <View style={styles.iconContainer}>
              <View style={styles.iconDetail}><SMRapor width={16} height={16}/></View>
                <View><Text style={styles.categoryTitle}>Raporlar</Text></View>
              </View>
            </TouchableOpacity>
          </View>

        
      )}

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
    justifyContent: 'space-between', // Sol ve sağdaki içerikler arasında boşluk bırakır
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

