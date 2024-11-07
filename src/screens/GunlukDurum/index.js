import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axiosLink from '../../utils/axios';
import { colors } from '../../res/colors';
import { MikroIQ, Takvim } from '../../res/images';
import axiosLinkMain from '../../utils/axiosMain';

const GunlukDurum = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [depoQuantity, setDepoQuantity] = useState(0);

  const fetchStockData = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Stok/StokListesi');
      if (response.data.length > 0) {
        const firstItemQuantity = response.data[0].Depodaki_Miktar;
        setDepoQuantity(firstItemQuantity);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate || date);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.datePickerContainer}>
        <Text style={styles.dateTitle}>İlk Tarih</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <View style={styles.dateContainer}>
          <Takvim name="calendar-today" color={colors.darkGray} style={styles.dateIcon} />
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      <View style={styles.datePickerContainer}>
      <Text style={styles.dateTitle}>Son Tarih</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <View style={styles.dateContainer}>
          <Takvim name="calendar-today" color={colors.darkGray} style={styles.dateIcon} />
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Sipariş Tutarı</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Satış Tutarı</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Alış Tutarı</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Nakit Tutarı</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Çek Tutarı</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Kredi Kartı Tutarı</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Senet Tutarı</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
        <View style={styles.statsContainerTab}>
          <Text style={styles.title}>Toplam Depodaki Miktar</Text>
          <Text style={styles.value}>{depoQuantity}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: colors.black,
  },
  dateIcon: {
    marginRight: 10,
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: colors.white,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: colors.white,
  },
  statsContainerTab: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  dateContainer:{
    flexDirection: 'row',
  },
});

export default GunlukDurum;
