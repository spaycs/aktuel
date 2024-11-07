import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import axiosLinkMain from '../../../utils/axiosMain'; // axiosLinkMain dosyasının yolunu kontrol edin
import { colors } from '../../../res/colors'; // Renkler için stil dosyasını ayarlayın
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Ara, Filtre } from '../../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import CariListModal from '../../../context/CariListModal';
import FastImage from 'react-native-fast-image';
import { MainStyles } from '../../../res/style';

const CariBakiyeYasladirmaCoklu = () => {
  const [sth_cari_kodu, setStHCariKodu] = useState('');
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [temsilci, setTemsilci] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [personelList, setPersonelList] = useState([]); 
  const [selectedPersonel, setSelectedPersonel] = useState(''); 

  const [searchClicked, setSearchClicked] = useState(false); 
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [filters, setFilters] = useState({
    CARİKODU: '',
    CARİİSMİ: '',
    VADESİGEÇENBAKİYE: '',
    VADESİGEÇMEMİŞBAKİYE: '',
    TOPLAMBAKİYE: '',
    BAKİYETİPİ: '',
    C30_GÜN: '',
    C60_GÜN: '',
    C90_GÜN: '',
    C120_GÜN: '',
    C120_GÜNDEN_FAZLA: '',
    VADE: '',
    Temmuz: '',
    Ağustos: '',
    Eylül: '',
    Ekim: '',
    Kasım: '',
    Aralık: '',
    Toplam: ''
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
        (!filters.CARİKODU || (item.CARİKODU && item.CARİKODU.toLowerCase().includes(filters.CARİKODU.toLowerCase()))) &&
        (!filters.CARİİSMİ || (item.CARİİSMİ && item.CARİİSMİ.toLowerCase().includes(filters.CARİİSMİ.toLowerCase()))) &&
        (!filters.VADESİGEÇENBAKİYE || (item.VADESİGEÇENBAKİYE && item.VADESİGEÇENBAKİYE.toLowerCase().includes(filters.VADESİGEÇENBAKİYE.toLowerCase()))) &&
        (!filters.VADESİGEÇMEMİŞBAKİYE || (item.VADESİGEÇMEMİŞBAKİYE && item.VADESİGEÇMEMİŞBAKİYE.toLowerCase().includes(filters.VADESİGEÇMEMİŞBAKİYE.toLowerCase()))) &&
        (!filters.TOPLAMBAKİYE || (item.TOPLAMBAKİYE && item.TOPLAMBAKİYE.toLowerCase().includes(filters.TOPLAMBAKİYE.toLowerCase()))) &&
        (!filters.BAKİYETİPİ || (item.BAKİYETİPİ && item.BAKİYETİPİ.toLowerCase().includes(filters.BAKİYETİPİ.toLowerCase()))) &&
        (!filters.C30_GÜN || (item.C30_GÜN && item.C30_GÜN.toString().includes(filters.C30_GÜN))) &&
        (!filters.C60_GÜN || (item.C60_GÜN && item.C60_GÜN.toString().includes(filters.C60_GÜN))) &&
        (!filters.C90_GÜN || (item.C90_GÜN && item.C90_GÜN.toString().includes(filters.C90_GÜN))) &&
        (!filters.C120_GÜN || (item.C120_GÜN && item.C120_GÜN.toString().includes(filters.C120_GÜN))) &&
        (!filters.C120_GÜNDEN_FAZLA || (item.C120_GÜNDEN_FAZLA && item.C120_GÜNDEN_FAZLA.toString().includes(filters.C120_GÜNDEN_FAZLA))) &&
        (!filters.VADE || (item.VADE && item.VADE.toString().includes(filters.VADE))) 
      );
    });
  };
  

  const calculateTotals = (data) => {
    const totals = {
      CARİKODU: 0,
      CARİİSMİ: 0,
      VADESİGEÇENBAKİYE: 0,
      VADESİGEÇMEMİŞBAKİYE: 0,
      TOPLAMBAKİYE: 0,
      BAKİYETİPİ: 0,
      C30_GÜN: 0,
      C60_GÜN: 0,
      C90_GÜN: 0,
      C120_GÜN: 0,
      C120_GÜNDEN_FAZLA: 0,
      VADE: 0,
    };

    data.forEach(item => {
      totals.CARİKODU += parseFloat(item.CARİKODU) || 0;
      totals.CARİİSMİ += parseFloat(item.CARİİSMİ) || 0;
      totals.VADESİGEÇENBAKİYE += parseFloat(item.VADESİGEÇENBAKİYE) || 0;
      totals.VADESİGEÇMEMİŞBAKİYE += parseFloat(item.VADESİGEÇMEMİŞBAKİYE) || 0;
      totals.TOPLAMBAKİYE += parseFloat(item.TOPLAMBAKİYE) || 0;
      totals.BAKİYETİPİ += parseFloat(item.BAKİYETİPİ) || 0;
      totals.C30_GÜN += parseFloat(item.C30_GÜN) || 0;
      totals.C60_GÜN += parseFloat(item.C60_GÜN) || 0;
      totals.C90_GÜN += parseFloat(item.C90_GÜN) || 0;
      totals.C120_GÜN += parseFloat(item.C120_GÜN) || 0;
      totals.C120_GÜNDEN_FAZLA += parseFloat(item.C120_GÜNDEN_FAZLA) || 0;
      totals.VADE += parseFloat(item.VADE) || 0;
    });

    return totals;
  };

  const totalRow = data ? calculateTotals(data) : null;

  // Cari seçimi fonksiyonu
  const handleCariSelect = (selectedCari) => {
    if (selectedCari && selectedCari.Cari_Kod) {
      setStHCariKodu(selectedCari.Cari_Kod);
      fetchData(selectedCari.Cari_Kod);
    } else {
      console.error('Selected cari kodu is missing.');
    }
    setIsCariListModalVisible(false);
  };
  
  // Cari kodu seçim modal'ını aç
  const handleCariKoduClick = () => {
    setIsCariListModalVisible(true);
  };

  const fetchData = async (cariKodu) => {
    if (!cariKodu) {
      console.error('Cari Kodu is empty.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosLinkMain.get(`/Api/Raporlar/CariBakiyeYasladirmaCoklu?temsilci=${cariKodu}`);
     //const response = await axios.get(`http://195.214.168.228:8083/Api/Raporlar/CariBakiyeYasladirmaCoklu?temsilci=ZEYNEP%20ARDIL`);
      // Verinin beklenen formatta olup olmadığını kontrol edin
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        console.warn('API response is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputCariKodu}
          placeholder="Cari Kodu"
          value={sth_cari_kodu}
          placeholderTextColor={colors.placeholderTextColor}
          autoFocus={true}
          selection={{start:0, end:0}}
          editable={false}
        />
      <TouchableOpacity onPress={() => setIsCariListModalVisible(true)} style={styles.buttonSearch}>
          <Ara />
        </TouchableOpacity>
      </View>

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
              <Text style={styles.colTitle}>CARİ KODU</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <Text style={styles.colTitle}>CARİ İSMİ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <Text style={styles.colTitle}>VADESİ GEÇEN BAKİYE</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <Text style={styles.colTitle}>VADESİ GEÇMEMİŞ BAKİYE</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <Text style={styles.colTitle}>TOPLAM BAKİYE</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <Text style={styles.colTitle}>BAKİYE TİPİ</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>C30_GÜN</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>C60_GÜN</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>C90_GÜN</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>C120_GÜN</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>C120_GÜNDEN_FAZLA</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>VADE</Text>
            </Col>
          </Row>
      
          {/* Filter Row */}
          <Row style={styles.tableHeaderFiltre}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.CARİKODU}
                  onChangeText={(text) => handleFilterChange('CARİKODU', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.CARİİSMİ}
                  onChangeText={(text) => handleFilterChange('CARİİSMİ', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.VADESİGEÇENBAKİYE}
                  onChangeText={(text) => handleFilterChange('VADESİGEÇENBAKİYE', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.VADESİGEÇMEMİŞBAKİYE}
                  onChangeText={(text) => handleFilterChange('VADESİGEÇMEMİŞBAKİYE', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.TOPLAMBAKİYE}
                  onChangeText={(text) => handleFilterChange('TOPLAMBAKİYE', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.BAKİYETİPİ}
                  onChangeText={(text) => handleFilterChange('BAKİYETİPİ', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.C30_GÜN}
                  onChangeText={(text) => handleFilterChange('C30_GÜN', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.C60_GÜN}
                  onChangeText={(text) => handleFilterChange('C60_GÜN', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.C90_GÜN}
                  onChangeText={(text) => handleFilterChange('C90_GÜN', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.C120_GÜN}
                  onChangeText={(text) => handleFilterChange('C120_GÜN', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.C120_GÜNDEN_FAZLA}
                  onChangeText={(text) => handleFilterChange('C120_GÜNDEN_FAZLA', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.VADE}
                  onChangeText={(text) => handleFilterChange('VADE', text)}
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
                <Text style={styles.cellText}>{item.CARİKODU}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.CARİİSMİ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.VADESİGEÇENBAKİYE)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.VADESİGEÇMEMİŞBAKİYE)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.TOPLAMBAKİYE)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.BAKİYETİPİ}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.C30_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.C60_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.C90_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.C120_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.C120_GÜNDEN_FAZLA)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.VADE)}</Text>
              </Col>
            </Row>
            </TouchableOpacity>
          ))}
      
          {/* Total Row */}
          <View style={{ flex: 1, position: 'relative' }}>
          {totalRow && (
            <Row style={styles.tableRow}>
              <Col style={[styles.tableToplamCell, { width: 120 }]}>
                <Text style={styles.cellText}></Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}></Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.VADESİGEÇENBAKİYE)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.VADESİGEÇMEMİŞBAKİYE)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.TOPLAMBAKİYE)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}></Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.C30_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.C60_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.C90_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.C120_GÜN)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.C120_GÜNDEN_FAZLA)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.VADE)}</Text>
              </Col>
              
            </Row>
          )}
          </View>
        </Grid>
      </ScrollView>
      </ScrollView>
      
      ) : null}

      <CariListModal
        isVisible={isCariListModalVisible}
        onSelectCari={handleCariSelect}
        onClose={() => setIsCariListModalVisible(false)}
      />
    </ScrollView>
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
    marginBottom: 20,
  },
  inputCariKodu: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.textInputBg,
    borderRadius: 5,
    padding: 10,
    fontSize: 13,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonCariKodu: {
    marginLeft: 10,
    padding: 17,
    borderRadius: 10,
    backgroundColor: colors.red,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContainer: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subHeaderText: {
    fontSize: 14,
    color: colors.secondary,
  },
  balanceContainer: {
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.primary,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  monthlyContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  monthLabel: {
    fontSize: 14,
    color: colors.primary,
  },
  monthValue: {
    fontSize: 14,
    color: colors.secondary,
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderColor: colors.border,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    width: '50%',
  },
  valueText: {
    fontSize: 14,
    color: colors.secondary,
    width: '50%',
    textAlign: 'right',
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
    fontSize: 9,
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
    fontSize: 10,
    justifyContent: 'center',
  },
  totalRowContainer: {
    position: 'absolute', // Sabitlemek için
    bottom: 0,           // Sayfanın altına sabitler
    left: 0,             // Sol kenara hizalar
    right: 0,            // Sağ kenara kadar genişletir
    backgroundColor: '#fff', // İsteğe bağlı arka plan rengi
    padding: 10,         // İsteğe bağlı padding
  },
  buttonSearch: {
    marginLeft: 10,
    padding: 17,
    borderRadius: 10,
    backgroundColor: colors.red,
  },
  selectedRow: {
    // Seçilen satırın arka plan rengi
    backgroundColor: '#e0f7fa',
  },
  
});

export default CariBakiyeYasladirmaCoklu;
