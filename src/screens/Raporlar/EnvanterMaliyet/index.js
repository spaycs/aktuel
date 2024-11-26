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


const EnvanterMaliyet = () => {
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
  const [page, setPage] = useState(1);
const [loadingMore, setLoadingMore] = useState(false);
const [hasMoreData, setHasMoreData] = useState(true);


  const [filters, setFilters] = useState({
    kod: '',
    Stok_Adı: '',
    Ana_Grup: '',
    Üretici: '',
    Alt_Grup: '',
    Birim: '',
    Miktar: '',
    Maliyet: '',
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
        (!filters.kod || (item.kod && item.kod.toLowerCase().includes(filters.kod.toLowerCase()))) &&
        (!filters.Stok_Adı || (item.Stok_Adı && item.Stok_Adı.toLowerCase().includes(filters.Stok_Adı.toLowerCase()))) &&
        (!filters.Ana_Grup || (item.Ana_Grup && item.Ana_Grup.toLowerCase().includes(filters.Ana_Grup.toLowerCase()))) &&
        (!filters.Üretici || (item.Üretici && item.Üretici.toLowerCase().includes(filters.Üretici.toLowerCase()))) &&
        (!filters.Alt_Grup || (item.Alt_Grup && item.Alt_Grup.toLowerCase().includes(filters.Alt_Grup.toLowerCase()))) &&
        (!filters.Birim || (item.Birim && item.Birim.toLowerCase().includes(filters.Birim.toLowerCase()))) &&
        (!filters.Miktar || (item.Miktar && item.Miktar.toLowerCase().includes(filters.Miktar.toLowerCase()))) &&
        (!filters.Maliyet || (item.Maliyet && item.Maliyet.toLowerCase().includes(filters.Maliyet.toLowerCase()))) 
        
      );
    });
  };

  // Cari seçimi fonksiyonu
  const handleCariSelect = (selectedCari) => {
    setCariKodu(selectedCari.Cari_Kod);
    setIsCariListModalVisible(false);
  };

  const fetchData = async () => {

    if (loading || !hasMoreData) return;
    
    if (!startDate || !endDate) {
        setError('Başlangıç ve bitiş tarihlerini seçiniz.');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const response = await axiosLinkMain.get(`/Api/Raporlar/EnvanterMaliyetRaporu?ilktarih=${formatDate(startDate)}&sontarih=${formatDate(endDate)}&page=${page}`);
        
        if (response.data.length > 0) {
            setData(prevData => [...prevData, ...response.data]); // Önceki verileri koruyarak yeni verileri ekleyin
        } else {
            setHasMore(false); // Daha fazla veri yok
        }
        
        console.log('API Yanıtı:', response.data);
    } catch (error) {
        setError('Veri çekme hatası: ' + error.message);
    } finally {
        setLoading(false);
    }
};


const handleScroll = (event) => {
  const offsetY = event.nativeEvent.contentOffset.y;
  const contentHeight = event.nativeEvent.contentSize.height;
  const layoutHeight = event.nativeEvent.layoutMeasurement.height;

  // Kullanıcı sayfanın en altına yaklaştıysa ve yükleme işlemi yapılmıyorsa
  if (offsetY + layoutHeight >= contentHeight - 20 && !loading ) {
      setPage(prevPage => prevPage + 1); // Sayfayı artır
      fetchData(); // Yeni verileri yükle
  }
};

const renderItem = ({ item, index }) => (
  <TouchableOpacity onPress={() => setSelectedRowIndex(index)}>
    <Row style={[styles.tableRow, selectedRowIndex === index && styles.selectedRow]}>
      <Col style={[styles.tableCell, { width: 120 }]}>
        <Text style={styles.cellText}>{item.kod}</Text>
      </Col>
      <Col style={[styles.tableCell, { width: 100 }]}>
        <Text style={styles.cellText}>{item.Stok_Adı}</Text>
      </Col>
      <Col style={[styles.tableCell, { width: 100 }]}>
        <Text style={styles.cellText}>{item.Ana_Grup}</Text>
      </Col>
      <Col style={[styles.tableCell, { width: 100 }]}>
        <Text style={styles.cellText}>{item.Üretici}</Text>
      </Col>
      <Col style={[styles.tableCell, { width: 100 }]}>
        <Text style={styles.cellText}>{item.Alt_Grup}</Text>
      </Col>
      <Col style={[styles.tableCell, { width: 100 }]}>
        <Text style={styles.cellText}>{item.Birim}</Text>
      </Col>
      <Col style={[styles.tableCell, { width: 100 }]}>
        <Text style={styles.cellText}>{item.Miktar}</Text>
      </Col>
      <Col style={[styles.tableCell, { width: 100 }]}>
        <Text style={styles.cellText}>{formatPrice(item.Maliyet)}</Text>
      </Col>
    </Row>
  </TouchableOpacity>
);


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
         resizeMode={FastImage.resizeMode.contain}
      />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : searchClicked && !data ? (
        <Text style={styles.noDataText}>Veri bulunamadı</Text>
      ) : data ? (
        <ScrollView 
        style={styles.scrollView}
        onScroll={handleScroll} 
        scrollEventThrottle={16} // Kaydırma olayını daha hassas hale getirmek için
    >
      <ScrollView horizontal={true} style={styles.horizontalScroll}>
        <Grid>
          {/* Header Row */}
          <Row style={styles.tableHeader}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <Text style={styles.colTitle}>Stok Kodu</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Stok Adı</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ana Grup</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Üretici</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Alt Grup</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Birim</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Miktar</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Maliyet</Text>
            </Col>
          </Row>
      
          {/* Filter Row */}
          <Row style={styles.tableHeaderFiltre}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.kod}
                  onChangeText={(text) => handleFilterChange('kod', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Stok_Adı}
                  onChangeText={(text) => handleFilterChange('Stok_Adı', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Ana_Grup}
                  onChangeText={(text) => handleFilterChange('Ana_Grup', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Üretici}
                  onChangeText={(text) => handleFilterChange('Üretici', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Alt_Grup}
                  onChangeText={(text) => handleFilterChange('Alt_Grup', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Birim}
                  onChangeText={(text) => handleFilterChange('Birim', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Miktar}
                  onChangeText={(text) => handleFilterChange('Miktar', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Maliyet}
                  onChangeText={(text) => handleFilterChange('Maliyet', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            {/* Diğer aylar için de aynı şekilde devam edin */}
          </Row>
      
          <FlatList
            data={filterData(data)}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={selectedRowIndex}
          />
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
    justifyContent: 'flex-start', // Hücrelerin içeriğini ortalamak
    paddingHorizontal: 10,
    
  },
  tableToplamCell: {
    justifyContent: 'flex-start', // Hücrelerin içeriğini ortalamak
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

export default EnvanterMaliyet;
