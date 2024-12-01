import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import axiosLinkMain from '../../../utils/axiosMain'; // axiosLinkMain dosyasının yolunu kontrol edin
import { colors } from '../../../res/colors'; // Renkler için stil dosyasını ayarlayın
import CariListModal from '../../../context/CariListModal'; // Cari seçimi için modal
import { Ara } from '../../../res/images';
import FastImage from 'react-native-fast-image';
import { Filtre } from '../../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { MainStyles } from '../../../res/style';


const ExtreFoy = () => {
  const [cariKodu, setCariKodu] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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

  // Cari seçimi fonksiyonu
  const handleCariSelect = (selectedCari) => {
    setCariKodu(selectedCari.Cari_Kod);
    setIsCariListModalVisible(false);
  };

  // API'den veri çekme fonksiyonu
  const fetchData = async () => {
    if (!cariKodu) {
      setError('Cari kodu seçiniz.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Başlangıç ve bitiş tarihlerini seçiniz.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axiosLinkMain.get(`/Api/Raporlar/ExtreFoy?cari=${cariKodu}&ilktarih=${formatDateForApi(startDate)}&sontarih=${formatDateForApi(endDate)}`);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setStartDate(firstDayOfMonth);
  }, []);

  // Tarih değişimini yönetme fonksiyonları
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

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
      <Text style={styles.pickerLabel}>Cari Seçimi</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputCariKodu}
          placeholder="Cari Kodu"
          value={cariKodu}
          onChangeText={setCariKodu}
          editable={false}
          placeholderTextColor={colors.black}
        />
        <TouchableOpacity onPress={() => setIsCariListModalVisible(true)} style={styles.buttonSearch}>
          <Ara />
        </TouchableOpacity>
      </View>
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
            style={{position: 'absolute', marginTop: 20, width: 90, backgroundColor: colors.textinputgray}}
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
            style={{position: 'absolute', marginTop: 20, width: 100, backgroundColor: colors.textinputgray}}
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
    marginTop: 10,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
 
});

export default ExtreFoy;
