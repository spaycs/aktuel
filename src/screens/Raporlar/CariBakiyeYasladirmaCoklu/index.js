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
  
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


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
      console.log('API Response:', response.data); // Yanıtı kontrol etmek için ekledik
      if (Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        console.warn('API response is not an array:', response.data);
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
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

  {/* Filtreleme Alanı */}
  <View style={styles.filterRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filtrele..."
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


    container: {
      flex: 1,
      padding: 2,
      marginTop: 2,
      backgroundColor: colors.white
    },
    filterRow: {
      padding: 5,
      backgroundColor: '#f9f9f9',
    },
    filterInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 8,
      fontSize: 14,
    },
    loading: {
      marginTop: 20,
    },
    errorText: {
      color: 'red',
      marginVertical: 10,
      textAlign: 'center',
    },
    inputStyle:{
      borderRadius: 10,
      textAlign: 'left',
      backgroundColor: colors.textInputBg,
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
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
    },
    
  });
  

export default CariBakiyeYasladirmaCoklu;
