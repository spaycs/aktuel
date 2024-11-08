import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, GetStarted, Login, StokList, CariList, SatisFaturasi, SatisFaturasiOnizleme, PatronRaporu, AlinanSiparis, AlinanSiparisOnizleme, TahsilatTediye, SatisIrsaliye, SatisIrsaliyeOnizleme, SatisIrsaliyesiOnizleme, AlisIrsaliyesi, AlisIrsaliyesiOnizleme, SatisIrsaliyesi, FiyatGor, TeklifFisi, TeklifFisiOnizleme, Raporlar, CariBakiyeYaslandirmaAylik, CariBakiyeYasladirmaCoklu, ExtreFoy, NelerSattik, PatronEkrani, Sohbet, CariHareketFoyu, StokHareketFoyu, CariSiparisFoyu, StokEklemeOnizleme, CariEklemeOnizleme, Loading } from "../screens"
import { Iptal, Kartlas, KartlasLogin, Kaydet, MikroIQ, MikroIQM, SohbetIQ, Takvim, Yazdir,} from "../res/images";
import { Text, TouchableOpacity, View } from "react-native";
import { handleLogout } from '../utils/logout';
import { BottomNavigator } from "../components";
import CustomDrawerContent from '../components/CustomDrawerContent';
import TahsilatTediyeOnizleme from "../screens/TahsilatTediyeOnizleme";
import DepoSayim from "../screens/DepoSayim";
import DepoSayimOnizleme from "../screens/DepoSayimOnizleme";
import DepolarArasiSevkFisi from "../screens/DepolarArasiSevkFisi";
import DepolarArasiSevkFisiOnizleme from "../screens/DepolarArasiSevkFisiOnizleme";
import YillikRapor from "../screens/Raporlar/YillikRapor";
import { colors } from "../res/colors";
import { useNavigation } from '@react-navigation/native';
import StokEkleme from "../screens/StokEkleme";
import CariEkleme from "../screens/CariEkleme";
import SarfMalzemeOnizleme from "../screens/SarfMalzemeOnizleme";
import SarfMalzeme from "../screens/SarfMalzeme";
import KredilerOzet from "../screens/Raporlar/KredilerOzet";
import CekSenetListesi from "../screens/Raporlar/CekSenetListesi";
import EnvanterMaliyet from "../screens/Raporlar/EnvanterMaliyet";
import KasaBorc from "../screens/Raporlar/KasaBorc";
import KasaAlacak from "../screens/Raporlar/KasaAlacak";
import BankaBakiyeleri from "../screens/Raporlar/BankaBakiyeleri";
import axiosLinkMain from "../utils/axiosMain";
import { useAuthDefault } from '../components/DefaultUser';
import SiparisKarsilama from "../screens/Raporlar/SiparisKarsilama";
import SorumlulukBazindaBekleyenSiparis from "../screens/Raporlar/SorumlulukBazindaBekleyenSiparis";
import TedarikciBazindaSatisKarsilama from "../screens/Raporlar/TedarikciBazindaSatisKarsilama";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/* 
    function MainApp() {
    return (
        <Tab.Navigator tabBar={props => <BottomNavigator {...props} />}>
        <Tab.Screen 
            name="Home" 
            component={Home} 
            options={{headerShown: false,}}
        />
        
        </Tab.Navigator>
    );
    }
*/

