import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axiosLinkMain from '../../../utils/axiosMain'; // axiosLinkMain dosyasının yolunu kontrol edin
import { colors } from '../../../res/colors'; // Renkler için stil dosyasını ayarlayın
import FastImage from 'react-native-fast-image';
import { MainStyles } from '../../../res/style';
import { useAuthDefault } from '../../../components/DefaultUser';
import axios from 'axios';

const PatronEkrani = () => {
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
         if (!defaults || !defaults[0].IQ_MikroPersKod || !defaults[0].IQ_Database) {
           console.log('IQ_MikroPersKod veya IQ_Database değeri bulunamadı, API çağrısı yapılmadı.');
           return;
         }
 
         const body = {
           Message: 'Patron Ekranı Rapor Açıldı', // Hardcoded message
           User: defaults[0].IQ_MikroPersKod, // Temsilci ID
           database: defaults[0].IQ_Database, // Database ID
           data: 'Patron Ekranı Rapor' // Hardcoded data
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
    return `${month}-${day}-${year}`;
  };

  // API'den veri çekme fonksiyonu
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosLinkMain.get(`/Api/Raporlar/PatronEkrani?ilktarih=${formatDate(startDate)}&sontarih=${formatDate(endDate)}`);
      setData(response.data);
    } catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Tarih Seçimi */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.dateTitle}>Başlangıç Tarihi</Text>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </View>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
          style={{position: 'absolute', backgroundColor: colors.textinputgray}}
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
      </View>

      <View style={styles.datePickerContainer}>
        <Text style={styles.dateTitle}>Bitiş Tarihi</Text>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </View>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
          style={{position: 'absolute', backgroundColor: colors.textinputgray}}
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

      {/* Veri Gösterimi */}
      {loading ? (
      <FastImage
      style={MainStyles.loadingGif}
      source={require('../../../res/images/image/pageloading.gif')}
      resizeMode={FastImage.resizeMode.contain}/>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length > 0 ? (
        <ScrollView style={styles.resultContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultTitle}>{item.Tip}</Text>
              <Text style={styles.resultValue}>{item.veri.toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>Veri bulunamadı</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
  },
  dateText: {
    fontSize: 16,
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
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultItem: {
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultValue: {
    fontSize: 24,
    color: colors.primary,
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.text,
  },
});

export default PatronEkrani;
