import React, { useContext,useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../context/UserContext';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';
import axios from 'axios';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { color: colors.black };

const MarketDetail = ({ route, navigation }) => {
  const { userId } = useContext(UserContext);
  const { marketId, name } = route.params;
  const [katalogList, setKatalogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogSent, setIsLogSent] = useState(false); // API çağrısının yapılıp yapılmadığını takip etmek için
    useEffect(() => {
      // İlk render'da sadece çalışacak
      const logHareket = async () => {
        if (isLogSent) return;  // Eğer log zaten gönderildiyse, fonksiyonu durdur
        const platform = Platform.OS === 'android' ? 'Android' : 'iOS';
        try {
          const body = {
            Message: 'Market Sayfası Açıldı', // Hardcoded message
            Data: `Market Adı: ${name} - ${platform}`,
            User: userId,
          };
  
          const response = await axios.post('http://31.210.85.83:8055/api/Log/HareketLogEkle', body);
  
          if (response.status === 200) {
            console.log('Hareket Logu başarıyla eklendi');
            setIsLogSent(true); // Başarıyla log eklendikten sonra flag'i true yap
          } else {
            console.log('Hareket Logu eklenirken bir hata oluştu');
          }
        } catch (error) {
          console.error('API çağrısı sırasında hata oluştu:', error);
        }
      };
  
      logHareket(); // Sayfa yüklendiğinde API çağrısını başlat
    }, []); // Boş bağımlılık dizisi, yalnızca ilk render'da çalışacak
  useEffect(() => {
    const fetchKatalogList = async () => {
      try {
        const response = await axiosLinkMain.get(
          `/api/AktuelGunler/AktuelGunler?magazaid=${marketId}`
        );
        const formattedData = response.data.map(item => ({
          id: item.AktuelId.toString(),
          title: item.AktuelGunler,
        }));
        setKatalogList(formattedData);
      } catch (error) {
        console.log('Aktüel günler çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKatalogList();
  }, [marketId]);

  const handleDatePress = (item) => {
    navigation.navigate('KatalogSlider', {
      katalogId: item.id,
      marketId: marketId, // marketId'yi de ekliyoruz!
    });
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleDatePress(item)}
    >
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary || 'gray'} />
      ) : (
        <FlatList
          data={katalogList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default MarketDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
});
