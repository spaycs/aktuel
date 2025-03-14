import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import axiosLinkMain from '../../utils/axiosMain'; // axiosLinkMain dosyasının yolunu kontrol edin
import { colors } from '../../res/colors'; // Renkler için stil dosyasını ayarlayın
import CariListModal from '../../context/CariListModal'; // Cari seçimi için modal
import { Ara } from '../../res/images';
import FastImage from 'react-native-fast-image';
import { Filtre } from '../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { useAuthDefault } from '../../components/DefaultUser';
import { MainStyles } from '../../res/style';
import { PDF } from '../../res/images'; 
import { Linking, Alert } from 'react-native';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const CariHareketFoyu = ({ navigation, route }) => {
  const { cariKod } = route.params;
  const { defaults } = useAuthDefault();
  const [cariKodu, setCariKodu] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false); 
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
  };

   // API'den veri çekme fonksiyonu
   const fetchData = async () => {

    if (!startDate || !endDate) {
      setError('Başlangıç ve bitiş tarihlerini seçiniz.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (defaults) {
      const firmaNo = defaults[0].IQ_FirmaNo;
      const response = await axiosLinkMain.get(`/Api/Raporlar/CariHaraketFoyu?firmano=${firmaNo}&cari=${cariKod}&ilktarih=${formatDateForApi(startDate)}&sontarih=${formatDateForApi(endDate)}`);
      //console.log(response);
      setData(response.data);
      setFilteredData(response.data);
    } else {
      console.error('IQ_FirmaNo değeri bulunamadı');
    }}
    catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cariKod) {
      fetchData(); // Eğer cari kod varsa veriyi çek
    }
  }, [cariKod, startDate, endDate]);

  // Cari seçimi fonksiyonu
  const handleCariSelect = (selectedCari) => {
    setCariKodu(selectedCari.Cari_Kod);
    setIsCariListModalVisible(false);
  };

 
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // Ayın ilk günü
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0); // Ayın son günü
  });
  
  
  // Tarih değişimini yönetme fonksiyonları
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };
  
  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };
  
  
  // Tarih formatlama
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

// Kullanıcı için tarih formatlama (gün.ay.yıl)
const formatDateForUser = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Tarih formatlama (API için gönderim: yıl-ay-gün)
const formatDateForApi = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
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

  const handlePdfClick = async (seri, sira) => {
    try {
      if (!seri || !sira) {
        Alert.alert('Hata', 'Eksik veri: Evrak Seri veya Sıra bulunamadı.');
        return;
      }
  
      console.log(`📄 API'ye İstek: Seri=${seri}, Sıra=${sira}`);
  
      const response = await axiosLinkMain.get(`/Api/PDF/FaturaPDF?seri=${seri}&sira=${sira}`);
  
      console.log('📄 API Yanıtı:', response.data);
  
      if (response.status !== 200) {
        throw new Error(`API Yanıt Kodu: ${response.status}`);
      }
  
      const pdfPath = response.data;
  
      if (!pdfPath || pdfPath.includes('hata') || pdfPath.includes('error')) {
        Alert.alert('Hata', 'API PDF dosya yolu döndüremedi.');
        return;
      }
  
      Linking.openURL(pdfPath); // PDF'yi aç
    } catch (error) {
      console.error('❌ PDF Hata:', error.response ? error.response.data : error.message);
      Alert.alert('Hata', error.response?.data?.message || 'PDF alınırken bir hata oluştu.');
    }
  };
  
  
 // 📌 **FlatList ile Satırları Gösterme ve PDF Butonunu Ekleme**
const renderItem = ({ item }) => {
  return (
    <View style={styles.row}>
      {Object.entries(item).map(([key, value], colIndex) => (
        <Text key={colIndex} style={styles.cell}>
          {value === null || value === undefined
            ? '-' // Boş değerler için gösterim
            : key === "Sıra"
            ? value // 📌 **Sıra değerini değiştirmeden göster**
            : typeof value === "number"
            ? new Intl.NumberFormat("tr-TR", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              }).format(value) // 📌 **Diğer sayıları formatla**
            : value}
        </Text>
      ))}

      {/* 📌 **PDF Butonu Ekleyelim** */}
      <TouchableOpacity onPress={() => handlePdfClick(item.Seri, item.Sıra)} style={styles.pdfButton}>
        <PDF width={25} height={25} />
      </TouchableOpacity>
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
        {/* Tarih Seçimi */}
        <View style={[styles.datePickerContainer, { flex: 1 }]}>
          
          <Text style={styles.dateTitle}>Başlangıç Tarihi</Text>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDateForUser(startDate)}</Text>
            </View>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
            style={{position: 'absolute', top: 20, width: 100, backgroundColor: colors.white}}
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View style={[styles.datePickerContainer, { flex: 1 }]}>
          <Text style={styles.dateTitle}>Bitiş Tarihi</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDateForUser(endDate)}</Text>
            </View>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
            style={{position: 'absolute', top: 20, width: 100, backgroundColor: colors.white}}
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>

      <TouchableOpacity onPress={fetchData} style={styles.button}>
        <Text style={styles.buttonText}>Listele</Text>
      </TouchableOpacity>
      </View>
      {/* Ara Butonu */}
     

      {loading ? (
       <FastImage
       style={MainStyles.loadingGif}
       source={require('../../res/images/image/pageloading.gif')}
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

      {/* Cari Seçim Modal'ı */}
      <CariListModal
        isVisible={isCariListModalVisible}
        onSelectCari={handleCariSelect}
        onClose={() => setIsCariListModalVisible(false)}
      />
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
  pdfButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
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
    marginTop: 10,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
});
export default CariHareketFoyu;