function DrawerNavigator() {
    return (
    <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.white,
            width: '80%',
          },
        }}
      >
        <Drawer.Screen 
          name="Anasayfa" 
          component={Home} 
          options={{
            headerTitleAlign: 'center',
            drawerItemStyle: { display: 'none' },
            headerBackVisible: false,
            headerTitle: () => <MikroIQ width={200} height={25}/>,
            drawerActiveBackgroundColor: colors.islembuttongray,
            drawerActiveTintColor: 'black',
            drawerInactiveTintColor: 'black',
            headerRight: () => (
              <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => {
                  navigation.navigate("Sohbet");
                  }}
              >
                  {sohbetCount > 0 && (
                  <View style={{backgroundColor: colors.red, position: 'absolute', borderRadius: 10, width: 15, height: 15,  top: -6,right: -5, zIndex: 1 }}>
                    <Text style={{fontSize: 10,color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{sohbetCount}</Text>
                  </View>
                )}
                  <SohbetIQ width={30} height={30}/>
                  <Text style={{fontSize: 8, justifyContent: 'center', textAlign:'center', position: 'absolute', bottom: -7, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 5, paddingLeft:2, paddingRight:2, fontWeight:'bold', color: colors.red  }}>Sohbet</Text>
              </TouchableOpacity>
              ),
          }}
        />
         <Drawer.Screen name="Home"  component={Home}
         options={{
            drawerItemStyle: { display: 'none' },
            headerTitleAlign: 'center',
            headerBackVisible: false,
            headerTitle: () => <MikroIQ />,
          }} />
        <Drawer.Screen name="Depo Sayım"  component={DepoSayim}
        options={{
            drawerItemStyle: { display: 'none' },
            headerTitleAlign: 'center',
            headerTitle: 'Depo Sayım',
            headerTitleStyle: {
              fontSize: 16,
            },
           
        }} />
        <Drawer.Screen name="Fiyat Gör"  component={FiyatGor}
         options={{
          drawerItemStyle: { display: 'none' },
          headerTitleAlign: 'center',
          headerTitle: 'Fiyat Gör',
          headerTitleStyle: {
            fontSize: 16,
          },
         
      }} />
        <Drawer.Screen name="Depolar Arası Sevk Fişi"  component={DepolarArasiSevkFisi}
        options={{
          drawerItemStyle: { display: 'none' },
          headerTitleAlign: 'center',
          headerTitle: 'Depolar Arası Sevk Fişi',
          headerTitleStyle: {
            fontSize: 16,
          },
        
      }} />
        <Drawer.Screen name="Stok Listesi"  component={StokList}
       options={{
        drawerItemStyle: { display: 'none' },
        headerTitleAlign: 'center',
        headerTitle: 'Stok Listesi',
        headerTitleStyle: {
          fontSize: 16,
        },
      
      }} />
        <Drawer.Screen name="Alınan Sipariş Fişi"  component={AlinanSiparis}
       options={{
        drawerItemStyle: { display: 'none' },
        headerTitleAlign: 'center',
        headerTitle: 'Alınan Sipariş Fişi',
        headerTitleStyle: {
          fontSize: 16,
        },
      
     }} />
        <Drawer.Screen name="Satış İrsaliyesi"  component={SatisIrsaliyesi}
       options={{
        drawerItemStyle: { display: 'none' },
        headerTitleAlign: 'center',
        headerTitle: 'Satış İrsaliyesi',
        headerTitleStyle: {
          fontSize: 16,
        },
       
      }} />
        <Drawer.Screen name="Satış Faturası"  component={SatisFaturasi}
       options={{
        drawerItemStyle: { display: 'none' },
        headerTitleAlign: 'center',
        headerTitle: 'Satış Faturası',
        headerTitleStyle: {
          fontSize: 16,
        },
      
      }} />
        <Drawer.Screen name="Tahsilat Tediye"  component={TahsilatTediye}
       options={{
        drawerItemStyle: { display: 'none' },
        headerTitleAlign: 'center',
        headerTitle: 'Tahsilat Tediye',
        headerTitleStyle: {
          fontSize: 16,
        },
        
      }} />
        <Drawer.Screen name="Alış İrsaliyesi"  component={AlisIrsaliyesi}
        options={{
          drawerItemStyle: { display: 'none' },
          headerTitleAlign: 'center',
          headerTitle: 'Alış İrsaliyesi',
          headerTitleStyle: {
            fontSize: 16,
          },
       
      }} />
        <Drawer.Screen name="Giriş Yap" component={Login} 
       options={{
        drawerItemStyle: { display: 'none' },
        headerTitleAlign: 'center',
        headerTitle: 'Giriş Yap',
        headerTitleStyle: {
          fontSize: 16,
        },
      
     }} />
      </Drawer.Navigator>
    );
  }
  

