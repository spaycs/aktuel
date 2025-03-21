import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, View, Alert, FlatList, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
import { MainStyles } from '../../res/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../components/userDetail/Id';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuthDefault } from '../../components/DefaultUser';
import { Filtre, Takvim } from '../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../res/colors';
import FastImage from 'react-native-fast-image';
import axios from 'axios';

const turkishCharacterMap = {
  'Ç': 'c', 'ç': 'c',
  'Ğ': 'g', 'ğ': 'g',
  'I': 'i', 'İ': 'i',
  'Ö': 'o', 'ö': 'o',
  'Ş': 's', 'ş': 's',
  'Ü': 'u', 'ü': 'u'
};

const normalizeText = (text) => {
  return text
    .normalize('NFD')  // Normalleştirme, diakritikleri ayırır
    .replace(/[\u0300-\u036f]/g, '')  // Diakritik işaretlerini kaldır
    .replace(/[ÇçĞğIİÖöŞşÜü]/g, (char) => turkishCharacterMap[char] || char)  // Türkçe karakterleri dönüştür
    .toLowerCase();  // Küçük harfe çevir
};

const StokHareketFoyu = ({ navigation, route  }) => {
  const { Stok_Kod } = route.params;
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [personelList, setPersonelList] = useState([]); 
  const [selectedPersonel, setSelectedPersonel] = useState(''); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchClicked, setSearchClicked] = useState(false); 
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [date, setDate] = useState(new Date());
  const [evrakDate, setEvrakDate] = useState(new Date());
  const [showIlkTarihPicker, setShowIlkTarihPicker] = useState(false);
  const [showSonTarihPicker, setShowSonTarihPicker] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

   // State Yönetimi
   const [isLogSent, setIsLogSent] = useState(false); // API çağrısının yapılıp yapılmadığını takip etmek için

   useEffect(() => {
     // İlk render'da sadece çalışacak
     const logHareket = async () => {
       if (isLogSent) return;  // Eğer log zaten gönderildiyse, fonksiyonu durdur

       try {
         if (!defaults || !defaults[0].Adi || !defaults[0].IQ_Database) {
           console.log('Adi veya IQ_Database değeri bulunamadı, API çağrısı yapılmadı.');
           return;
         }

         const body = {
           Message: 'Stok Hareket Föyü Açıldı', // Hardcoded message
           User: defaults[0].Adi, // Temsilci ID
           database: defaults[0].IQ_Database, // Database ID
           data: 'StokFoyu' // Hardcoded data
         };

         const response = await axios.post('http://80.253.246.89:8055/api/Kontrol/HareketLogEkle', body);

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

  const [ilkTarih, setIlkTarih] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // Ayın ilk günü
  });
  const [sonTarih, setSonTarih] = useState(new Date());
  
  // Tarih formatlama fonksiyonu
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  // İlk Tarih Değişikliği
  const handleIlkTarihChange = (event, selectedDate) => {
    const currentDate = selectedDate || ilkTarih;
    setShowIlkTarihPicker(false);
    setIlkTarih(currentDate);
  };
  
  // Son Tarih Değişikliği
  const handleSonTarihChange = (event, selectedDate) => {
    const currentDate = selectedDate || sonTarih;
    setShowSonTarihPicker(false);
    setSonTarih(currentDate);
  };
  

  // Veri çekme fonksiyonu
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const formattedIlkTarih = ilkTarih.toISOString().split('T')[0];
      const formattedSonTarih = sonTarih.toISOString().split('T')[0];

      const response = await axiosLinkMain.get(`/Api/Raporlar/StokFoyu?stokkod=${Stok_Kod}&ilktarih=${formattedIlkTarih}&sontarih=${formattedSonTarih}`);
      setData(response.data);
      setFilteredData(response.data);
      console.log(response)
    } catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Stok_Kod]);

  const renderHeader = () => {
    if (data.length === 0) return null; // Eğer veri yoksa başlık oluşturma
    const headers = Object.keys(data[0]); // İlk öğeden başlıkları al
    return (
      <View style={[styles.row, styles.headerRow]}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.cell}>
            {header.toUpperCase()} {/* Başlıkları büyük harfle yaz */}
          </Text>
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        {Object.values(item).map((value, colIndex) => (
          <Text key={colIndex} style={styles.cell}>
            {value === null || value === undefined
              ? '-' // Boş değerler için gösterim
              : typeof value === 'number'
              ? new Intl.NumberFormat('tr-TR', {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                }).format(value) // Binlik ayracı ve 3 ondalık
              : value}
          </Text>
        ))}
      </View>
    );
  };

  // Filtreleme işlevi
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredData(data); // Boşsa tüm veriyi göster
    } else {
      const normalizedTerm = term.toLowerCase();
      const filtered = data.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(normalizedTerm)
        )
      );
      setFilteredData(filtered);
    }
  };

  return (
    <View style={styles.container}>
       <View style={styles.inputContainer}>
        {/* İlk Tarih Seçimi */}
        <View style={[styles.datePickerContainer, { flex: 1 }]}>
        <Text style={styles.dateTitle}>İlk Tarih: </Text>
          <TouchableOpacity onPress={() => setShowIlkTarihPicker(true)}>
              <View style={styles.dateContainer}>
              <Takvim name="calendar-today" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(ilkTarih)}</Text>
            </View>
          </TouchableOpacity>
          {showIlkTarihPicker && (
            <DateTimePicker
             style={{position: 'absolute', top: 20, width: 100, backgroundColor: colors.white}}
              value={ilkTarih}
              mode="date"
              display="default"
              onChange={handleIlkTarihChange}
            />
          )}
        </View>

        {/* Son Tarih Seçimi */}
        <View style={[styles.datePickerContainer, { flex: 1 }]}>
        <Text style={styles.dateTitle}>Son Tarih Seç: </Text>
          <TouchableOpacity onPress={() => setShowSonTarihPicker(true)}>
              <View style={styles.dateContainer}>
              <Takvim name="calendar-today" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(sonTarih)}</Text>
            </View>
          </TouchableOpacity>
          {showSonTarihPicker  && (
            <DateTimePicker
            style={{position: 'absolute', top: 20, width: 100, backgroundColor: colors.white}}
              value={sonTarih}
              mode="date"
              display="default"
              onChange={handleSonTarihChange}
            />
          )}
        </View>

      {/* Listele Butonu */}
        <TouchableOpacity onPress={fetchData} style={styles.button}>
          <Text style={styles.buttonText}>Listele</Text>
        </TouchableOpacity>
    </View>
      
      {/* Filtreleme Alanı */}
     <View style={styles.filterRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filtrele..."
          placeholderTextColor={colors.black}
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
      <FastImage
      style={MainStyles.loadingGif}
      source={require('../../res/images/image/pageloading.gif')}
      resizeMode={FastImage.resizeMode.contain}/>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : searchClicked && !data ? (
        <Text style={styles.noDataText}>Veri bulunamadı</Text>
      ) : data ? (
        <View style={styles.container}>
        <ScrollView horizontal>
        <View>
          {/* Dinamik Başlık */}
          {renderHeader()}

          {/* FlatList ile Dikey Liste */}
          <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
        </View>
      </ScrollView>
      </View>
      
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 2,
    marginTop: 2,
    backgroundColor: colors.white
  },
  pickerContainer: {
    padding: 1,
    marginTop: 5,
  },
  pickerLabel: {
    fontSize: 12,
    marginBottom: 5,
   },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  headerRow: {
    backgroundColor: '#f3f3f3',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 125,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 10,
  },
  filterRow: {
    marginRight: 5,
    marginTop: 10,
  },
  filterInput: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.textInputBg,
    borderRadius: 5,
    padding: 8,
    fontSize: 12,
  },
  inputCariKodu: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.textInputBg,
    borderRadius: 5,
    padding: 10,
    fontSize: 12,
    color: colors.black,
    height: 40,
  },
  button: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  buttonSearch: {
    marginLeft: 10,
    padding: 17,
    borderRadius: 10,
    backgroundColor: colors.red,
    justifyContent: 'center',
    height: 40,
  },
  datePickerContainer: {
    marginRight: 10,
  },
  dateTitle: {
    fontSize: 11,
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.textInputBg,
    borderRadius: 5,
    padding: 10,
    backgroundColor: colors.white,
  },
  dateText: {
    fontSize: 13,
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  noDataText: {
    marginTop: 20,
    fontSize: 12,
    color: 'gray',
  },

  dateIcon: {
    marginRight: 10,
  },

});
export default StokHareketFoyu;
