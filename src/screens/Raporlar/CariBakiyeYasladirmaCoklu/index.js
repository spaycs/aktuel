import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import axiosLinkMain from '../../../utils/axiosMain'; // axiosLinkMain dosyasının yolunu kontrol edin
import { colors } from '../../../res/colors'; // Renkler için stil dosyasını ayarlayın
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Ara, Filtre } from '../../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import CariListModal from '../../../context/CariListModal';
import FastImage from 'react-native-fast-image';
import { MainStyles } from '../../../res/style';
import { useAuthDefault } from '../../../components/DefaultUser';

const CariBakiyeYasladirmaCoklu = () => {
    const { defaults } = useAuthDefault();
  const [sth_cari_kodu, setStHCariKodu] = useState('');
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [temsilci, setTemsilci] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [personelList, setPersonelList] = useState([]); 
  const [selectedPersonel, setSelectedPersonel] = useState(''); 

  const [searchClicked, setSearchClicked] = useState(false); 
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  
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
           Message: 'Cari Bakiye Yaşlandırma Çoklu Rapor Açıldı', // Hardcoded message
           User: defaults[0].Adi, // Temsilci ID
           database: defaults[0].IQ_Database, // Database ID
           data: 'Cari Bakiye Yaşlandırma Çoklu Rapor' // Hardcoded data
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


  // Cari seçimi fonksiyonu
  const handleCariSelect = (selectedCari) => {
    if (selectedCari && selectedCari.Cari_Kod) {
      setStHCariKodu(selectedCari.Cari_Kod);
      fetchData(selectedCari.Cari_Kod);
    } else {
      console.error('Selected cari kodu is missing.');
    }
    setIsCariListModalVisible(false);
  };
  
  // Cari kodu seçim modal'ını aç
  const handleCariKoduClick = () => {
    setIsCariListModalVisible(true);
  };

  const fetchData = async (cariKodu) => {
    if (!cariKodu) {
      console.error('Cari Kodu is empty.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosLinkMain.get(`/Api/Raporlar/CariBakiyeYasladirmaCoklu?temsilci=${cariKodu}`);
      console.log('API Response:', response.data); // Yanıtı kontrol etmek için ekledik
      if (Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        console.warn('API response is not an array:', response.data);
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>Cari Seçimi</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputCariKodu}
          placeholder="Cari Kodu"
          value={sth_cari_kodu}
          placeholderTextColor={colors.placeholderTextColor}
          autoFocus={true}
          selection={{start:0, end:0}}
          editable={false}
        />
      <TouchableOpacity onPress={() => setIsCariListModalVisible(true)} style={styles.buttonSearch}>
          <Ara />
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
       source={require('../../../res/images/image/pageloading.gif')}
       resizeMode={FastImage.resizeMode.contain}/>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length === 0 ? (
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

      <CariListModal
        isVisible={isCariListModalVisible}
        onSelectCari={handleCariSelect}
        onClose={() => setIsCariListModalVisible(false)}
      />
      </View>
    </ScrollView>
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
  loading: {
    marginTop: 20,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  buttonSearch: {
    marginLeft: 10,
    padding: 17,
    borderRadius: 10,
    backgroundColor: colors.red,
    justifyContent: 'center',
    height: 40,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
  },
    
  });
  

export default CariBakiyeYasladirmaCoklu;