const Router = () => {
  const navigation = useNavigation();
  const [sohbetCount, setSohbetCount] = useState(0);
  const { defaults } = useAuthDefault();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const temsilciId =  defaults[0].IQ_Kod;
        const response = await axiosLinkMain.get(`/Api/Sohbet/SohbetVarmi?kod=${temsilciId}`);
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setSohbetCount(data.length); 
        } else {
          setSohbetCount(0); 
        }
      } catch (error) {
        console.error('API çağrısı başarısız oldu:', error);
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

    return(
        <Stack.Navigator >
             <Stack.Screen
                name="GetStarted"
                component={GetStarted}
                options={{headerShown: false, tabBarVisible: true,}}
            />
           
              <Stack.Screen
                name="Login"
                component={Login}
                options={({ navigation, route }) => ({
                    headerTitleAlign: 'center',
                    headerShown: false, tabBarVisible: true,
                    headerBackVisible:false,
                    headerTitle: () => (
                        <Kartlas/>
                        ),
                    })}
            />
          
         
            
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerTitleAlign: 'center',
                  drawerItemStyle: { display: 'none' },
                  headerBackVisible: false,
                  headerTitle: () => <MikroIQ width={90} height={25}/>,
                  drawerActiveBackgroundColor: colors.islembuttongray,
                  drawerActiveTintColor: 'black',
                  drawerInactiveTintColor: 'black',
                  headerRight: () => (
                    <TouchableOpacity
                        onPress={() => {
                        navigation.navigate("Sohbet");
                        }}
                    >
                        {sohbetCount > 0 && (
                        <View style={{backgroundColor: colors.red, position: 'absolute', borderRadius: 10, width: 15, height: 15,  top: -6,right: -5, zIndex: 1 }}>
                          <Text style={{fontSize: 10,color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{sohbetCount}</Text>
                        </View>
                      )}
                        <SohbetIQ width={30} height={30}/>
                        <Text style={{fontSize: 7, justifyContent: 'center', textAlign:'center', position: 'absolute', bottom: -7, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 5, paddingLeft:2, paddingRight:2, fontWeight:'bold', color: colors.red  }}>Sohbet</Text>
                    </TouchableOpacity>
                    ),
                }}
            />
          <Stack.Screen
                name="StokList"
                component={StokList}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: "Stok Listesi",
                  headerBackTitleVisible: false,
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                
                })}
              />

            <Stack.Screen
                name="Raporlar"
                component={Raporlar}
                options={({ navigation, route }) => ({
                    headerTitleAlign: 'center',
                    headerTitle: "Raporlar",
                    headerBackTitleVisible: false,
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="CariBakiyeYaslandirmaAylik"
                component={CariBakiyeYaslandirmaAylik}
                options={({ navigation, route }) => ({
                    headerTitle: "Cari Bakiye Yaşladırma Aylık",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                 
                    })}
            />
            <Stack.Screen
                name="CariBakiyeYasladirmaCoklu"
                component={CariBakiyeYasladirmaCoklu}
                options={({ navigation, route }) => ({
                    headerTitle: "Cari Bakiye Yaşladırma Tekli",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                 
                    })}
            />
            <Stack.Screen
                name="ExtreFoy"
                component={ExtreFoy}
                options={({ navigation, route }) => ({
                    headerTitle: "ExtreFoy",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                  
                    })}
            />
            <Stack.Screen
                name="KredilerOzet"
                component={KredilerOzet}
                options={({ navigation, route }) => ({
                    headerTitle: "Krediler Özet",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                  
                    })}
            />
            <Stack.Screen
                name="CekSenetListesi"
                component={CekSenetListesi}
                options={({ navigation, route }) => ({
                    headerTitle: "Çek Senet Listesi",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="EnvanterMaliyet"
                component={EnvanterMaliyet}
                options={({ navigation, route }) => ({
                    headerTitle: "Envanter Maliyet",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                  
                    })}
            />
            <Stack.Screen
                name="KasaBorc"
                component={KasaBorc}
                options={({ navigation, route }) => ({
                    headerTitle: "Kasa Borç",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                  
                    })}
            />
            <Stack.Screen
                name="KasaAlacak"
                component={KasaAlacak}
                options={({ navigation, route }) => ({
                    headerTitle: "Kasa Alacak",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                  
                    })}
            />
            <Stack.Screen
                name="BankaBakiyeleri"
                component={BankaBakiyeleri}
                options={({ navigation, route }) => ({
                    headerTitle: "Banka Bakiyeleri",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="NelerSattik"
                component={NelerSattik}
                options={({ navigation, route }) => ({
                    headerTitle: "Neler Sattık",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="PatronEkrani"
                component={PatronEkrani}
                options={({ navigation, route }) => ({
                    headerTitle: "PatronEkrani",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                    
                    })}
            />
            <Stack.Screen
                name="YillikRapor"
                component={YillikRapor}
                options={({ navigation, route }) => ({
                    headerTitle: "Yıllık Rapor",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="SiparisKarsilama"
                component={SiparisKarsilama}
                options={({ navigation, route }) => ({
                    headerTitle: "Sipariş Karşılama",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="SorumlulukBazindaBekleyenSiparis"
                component={SorumlulukBazindaBekleyenSiparis}
                options={({ navigation, route }) => ({
                    headerTitle: "Sorumluluk Bazında Bekleyen Sipariş",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="TedarikciBazindaSatisKarsilama"
                component={TedarikciBazindaSatisKarsilama}
                options={({ navigation, route }) => ({
                    headerTitle: "Tedarikçi Bazında Satış Karşılaştırma",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="CariList"
                component={CariList}
                options={({ navigation, route }) => ({
                    headerTitleAlign: "center",
                    headerTitle: "Cari Listesi",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="SatisFaturasi"
                component={SatisFaturasi}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Satış Faturası',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                  
                  })}
          />
          <Stack.Screen
              name="SatisFaturasiOnizleme"
              component={SatisFaturasiOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="AlinanSiparis"
                component={AlinanSiparis}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Alınan Sipariş',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                 
                  })}
            />
            <Stack.Screen
                name="AlinanSiparisOnizleme"
                component={AlinanSiparisOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="TahsilatTediye"
                component={TahsilatTediye}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Tahsilat Tediye',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                  })}
            />
            <Stack.Screen
                name="TahsilatTediyeOnizleme"
                component={TahsilatTediyeOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="SatisIrsaliyesi"
                component={SatisIrsaliyesi}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Satış İrsaliyesi',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                  })}
            />
            <Stack.Screen
                name="SatisIrsaliyesiOnizleme"
                component={SatisIrsaliyesiOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="StokEkleme"
                component={StokEkleme}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Stok Ekle',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                 
                  })}
            />
            <Stack.Screen
                name="StokEklemeOnizleme"
                component={StokEklemeOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="CariEkleme"
                component={CariEkleme}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Cari Ekle',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                 
                  })}
            />
            <Stack.Screen
                name="CariEklemeOnizleme"
                component={CariEklemeOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="AlisIrsaliyesi"
                component={AlisIrsaliyesi}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Alış İrsaliyesi',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                
                  })}
            />
            <Stack.Screen
                name="AlisIrsaliyesiOnizleme"
                component={AlisIrsaliyesiOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="DepoSayim"
                component={DepoSayim}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Depo Sayım',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                 
                  })}
            />
            <Stack.Screen
                name="DepoSayimOnizleme"
                component={DepoSayimOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="DepolarArasiSevkFisi"
                component={DepolarArasiSevkFisi}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Depolar Arası Sevk Fişi',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                 
                  })}
            />
            <Stack.Screen
                name="DepolarArasiSevkFisiOnizleme"
                component={DepolarArasiSevkFisiOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="SarfMalzeme"
                component={SarfMalzeme}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Sarf Malzeme',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                 
                  })}
            />
            <Stack.Screen
                name="SarfMalzemeOnizleme"
                component={SarfMalzemeOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="TeklifFisi"
                component={TeklifFisi}
                options={({ navigation, route }) => ({
                  headerTitleAlign: 'center',
                  headerTitle: 'Teklif Fişi',
                  headerTitleStyle: {
                    fontSize: 16,
                  },
                 
                  })}
            />
            <Stack.Screen
                name="TeklifFisiOnizleme"
                component={TeklifFisiOnizleme}
                options={({ navigation, route }) => ({
                    headerTitle: "Önizleme",
                    })}
            />
            <Stack.Screen
                name="PatronRaporu"
                component={PatronRaporu}
                options={({ navigation, route }) => ({
                    headerTitleAlign: 'center',
                    headerTitle: "Patron Raporu",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="Sohbet"
                component={Sohbet}
                options={({ navigation, route }) => ({
                    headerTitleAlign: 'center',
                    headerTitle: "Sohbet",
                    headerTitleStyle: {
                        fontSize: 16,
                      },
                    })}
            />
            <Stack.Screen
                name="CariHareketFoyu"
                component={CariHareketFoyu}
                options={({ navigation, route }) => ({
                    headerTitleAlign: 'center',
                    headerTitle: "Cari Hareket Föyü",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                    
                    })}
            />
            <Stack.Screen
                name="StokHareketFoyu"
                component={StokHareketFoyu}
                options={({ navigation, route }) => ({
                    headerTitleAlign: 'center',
                    headerTitle: "Stok Hareket Föyü",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                   
                    })}
            />
            <Stack.Screen
                name="CariSiparisFoyu"
                component={CariSiparisFoyu}
                options={({ navigation, route }) => ({
                    headerTitleAlign: 'center',
                    headerTitle: "Cari Sipariş Föyü",
                    headerTitleStyle: {
                      fontSize: 16,
                    },
                    
                    })}
            />
        </Stack.Navigator>
    )
}

export default Router;