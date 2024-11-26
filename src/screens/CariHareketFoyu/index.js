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

  const [filters, setFilters] = useState({
    Tarih: '',
    Seri: '',
    Sıra: '',
    Belge_No: '',
    Evrak_Tipi: '',
    Cinsi: '',
    Sorumluluk_Merkezi_İsmi: '',
    Vade_Tarihi: '',
    Vade_Gün: '',
    B_A: '',
    Ana_Döviz_Borç: '',
    Ana_Döviz_Alacak: '',
  });

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
      const response = await axiosLinkMain.get(`/Api/Raporlar/CariHaraketFoyu?firmano=${firmaNo}&cari=${cariKod}&ilktarih=${formatDate(startDate)}&sontarih=${formatDate(endDate)}`);
      setData(response.data);
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

  const filterData = (data) => {
    return data.filter(item => {
      // Her sütun için filtrelemeyi sadece string veri üzerinde yapıyoruz
      const itemToplam = item.Toplam ? item.Toplam.toString() : '';
  
      return (
        (!filters.Tarih || (item.Tarih && item.Tarih.toString().includes(filters.Tarih.toLowerCase()))) &&
        (!filters.Seri || (item.Seri && item.Seri.toLowerCase().includes(filters.Seri.toLowerCase()))) &&
        (!filters.Sıra || (item.Sıra && item.Sıra.toString().includes(filters.Sıra.toLowerCase()))) &&
        (!filters.Belge_No || (item.Belge_No && item.Belge_No.toString().includes(filters.Belge_No.toLowerCase()))) &&
        (!filters.Evrak_Tipi || (item.Evrak_Tipi && item.Evrak_Tipi.toLowerCase().includes(filters.Evrak_Tipi.toLowerCase()))) &&
        (!filters.Cinsi || (item.Cinsi && item.Cinsi.toLowerCase().includes(filters.Cinsi.toLowerCase()))) &&
        (!filters.Sorumluluk_Merkezi_İsmi || (item.Sorumluluk_Merkezi_İsmi && item.Sorumluluk_Merkezi_İsmi.toLowerCase().includes(filters.Sorumluluk_Merkezi_İsmi.toLowerCase()))) &&
        (!filters.Vade_Tarihi || (item.Vade_Tarihi && item.Vade_Tarihi.toString().includes(filters.Vade_Tarihi.toLowerCase()))) &&
        (!filters.Vade_Gün || (item.Vade_Gün && item.Vade_Gün.toString().includes(filters.Vade_Gün.toLowerCase()))) &&
        (!filters.B_A || (item.B_A && item.B_A.toLowerCase().includes(filters.B_A.toLowerCase()))) &&
        (!filters.Ana_Döviz_Borç || (item.Ana_Döviz_Borç && item.Ana_Döviz_Borç.toString().includes(filters.Ana_Döviz_Borç.toLowerCase()))) &&
        (!filters.Ana_Döviz_Alacak || (item.Ana_Döviz_Alacak && item.Ana_Döviz_Alacak.toString().includes(filters.Ana_Döviz_Alacak.toLowerCase()))) 
      );
    });
  };
  

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
       source={require('../../res/images/image/pageloading.gif')}
       resizeMode={FastImage.resizeMode.contain}/>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : searchClicked && !data ? (
        <Text style={styles.noDataText}>Veri bulunamadı</Text>
      ) : data ? (
        <ScrollView style={styles.scrollView}>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
        <Grid>
          {/* Header Row */}
          <Row style={styles.tableHeader}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <Text style={styles.colTitle}>Tarih</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Seri</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Sıra</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Belge_No</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Evrak_Tipi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Cinsi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Sorumluluk_Merkezi_İsmi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Vade_Tarihi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Vade_Gün</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>B_A</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ana_Döviz_Borç</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ana_Döviz_Alacak</Text>
            </Col>
          </Row>
      
          {/* Filter Row */}
          <Row style={styles.tableHeaderFiltre}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Tarih}
                  onChangeText={(text) => handleFilterChange('Tarih', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Seri}
                  onChangeText={(text) => handleFilterChange('Seri', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Sıra}
                  onChangeText={(text) => handleFilterChange('Sıra', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Belge_No}
                  onChangeText={(text) => handleFilterChange('Belge_No', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Evrak_Tipi}
                  onChangeText={(text) => handleFilterChange('Evrak_Tipi', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Cinsi}
                  onChangeText={(text) => handleFilterChange('Cinsi', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Sorumluluk_Merkezi_İsmi}
                  onChangeText={(text) => handleFilterChange('Sorumluluk_Merkezi_İsmi', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Vade_Tarihi}
                  onChangeText={(text) => handleFilterChange('Vade_Tarihi', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Vade_Gün}
                  onChangeText={(text) => handleFilterChange('Vade_Gün', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.B_A}
                  onChangeText={(text) => handleFilterChange('B_A', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Ana_Döviz_Borç}
                  onChangeText={(text) => handleFilterChange('Ana_Döviz_Borç', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Ana_Döviz_Alacak}
                  onChangeText={(text) => handleFilterChange('Ana_Döviz_Alacak', text)}
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
                <Text style={styles.cellText}>{item.Tarih}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Seri}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Sıra}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Belge_No}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Evrak_Tipi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Cinsi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Sorumluluk_Merkezi_İsmi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Vade_Tarihi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Vade_Gün}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.B_A}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Ana_Döviz_Borç}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Ana_Döviz_Alacak}</Text>
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
export default CariHareketFoyu;
