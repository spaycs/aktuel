
import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, View, Alert, FlatList, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
import { MainStyles } from '../../res/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../components/userDetail/Id';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuthDefault } from '../../components/DefaultUser';
import { Ara, Filtre, Takvim } from '../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../res/colors';
import CariListModal from '../../context/CariListModal';
import FastImage from 'react-native-fast-image';

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

const CariSiparisFoyu = ({ navigation, route  }) => {
  const { cariKod } = route.params;
  const [Teslim_Edilen_Miktaru, setTeslim_Edilen_Miktaru] = useState('');
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

  useEffect(() => {
    if (cariKod) {
      fetchData(); // Eğer cari kod varsa veriyi çek
    }
  }, [cariKod, startDate, endDate]);

  

  // Cari seçimi fonksiyonu
  const handleCariSelect = (selectedCari) => {
    setTeslim_Edilen_Miktaru(selectedCari.Cari_Kod);
    setIsCariListModalVisible(false);
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
      const response = await axiosLinkMain.get(`/Api/Raporlar/CariSiparisFoyu?cari=${cariKod}&ilktarih=${formatDateForApi(startDate)}&sontarih=${formatDateForApi(endDate)}`);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
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
 // Kullanıcı için tarih formatlama (gün.ay.yıl)
 const formatDateForUser = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// API için tarih formatlama (ay-gün-yıl)
const formatDateForApi = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
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
      {/* Cari Kodu Seçim Alanı */}
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
});
export default CariSiparisFoyu;
