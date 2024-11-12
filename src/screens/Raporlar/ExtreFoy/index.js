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

  const [filters, setFilters] = useState({
    TARIH: '',
    VADETARIHI: '',
    BELGETIPI: '',
    BELGENO: '',
    ACIKLAMA: '',
    BORC: '',
    ALACAK: '',
    CARIKOD: '',
    DOVIZ: '',
    BAKIYE: '',
    ORTALAMAVADE: '',
    SonBakiye: '',
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'decimal',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price);
    };

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
  };

  const filterData = (data) => {
    return data.filter(item => {
      // Her sütun için filtrelemeyi sadece string veri üzerinde yapıyoruz
      const itemToplam = item.Toplam ? item.Toplam.toString() : '';
  
      return (
        (!filters.TARIH || (item.TARIH && item.TARIH.toLowerCase().includes(filters.TARIH.toLowerCase()))) &&
        (!filters.VADETARIHI || (item.VADETARIHI && item.VADETARIHI.toLowerCase().includes(filters.VADETARIHI.toLowerCase()))) &&
        (!filters.BELGETIPI || (item.BELGETIPI && item.BELGETIPI.toLowerCase().includes(filters.BELGETIPI.toLowerCase()))) &&
        (!filters.BELGENO || (item.BELGENO && item.BELGENO.toLowerCase().includes(filters.BELGENO.toLowerCase()))) &&
        (!filters.ACIKLAMA || (item.ACIKLAMA && item.ACIKLAMA.toLowerCase().includes(filters.ACIKLAMA.toLowerCase()))) &&
        (!filters.BORC || (item.BORC && item.BORC.toLowerCase().includes(filters.BORC.toLowerCase()))) &&
        (!filters.ALACAK || (item.ALACAK && item.ALACAK.toLowerCase().includes(filters.ALACAK.toLowerCase()))) &&
        (!filters.CARIKOD || (item.CARIKOD && item.CARIKOD.toLowerCase().includes(filters.CARIKOD.toLowerCase()))) &&
        (!filters.DOVIZ || (item.DOVIZ && item.DOVIZ.toLowerCase().includes(filters.DOVIZ.toLowerCase()))) &&
        (!filters.BAKIYE || (item.BAKIYE && item.BAKIYE.toLowerCase().includes(filters.BAKIYE.toLowerCase()))) &&
        (!filters.ORTALAMAVADE || (item.ORTALAMAVADE && item.ORTALAMAVADE.toLowerCase().includes(filters.ORTALAMAVADE.toLowerCase()))) &&
        (!filters.SonBakiye || (item.SonBakiye && item.SonBakiye.toLowerCase().includes(filters.SonBakiye.toLowerCase()))) 
      );
    });
  };
  

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
      const response = await axiosLinkMain.get(`/Api/Raporlar/ExtreFoy?cari=${cariKodu}&ilktarih=${formatDate(startDate)}&sontarih=${formatDate(endDate)}`);
      setData(response.data);
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

  // Tarih formatlama
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
     return `${month}-${day}-${year}`;
  };

  return (
    <View style={styles.container}>
      {/* Cari Kodu Seçim Alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
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
              <Text style={styles.dateText}>{formatDate(startDate)}</Text>
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
              <Text style={styles.dateText}>{formatDate(endDate)}</Text>
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
        source={require('../../../res/images/image/pageloading.gif')}
        resizeMode={FastImage.resizeMode.contain}/>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : searchClicked && !data ? (
        <Text style={styles.noDataText}>Veri bulunamadı</Text>
      ) : data ? (
      <ScrollView >
      <ScrollView horizontal={true} style={styles.horizontalScroll}>
        <Grid>
          {/* Header Row */}
          <Row style={styles.tableHeader}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <Text style={styles.colTitle}>TARIH</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>VADETARIHI</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>BELGETIPI</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>BELGENO</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>ACIKLAMA</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>BORC</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>ALACAK</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>CARIKOD</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>DOVIZ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>BAKIYE</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>ORTALAMAVADE</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>SonBakiye</Text>
            </Col>
          </Row>
      
          {/* Filter Row */}
          <Row style={styles.tableHeaderFiltre}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.TARIH}
                  onChangeText={(text) => handleFilterChange('TARIH', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.VADETARIHI}
                  onChangeText={(text) => handleFilterChange('VADETARIHI', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.BELGETIPI}
                  onChangeText={(text) => handleFilterChange('BELGETIPI', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.BELGENO}
                  onChangeText={(text) => handleFilterChange('BELGENO', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.ACIKLAMA}
                  onChangeText={(text) => handleFilterChange('ACIKLAMA', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.BORC}
                  onChangeText={(text) => handleFilterChange('BORC', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.ALACAK}
                  onChangeText={(text) => handleFilterChange('ALACAK', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.CARIKOD}
                  onChangeText={(text) => handleFilterChange('CARIKOD', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.DOVIZ}
                  onChangeText={(text) => handleFilterChange('DOVIZ', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.BAKIYE}
                  onChangeText={(text) => handleFilterChange('BAKIYE', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.ORTALAMAVADE}
                  onChangeText={(text) => handleFilterChange('ORTALAMAVADE', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.SonBakiye}
                  onChangeText={(text) => handleFilterChange('SonBakiye', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
           
            {/* Diğer aylar için de aynı şekilde devam edin */}
          </Row>
      
          {/* Data Rows */}
          {filterData(data).map((item, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedRowIndex(index)}>
            <Row style={[styles.tableRow, selectedRowIndex === index && styles.selectedRow]}>
              <Col style={[styles.tableCell, { width: 120 }]}>
                <Text style={styles.cellText}>{item.TARIH}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.VADETARIHI}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.BELGETIPI}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.BELGENO}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.ACIKLAMA}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.BORC)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.ALACAK)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.CARIKOD}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.DOVIZ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.BAKIYE)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.ORTALAMAVADE)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.SonBakiye)}</Text>
              </Col>
            </Row>
            </TouchableOpacity>
          ))}
      
        </Grid>
      </ScrollView>
      </ScrollView>
      
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.textInputBg,
    borderRadius: 5,
    padding: 10,
    color: colors.black,
    backgroundColor: colors.white,
    fontSize: 13,
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
    marginLeft: 15,
    padding: 17,
    borderRadius: 10,
    backgroundColor: colors.red,
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
    width: '%50'
  },
  dateText: {
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
  list: {
    flexGrow: 1,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemValue: {
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  horizontalScroll: {
    marginTop: 20,
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  tableHeader: {
    backgroundColor: '#f3f3f3', // Başlık arka plan rengi
    borderWidth: 1,
    borderColor: colors.textInputBg,
    maxHeight: 50 
  },
  tableHeaderFiltre: {
    backgroundColor: '#f2f2f2', // Başlık arka plan rengi
    borderWidth: 1,
    borderColor: colors.textInputBg,
    height: 30,
  },
  tableRow: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.textInputBg,
    height: 40,
  },
  tableCell: {
    borderRightWidth: 1, // Hücreler arasına dikey çizgi ekler
    borderRightColor: '#e0e0e0', // Hücre dikey çizgi rengi
    justifyContent: 'left', // Hücrelerin içeriğini ortalamak
    paddingHorizontal: 10,
    
  },
  tableToplamCell: {
    justifyContent: 'left', // Hücrelerin içeriğini ortalamak
    paddingLeft: 10,
  },
  cellText: {
    flex: 1,
    fontSize: 10,
    flexWrap: 'wrap', // Metni birden fazla satıra sarmasına izin verir
    textAlign: 'left', // Metin hizalamasını sol yapar
    
  },
  inputStyle:{
    borderRadius: 10,
    textAlign: 'left',
    marginBottom: 12,
    backgroundColor: colors.textInputBg,
  },
  textStyle:{
    fontSize: 13,
    color: colors.black,
    textAlign: 'left',
  },
  textInputStyle: {
    width: 110, // Adjust this value
    height: 40, // Adjust this value
    fontSize: 12,
  },
  textInputStyle2: {
    width: 90, // Adjust this value
    height: 40, // Adjust this value
    fontSize: 12,
  },
  iconStyle: {
    left: -8,
    top: 10,
    position : 'absolute',
  },
  iconStyle2: {
    left: -8,
    top: 10,
    position : 'absolute',
  },
  colTitle:{
    paddingVertical: 15,
    fontSize: 12,
  },
  selectedRow: {
    // Seçilen satırın arka plan rengi
    backgroundColor: '#e0f7fa',
  },
});

export default ExtreFoy;
