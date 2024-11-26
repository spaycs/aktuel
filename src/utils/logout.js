import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogout = async (navigation, setId) => {
  Alert.alert(
    'Çıkış Yap',
    'Hesabınızdan çıkmak istediğinizden emin misiniz?',
    [
      {
        text: 'Evet',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('userPassword');
            setId(""); // Id'yi sıfırlayın
            navigation.navigate('Login'); 
          } catch (error) {
            console.error('Çıkış işlemi sırasında hata oluştu:', error);
          }
        },
      },
      {
        text: 'Hayır',
        style: 'cancel',
      },
      
    ],
    { cancelable: false }
  );
};
