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


const KasaAlacak = () => {
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
    B_A: '',
    KARŞI_HESAP_CİNSİ: '',
    CİNSİ: '',
    TARİH: '',
    EVRAK_TİPİ: '',
    HESAP_KODU: '',
    HESAP_İSMİ: '',
    KARŞI_HESAP_KODU: '',
    KARŞI_HESAP_İSMİ: '',
    AÇIKLAMA: '',
    ANA_DÖVİZ_TUTAR: '',
    ORJ_DOVİZ_KUR: '',
    C_ORJ_DOVİZ_: '',
    Orjinal_Döviz_TUTAR: '',
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
        (!filters.B_A || (item.B_A && item.B_A.toLowerCase().includes(filters.B_A.toLowerCase()))) &&
        (!filters.KARŞI_HESAP_CİNSİ || (item.KARŞI_HESAP_CİNSİ && item.KARŞI_HESAP_CİNSİ.toLowerCase().includes(filters.KARŞI_HESAP_CİNSİ.toLowerCase()))) &&
        (!filters.CİNSİ || (item.CİNSİ && item.CİNSİ.toLowerCase().includes(filters.CİNSİ.toLowerCase()))) &&
        (!filters.TARİH || (item.TARİH && item.TARİH.toLowerCase().includes(filters.TARİH.toLowerCase()))) &&
        (!filters.EVRAK_TİPİ || (item.EVRAK_TİPİ && item.EVRAK_TİPİ.toLowerCase().includes(filters.EVRAK_TİPİ.toLowerCase()))) &&
        (!filters.HESAP_KODU || (item.HESAP_KODU && item.HESAP_KODU.toLowerCase().includes(filters.HESAP_KODU.toLowerCase()))) &&
        (!filters.HESAP_İSMİ || (item.HESAP_İSMİ && item.HESAP_İSMİ.toLowerCase().includes(filters.HESAP_İSMİ.toLowerCase()))) &&
        (!filters.KARŞI_HESAP_KODU || (item.KARŞI_HESAP_KODU && item.KARŞI_HESAP_KODU.toLowerCase().includes(filters.KARŞI_HESAP_KODU.toLowerCase()))) &&
        (!filters.KARŞI_HESAP_İSMİ || (item.KARŞI_HESAP_İSMİ && item.KARŞI_HESAP_İSMİ.toLowerCase().includes(filters.KARŞI_HESAP_İSMİ.toLowerCase()))) &&
        (!filters.AÇIKLAMA || (item.AÇIKLAMA && item.AÇIKLAMA.toLowerCase().includes(filters.AÇIKLAMA.toLowerCase()))) &&
        (!filters.ANA_DÖVİZ_TUTAR || (item.ANA_DÖVİZ_TUTAR && item.ANA_DÖVİZ_TUTAR.toLowerCase().includes(filters.ANA_DÖVİZ_TUTAR.toLowerCase()))) &&
        (!filters.ORJ_DOVİZ_KUR || (item.ORJ_DOVİZ_KUR && item.ORJ_DOVİZ_KUR.toLowerCase().includes(filters.ORJ_DOVİZ_KUR.toLowerCase()))) &&
        (!filters.C_ORJ_DOVİZ_ || (item.C_ORJ_DOVİZ_ && item.C_ORJ_DOVİZ_.toLowerCase().includes(filters.C_ORJ_DOVİZ_.toLowerCase()))) &&
        (!filters.Orjinal_Döviz_TUTAR || (item.Orjinal_Döviz_TUTAR && item.Orjinal_Döviz_TUTAR.toLowerCase().includes(filters.Orjinal_Döviz_TUTAR.toLowerCase()))) 
       
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
   

    if (!startDate || !endDate) {
      setError('Başlangıç ve bitiş tarihlerini seçiniz.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axiosLinkMain.get(`/Api/Raporlar/KasaRaporuAlacak?ilktarih=${formatDate(startDate)}&sontarih=${formatDate(endDate)}`);
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
        <ScrollView style={styles.scrollView}>
      <ScrollView horizontal={true} style={styles.horizontalScroll}>
        <Grid>
          {/* Header Row */}
          <Row style={styles.tableHeader}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <Text style={styles.colTitle}>B_A</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>KARŞI_HESAP_CİNSİ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>CİNSİ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>TARİH</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>EVRAK_TİPİ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>HESAP_KODU</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>HESAP_İSMİ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>KARŞI_HESAP_KODU</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>KARŞI_HESAP_İSMİ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>AÇIKLAMA</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>ANA_DÖVİZ_TUTAR</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>ORJ_DOVİZ_KUR</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>C_ORJ_DOVİZ_</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Orjinal_Döviz_TUTAR</Text>
            </Col>
          </Row>
      
          {/* Filter Row */}
          <Row style={styles.tableHeaderFiltre}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.B_A}
                  onChangeText={(text) => handleFilterChange('B_A', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.KARŞI_HESAP_CİNSİ}
                  onChangeText={(text) => handleFilterChange('KARŞI_HESAP_CİNSİ', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.CİNSİ}
                  onChangeText={(text) => handleFilterChange('CİNSİ', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.TARİH}
                  onChangeText={(text) => handleFilterChange('TARİH', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.EVRAK_TİPİ}
                  onChangeText={(text) => handleFilterChange('EVRAK_TİPİ', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.HESAP_KODU}
                  onChangeText={(text) => handleFilterChange('HESAP_KODU', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.HESAP_İSMİ}
                  onChangeText={(text) => handleFilterChange('HESAP_İSMİ', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.KARŞI_HESAP_KODU}
                  onChangeText={(text) => handleFilterChange('KARŞI_HESAP_KODU', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.KARŞI_HESAP_İSMİ}
                  onChangeText={(text) => handleFilterChange('KARŞI_HESAP_İSMİ', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.AÇIKLAMA}
                  onChangeText={(text) => handleFilterChange('AÇIKLAMA', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.ANA_DÖVİZ_TUTAR}
                  onChangeText={(text) => handleFilterChange('ANA_DÖVİZ_TUTAR', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.ORJ_DOVİZ_KUR}
                  onChangeText={(text) => handleFilterChange('ORJ_DOVİZ_KUR', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.C_ORJ_DOVİZ_}
                  onChangeText={(text) => handleFilterChange('C_ORJ_DOVİZ_', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Orjinal_Döviz_TUTAR}
                  onChangeText={(text) => handleFilterChange('Orjinal_Döviz_TUTAR', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
           
          </Row>
      
          {/* Data Rows */}
          {filterData(data).map((item, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedRowIndex(index)}>
            <Row style={[styles.tableRow, selectedRowIndex === index && styles.selectedRow]}>
              <Col style={[styles.tableCell, { width: 120 }]}>
                <Text style={styles.cellText}>{item.B_A}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.KARŞI_HESAP_CİNSİ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.CİNSİ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.TARİH}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.EVRAK_TİPİ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.HESAP_KODU}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.HESAP_İSMİ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.KARŞI_HESAP_KODU}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.KARŞI_HESAP_İSMİ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.AÇIKLAMA}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.ANA_DÖVİZ_TUTAR)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.ORJ_DOVİZ_KUR}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.C_ORJ_DOVİZ_}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Orjinal_Döviz_TUTAR)}</Text>
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

export default KasaAlacak;
