import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataTable } from 'react-native-paper';
import axiosLinkMain from '../../utils/axiosMain';
import { colors } from '../../res/colors';
import FastImage from "react-native-fast-image";
import axios from 'axios';
import { useAuthDefault } from '../../components/DefaultUser';

const PatronRaporu = () => {
    const { defaults } = useAuthDefault();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
          Message: 'Patron Raporu Sayfa Açıldı', // Hardcoded message
          User: defaults[0].Adi, // Temsilci ID
          database: defaults[0].IQ_Database, // Database ID
          data: 'Patron Raporu' // Hardcoded data
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

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setStartDate(firstDayOfMonth);
  }, []);

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosLinkMain.get(
        `/Api/Raporlar/PatronEkrani?ilktarih=${formatDate(startDate)}&sontarih=${formatDate(endDate)}`
      );
      setData(response.data);
    } catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  },[]);

  return (
    <View style={styles.container}>
      {/* Tarih Seçimi */}
      <View style={styles.inputContainer}>
      <View style={[styles.datePickerContainer, { flex: 1 }]}>
        <Text style={styles.dateTitle}>Başlangıç Tarihi</Text>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </View>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
          style={{position: 'absolute', marginTop:22, width:90, backgroundColor: colors.textinputgray}}
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
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </View>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
          style={{position: 'absolute', marginTop:22, width:90,  backgroundColor: colors.textinputgray}}
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </View>

      {/* Ara Butonu */}
      <TouchableOpacity onPress={fetchData} style={styles.buttonSearch}>
        <Text style={styles.buttonText}>Ara</Text>
      </TouchableOpacity>
      </View>
      {/* Veri Gösterimi */}
      {loading ? (
        <FastImage
        style={styles.loadingGif}
        source={require('../../res/images/image/pageloading.gif')}
        resizeMode={FastImage.resizeMode.contain}
      />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length > 0 ? (
        <ScrollView style={styles.resultContainer}>
          <DataTable>
          <DataTable.Header>
            <DataTable.Title>Tip</DataTable.Title>
            <DataTable.Title numeric>Veri</DataTable.Title>
          </DataTable.Header>

          {data.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.Tip}</DataTable.Cell>
              <DataTable.Cell numeric>
                {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.veri)}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        </ScrollView>
      ) : (
        <Text style={styles.noDataText}></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  datePickerContainer: {
    marginRight: 10,
  },
  dateTitle: {
    fontSize: 13,
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
  buttonSearch: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
  loading: {
    marginTop: 20,
  },
  loadingGif: {
    width: 70,
    height: 50,
    alignSelf: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  resultContainer: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: colors.ustmenubggray,
  },
  noDataText: {
    marginTop: 20,
    fontSize: 13,
    color: colors.text,
  },
});

export default PatronRaporu;
