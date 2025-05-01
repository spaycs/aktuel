import React, { useContext,useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  getAlisverisListesi,
  setAlisverisListesi,
} from '../../utils/alisverisStorage'; // ← path'e göre güncelle
import { UserContext } from '../../context/UserContext';
import { colors } from '../../res/colors';
import axios from 'axios';

const AlisverisListesi = () => {
  const { userId } = useContext(UserContext);
  const [itemText, setItemText] = useState('');
  const [items, setItems] = useState([]);
   const [isLogSent, setIsLogSent] = useState(false); // API çağrısının yapılıp yapılmadığını takip etmek için
        
          useEffect(() => {
            // İlk render'da sadece çalışacak
            const logHareket = async () => {
              if (isLogSent) return;  // Eğer log zaten gönderildiyse, fonksiyonu durdur
        
              try {
                const body = {
                  Message: 'Alışveriş Listesi Sayfası Açıldı', // Hardcoded message
                  Data: `Alışveriş Listesi `,   // Hardcoded data
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
    const loadData = async () => {
      const saved = await getAlisverisListesi();
      setItems(saved);
    };
    loadData();
  }, []);

  const handleAddItem = async () => {
    if (itemText.trim() === '') return;
  
    const trimmedItem = itemText.trim();
    const updated = [...items, trimmedItem];
    setItems(updated);
    await setAlisverisListesi(updated);
    setItemText('');
  
    // Log gönderimi
    try {
      const logBody = {
        Message: 'Alışveriş Listesine Ürün Eklendi',
        Data: `Eklenen Ürün: ${trimmedItem}`,
        User: userId,
      };
  
      const response = await axios.post('http://31.210.85.83:8055/api/Log/HareketLogEkle', logBody);
  
      if (response.status === 200) {
        console.log('Ürün ekleme logu başarıyla gönderildi');
      } else {
        console.log('Ürün ekleme logu gönderilirken hata oluştu');
      }
    } catch (error) {
      console.error('Ürün ekleme logu sırasında hata:', error);
    }
  };
  

  const handleDeleteItem = async (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
    await setAlisverisListesi(updated);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>{index + 1}. {item}</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(index)} style={styles.deleteButton}>
        <Icon name="trash" size={18} color="#d11a2a" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alışveriş Listesi</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={itemText}
          onChangeText={setItemText}
          placeholder="Ürün adı girin..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
          <Icon name="plus" size={15} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default AlisverisListesi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 8,
  },
  listContainer: {
    paddingBottom: 30,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 5,
  },
});
