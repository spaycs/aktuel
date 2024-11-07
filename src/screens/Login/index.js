import React, { useState, useEffect, useCallback } from 'react';
import { Image, BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from 'react-native';
import { MainStyles } from '../../res/style';
import Button from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Down, EyeOff, EyeOn, Left, MikroIQ, MikroIQLogin, Right } from '../../res/images';
import { colors } from '../../res/colors';
import axiosLink from '../../utils/axios';
import { useAuth } from '../../components/userDetail/Id';
import CheckBox from '@react-native-community/checkbox'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import DefaultUser from '../../components/DefaultUser';
import CustomDrawerContent from '../../components/CustomDrawerContent';
import Home from '../Home';
import LinearGradient from 'react-native-linear-gradient'; 
import { useAxiosLinkMain } from '../../utils/axiosMain';
import { useAxiosLink } from '../../utils/axios';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { color: colors.black };

const Login = ({ navigation }) => {
  const axiosLinkMain = useAxiosLinkMain();
  const axiosLink = useAxiosLink();
  const [axiosLinkStatus, setAxiosLinkStatus] = useState(null);
  const [axiosLinkMainStatus, setAxiosLinkMainStatus] = useState(null);
  const [axiosLinkMainsStatus, setAxiosLinkMainsStatus] = useState(null);
  const { authData, updateAuthData } = useAuth();
  const { defaults } = useAuth();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRememberMeChecked, setRememberMeChecked] = useState(true); 
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [FirmaKodu, setFirmaKodu] = useState('');
  const [FirmaApiUrl, setFirmaApiUrl] = useState('');
  const [MikroApiUrl, setMikroApiUrl] = useState('');
  const [CalismaYili, setCalismaYili] = useState('');
  const [ApiKey1, setApiKey1] = useState('');
  const [ApiKey2, setApiKey2] = useState('');
  const [KullaniciKodu, setKullaniciKodu] = useState('');
  const [Sifre, setSifre] = useState('');
  const [sifreStandart, setSifreStandart] = useState('');
  const [FirmaNo, setFirmaNo] = useState(0);
  const [SubeNo, setSubeNo] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Connection Error', 'You are not connected to the internet!');
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);
  


 useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://213.14.109.246:8084/Api/APIMethods/HealthCheck')
        .then((response) => {
          console.log(response.data);
          if (response.data.result && response.data.result.includes("200")) {
            setAxiosLinkStatus('Açık');
          } else {
            setAxiosLinkStatus('Kapalı');
          }
        })
        .catch(() => {
          setAxiosLinkStatus('Kapalı');
        });
    }, 10000); // 3 saniye
  
    return () => clearInterval(interval); // bileşen kapanınca temizleme
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://213.14.109.246:8094/Api/Kullanici/KullaniciListesi')
        .then((response) => {
          console.log('axiosLinkMain response:', response.data);
          if (response.data && response.data.length > 0) {
            setAxiosLinkMainStatus('Açık');
          } else {
            setAxiosLinkMainStatus('Kapalı');
          }
        })
        .catch(() => {
          setAxiosLinkMainStatus('Kapalı');
        });
    }, 10000); // 3 saniye
  
    return () => clearInterval(interval); // bileşen kapanınca temizleme
  }, []);

    useEffect(() => {
  // Üçüncü API çağrısı (axiosLinkMains)
    axios.get('http://80.253.246.89:8055/Api/Kontrol/LisansKontrol?kod=1&database=HilalMuhasebe&maliyil=2024&firmano=0&subeno=3')
    .then((response) => {
      console.log('axiosLinkMains response:', response.data);
      if (response.data) {
        setAxiosLinkMainsStatus('Açık');
        // Burada 'Açık' durumu için yapılacak işlemler
      } else {
        setAxiosLinkMainsStatus('Kapalı');
        // Burada 'Kapalı' durumu için yapılacak işlemler
      }
    })
    .catch(() => {
      setAxiosLinkMainsStatus('Kapalı');
    });

  }, []);

  useEffect(() => {
    retrieveRememberMe();
    fetchUsers();
    //console.log('authdata', authData);
  }, []);

  useEffect(() => {
    if (authData) {
      setFirmaKodu(authData.FirmaKodu || '');
      setFirmaApiUrl(authData.FirmaApiUrl || '');
      setMikroApiUrl(authData.MikroApiUrl || '');
      setCalismaYili(authData.CalismaYili || '');
      setApiKey1(authData.ApiKey1 || '');
      setApiKey2(authData.ApiKey2 || '');
      setKullaniciKodu(authData.KullaniciKodu || '');
      setSifre(authData.Sifre || '');
      setSifreStandart(authData.OrijinalSifre || ''); 
      setFirmaNo(authData.FirmaNo || '');
      setSubeNo(authData.SubeNo || '');
      setSelectedUser(authData.selectedUser || '');
    }
  }, [authData]);
  

  const fetchUsers = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Kullanici/KullaniciListesi');
      const userList = response.data;
      setUsers(userList);
  
      // İlk kullanıcıyı otomatik olarak seç
      if (userList.length > 0) {
        const firstUser = userList[0];
        setSelectedUser(firstUser); // İlk kullanıcıyı seç
        setKullaniciKodu(firstUser.KOD.toString()); // Kullanıcı kodunu ayarla
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleRememberMe = () => {
    setRememberMeChecked(!isRememberMeChecked);
    console.log(`Beni Unutma seçeneği ${isRememberMeChecked ? 'seçildi' : 'seçilmedi'}.`);
  };

  const handleLogin = async () => {
    if (!KullaniciKodu) {
        Alert.alert('Hata', 'Kullanıcı kodu girmediniz. Lütfen kullanıcı kodunu giriniz.');
        return;
    }
    setLoading(true);

    try {
        updateAuthData("KullaniciKodu", KullaniciKodu);
        const sifreStandart = FirmaKodu === 'DENEMESD' ? '2085' : Sifre;

        const md5Response = await axiosLinkMain.get(`/Api/kullanici/MD5SifreDonustur?sifre=${sifreStandart}`);
        const hashedPassword = md5Response.data;

        const attemptLogin = async (apiKey) => {
            const requestData = {
                FirmaKodu,
                FirmaApiUrl,
                MikroApiUrl,
                CalismaYili,
                ApiKey: apiKey,  // Burada ApiKey dinamik olarak atanıyor
                KullaniciKodu,
                Sifre: hashedPassword,
                sifreStandart,
                FirmaNo,
                SubeNo,
                selectedUser
            };
            console.log('Denemede kullanılan ApiKey:', requestData.ApiKey);

            try {
                const response = await axiosLink.post('/Api/APIMethods/APILogin', requestData);
                const responseData = response.data;

                if (responseData.result && responseData.result[0].StatusCode === 200) {
                    console.log('Başarılı giriş ApiKey ile yapıldı:', apiKey);
                    updateAuthData("ApiKey", apiKey);

                    if (isRememberMeChecked) {
                        storeRememberMe(KullaniciKodu, hashedPassword, selectedUser);
                    }
                    updateAuthData('KullaniciKodu', KullaniciKodu);
                    updateAuthData('Sifre', hashedPassword);
                    updateAuthData('OrijinalSifre', sifreStandart);
                    updateAuthData('selectedUser', selectedUser);

                    navigation.navigate("DrawerNavigator");
                } else {
                    retrieveServiceSettings();
                    Alert.alert('Hata', 'Kullanıcı adı veya Şifre Hatalı. Tekrar Deneyin');
                }
            } catch {
                throw new Error('Kullanıcı adı veya Şifre Hatalı. Tekrar Deneyin');
            }
        };

        try {
            await attemptLogin(ApiKey1);
        } catch (error) {
            try {
                await attemptLogin(ApiKey2);
            } catch {
                setLoading(false);
                Alert.alert('Hata', 'Giriş başarısız oldu. Lütfen tekrar deneyin.');
            }
        }

        setLoading(false);

    } catch (error) {
        setLoading(false);
        Alert.alert('Hata', 'Şifreyi MD5 ile dönüştürürken veya giriş aşamasında bir hata oluştu.');
        console.error(error);
    }
};


  
  

const storeRememberMe = async (KullaniciKodu, hashedPassword, selectedUser) => {
  try {
    const authDataToStore = { KullaniciKodu, Sifre: hashedPassword, OrijinalSifre: sifreStandart, FirmaKodu, FirmaApiUrl, MikroApiUrl, CalismaYili, ApiKey1, ApiKey2, FirmaNo, SubeNo, selectedUser };
    await AsyncStorage.setItem('authData', JSON.stringify(authDataToStore));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const storeRememberMeAuthdata = async () => {
  try {
    const authDataToStore = {FirmaKodu, FirmaApiUrl, MikroApiUrl, CalismaYili, ApiKey1, ApiKey2, FirmaNo, SubeNo };
    await AsyncStorage.setItem('authData', JSON.stringify(authDataToStore));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const retrieveRememberMe = async () => {
  try {
    const storedAuthData = await AsyncStorage.getItem('authData');
    if (storedAuthData) {
      const parsedAuthData = JSON.parse(storedAuthData);
      setFirmaKodu(parsedAuthData.FirmaKodu || '');
      setFirmaApiUrl(parsedAuthData.FirmaApiUrl || '');
      setMikroApiUrl(parsedAuthData.MikroApiUrl || '');
      setCalismaYili(parsedAuthData.CalismaYili || '');
      setApiKey1(parsedAuthData.ApiKey1 || '');
      setApiKey2(parsedAuthData.ApiKey2 || '');
      setKullaniciKodu(parsedAuthData.KullaniciKodu || '');
      setSelectedUser(parsedAuthData.selectedUser || '');
      const originalPassword = parsedAuthData.OrijinalSifre || '';
      const hashedPassword = parsedAuthData.Sifre || '';

      // Şifreleri hem TextInput hem de login için ayrı ayrı ayarlıyoruz
      setSifreStandart(originalPassword);
      setSifre(hashedPassword);

      
      
      // onChangeText tetiklenmediği için elle set fonksiyonlarını tetikliyoruz
      handlePasswordChange(originalPassword);
      setFirmaNo(parsedAuthData.FirmaNo || '');
      setSubeNo(parsedAuthData.SubeNo || '');
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};

const handlePasswordChange = (password) => {
  setSifreStandart(password); // Orijinal şifreyi ayarla
  setSifre(password); // Aynı zamanda hashed şifreyi ayarla
};



// Asenkron işlemleri saklayan fonksiyon
const storeServiceSettings = async () => {
  try {
    const serviceSettings = { FirmaKodu, FirmaApiUrl, MikroApiUrl, CalismaYili, ApiKey1, ApiKey2, FirmaNo, SubeNo };
    await AsyncStorage.setItem('serviceSettings', JSON.stringify(serviceSettings));
    
    // Geri almayı burada yapmayın, ana bileşende çağırın
  } catch (error) {
    console.error('Servis ayarları saklanırken hata oluştu:', error);
  }
};


// Bileşen yüklendiğinde veya servis ayarlarını güncellerken çağrılabilir
const retrieveServiceSettings = async () => {
  try {
    const storedServiceSettings = await AsyncStorage.getItem('serviceSettings');
    if (storedServiceSettings) {
      const parsedServiceSettings = JSON.parse(storedServiceSettings);
      setFirmaKodu(parsedServiceSettings.FirmaKodu || '');
      setFirmaApiUrl(parsedServiceSettings.FirmaApiUrl || '');
      setMikroApiUrl(parsedServiceSettings.MikroApiUrl || '');
      setCalismaYili(parsedServiceSettings.CalismaYili || '');
      setApiKey1(parsedServiceSettings.ApiKey1 || '');
      setApiKey2(parsedServiceSettings.ApiKey2 || '');
      setFirmaNo(parsedServiceSettings.FirmaNo || '');
      setSubeNo(parsedServiceSettings.SubeNo || '');
    }
  } catch (error) {
    console.error('Servis ayarları alınırken hata oluştu:', error);
  }
};

// Bileşen ilk yüklendiğinde ayarları geri al
useEffect(() => {
  retrieveServiceSettings();
}, []);

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

  const handleUserChange = (user) => {
    setSelectedUser(user);
    setSifre(''); 
    setSifreStandart(''); 
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleServiceSettingsChange = (key, value) => {
    switch (key) {
      case 'FirmaKodu':
        setFirmaKodu(value);
        break;
      case 'FirmaApiUrl':
        setFirmaApiUrl(value);
        break;
      case 'MikroApiUrl':
        setMikroApiUrl(value);
        break;
      case 'CalismaYili':
        setCalismaYili(value);
        break;
      case 'ApiKey1':
        setApiKey1(value);
        break;
      case 'ApiKey2':
        setApiKey2(value);
        break;
      case 'FirmaNo':
        setFirmaNo(value);
        break;
      case 'SubeNo':
        setSubeNo(value);
        break;
      default:
        break;
    }
    storeServiceSettings();
  };

  const handleModalSave = () => { 

    // Yeni değerlerle güncelleme
    updateAuthData('FirmaKodu', FirmaKodu);
    updateAuthData('FirmaApiUrl', FirmaApiUrl);
    updateAuthData('MikroApiUrl', MikroApiUrl);
    updateAuthData('CalismaYili', CalismaYili);
    updateAuthData('FirmaNo', FirmaNo);
    updateAuthData('SubeNo', SubeNo);
    
    // Servis ayarlarını sakla
    storeServiceSettings();
    storeRememberMeAuthdata();

    // Modali kapat
    toggleModal();
};


  const handleClose = () => {
    setModalVisible(false);
  };

  
  return (
    <View style={[MainStyles.flex1, MainStyles.justifyContent, MainStyles.backgroundColorWhite]}>
       <View style={[MainStyles.positionAbsolute, MainStyles.top50, MainStyles.right0, MainStyles.backgroundColorBlue, MainStyles.padding5]}>
       <Text>{isConnected ? 'Connected' : 'No Connection'}</Text>
             <Text style={{color: colors.black, fontSize: 11}}>Mikro: {axiosLinkStatus}</Text>
            <Text style={{color: colors.black, fontSize: 11}}>Local: {axiosLinkMainStatus}</Text>
            <Text style={{color: colors.balck, fontSize: 11}}>Lisans: {axiosLinkMainsStatus}</Text>
            </View>
      <View style={[MainStyles.flexDirection, MainStyles.justifyContent, MainStyles.alignItems]}>
     
        <View>
          <View style={[MainStyles.flexDirection, MainStyles.justifyContent, MainStyles.flexDirection, MainStyles.marginBottom5]}>
            <MikroIQLogin width={240} height={70}/>
          </View>
          <View>
            <Text style={[MainStyles.fontSize11, MainStyles.textColorBlack, MainStyles.textAlignCenter, MainStyles.marginBottom10]}>
              Size özel çözümler ile hizmetinizdeyiz.
            </Text>
            
          </View>
        </View>
      </View>
    <View style={MainStyles.paddingHorizontal15}>
    <Text style={[MainStyles.fontSize12, MainStyles.textColorBlack, MainStyles.marginBottom10, MainStyles.fontWeightBold]}>Kullanıcı Seçin</Text>
      <View style={[MainStyles.borderRadius5, MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.marginBottom10, MainStyles.backgroundColorWhite]}>
      <Picker
      itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
          selectedValue={selectedUser}
          onValueChange={(itemValue) => handleUserChange(itemValue)}
        >
          <Picker.Item  style={{fontSize: 12}} color='black' label="Kullanıcı seçin" value="" />
          {users.map((user) => (
            <Picker.Item style={{fontSize: 12}} key={user.KOD} label={`${user.AD}`} value={user} />
          ))}
        </Picker>
      </View>

      <View>
      <Text style={[MainStyles.fontSize12, MainStyles.fontWeightBold]}>Kullanıcı Kodu</Text>
      <TextInput
          style={[MainStyles.backgroundColorWhite, MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.borderRadius5, MainStyles.justifyContent, MainStyles.marginTop10,
            MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingHorizontal15, MainStyles.height40, MainStyles.backgroundColorWhite]}
          placeholder='Kullanıcı Kodunu Giriniz'
          onChangeText={text => setKullaniciKodu(text)}
          value={KullaniciKodu}
          placeholderTextColor="gray"
          autoCapitalize='none'
        />

        <Text style={[MainStyles.fontSize12, MainStyles.fontWeightBold, MainStyles.marginTop10]}>Şifre</Text>
        <TextInput
           style={[MainStyles.backgroundColorWhite, MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.borderRadius5, MainStyles.justifyContent, MainStyles.marginTop10,
            MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingHorizontal15, MainStyles.marginBottom10, MainStyles.height40, MainStyles.backgroundColorWhite]}
          placeholder='Şifrenizi Giriniz'
          onChangeText={text => handlePasswordChange(text)} 
          value={sifreStandart}
          placeholderTextColor="gray"
          secureTextEntry={!isPasswordVisible}
          autoCapitalize='none'
        />
      </View>

          <View>
            <Button title={loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} onPress={handleLogin} disabled={loading} />
            <TouchableOpacity style={[MainStyles.alignCenter, MainStyles.marginTop10]} title={'Servis Ayarları'} onPress={toggleModal} >
              <Text style={[MainStyles.fontSize13, MainStyles.textColorPrimary]}>Servis Ayarları</Text>
            </TouchableOpacity>
          </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={[MainStyles.paddingHorizontal15, MainStyles.paddingTop10, MainStyles.backgroundColorWhite, MainStyles.flex1]}>
            <View style={[MainStyles.alignCenter, MainStyles.backgroundColorWhite, MainStyles.flexDirection, MainStyles.paddingVertical15, MainStyles.justifySpaceBetween]}>
              <TouchableOpacity onPress={handleClose}>
                <Left width={17} height={17}/>
              </TouchableOpacity>
              <Text style={[MainStyles.fontSize16, MainStyles.textAlignCenter, MainStyles.fontWeightBold, MainStyles.flex1]}>Servis Ayarları</Text>
            </View>
            <View style={MainStyles.padding10}>
            <Text style={[MainStyles.fontSize12, MainStyles.marginBottom5, MainStyles.marginTop10, MainStyles.fontWeightBold]}>Firma Kodu</Text>
     
            <TextInput
              style={[MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.marginBottom10, MainStyles.borderRadius5, MainStyles.fontSize12, MainStyles.height40, MainStyles.paddingLeft10]}
              placeholder='Firma Kodu Giriniz'
              onChangeText={(text) => handleServiceSettingsChange('FirmaKodu', text)}
              value={FirmaKodu}
              autoCapitalize="none"
              placeholderTextColor={colors.black}
              secureTextEntry={!isPasswordVisible}
            />
             <Text style={[MainStyles.fontSize12, MainStyles.marginBottom5, MainStyles.marginTop10, MainStyles.fontWeightBold]}>Çalışma Yılı</Text>
            <TextInput
              style={[MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.marginBottom10, MainStyles.borderRadius5, MainStyles.fontSize12, MainStyles.height40, MainStyles.paddingLeft10]}
              placeholder='Çalışma Yılını Giriniz'
              onChangeText={(text) => handleServiceSettingsChange('CalismaYili', text)}
              value={CalismaYili}
              autoCapitalize="none"
              placeholderTextColor={colors.black}
            />
             <Text style={[MainStyles.fontSize12, MainStyles.marginBottom5, MainStyles.marginTop10, MainStyles.fontWeightBold]}>Firma Api Url</Text>
            <TextInput
              style={[MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.marginBottom10, MainStyles.borderRadius5, MainStyles.fontSize12, MainStyles.height40, MainStyles.paddingLeft10]}
              placeholder='Firma Api Url Giriniz'
              onChangeText={(text) => handleServiceSettingsChange('FirmaApiUrl', text)}
              value={FirmaApiUrl}
              autoCapitalize="none"
              placeholderTextColor={colors.black}
              secureTextEntry={!isPasswordVisible}
            />
             <Text style={[MainStyles.fontSize12, MainStyles.marginBottom5, MainStyles.marginTop10, MainStyles.fontWeightBold]}>Mikro Api Url</Text>
            <TextInput
              style={[MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.marginBottom10, MainStyles.borderRadius5, MainStyles.fontSize12, MainStyles.height40, MainStyles.paddingLeft10]}
              placeholder='Mikro Api Url Giriniz'
              onChangeText={(text) => handleServiceSettingsChange('MikroApiUrl', text)}
              value={MikroApiUrl}
              autoCapitalize="none"
              placeholderTextColor={colors.black}
              secureTextEntry={!isPasswordVisible}
            />

             <Text style={[MainStyles.fontSize12, MainStyles.marginBottom5, MainStyles.marginTop10, MainStyles.fontWeightBold]}>Firma No</Text>
            <TextInput
              style={[MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.marginBottom10, MainStyles.borderRadius5, MainStyles.fontSize12, MainStyles.height40, MainStyles.paddingLeft10]}
              placeholder='Firma No Giriniz'
              onChangeText={(text) => handleServiceSettingsChange('FirmaNo', text)}
              value={FirmaNo}
              autoCapitalize="none"
              placeholderTextColor={colors.black}
            />
             <Text style={[MainStyles.fontSize12, MainStyles.marginBottom5, MainStyles.marginTop10, MainStyles.fontWeightBold]}>Şube No</Text>
            <TextInput
             style={[MainStyles.borderWidth1, MainStyles.borderColor, MainStyles.marginBottom10, MainStyles.borderRadius5, MainStyles.fontSize12, MainStyles.height40, MainStyles.paddingLeft10]}
              placeholder='Şube No Giriniz'
              onChangeText={(text) => handleServiceSettingsChange('SubeNo', text)}
              value={SubeNo}
              autoCapitalize="none"
              placeholderTextColor={colors.black}
            />
            <Button
              title="Kaydet"
              onPress={handleModalSave}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Login;
