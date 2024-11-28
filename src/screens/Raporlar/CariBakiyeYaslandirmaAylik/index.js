import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ScrollView, FlatList, ActivityIndicator, Modal, Button } from 'react-native';
import axiosLinkMain from '../../../utils/axiosMain';
import { colors } from '../../../res/colors'; 
import { Ara } from '../../../res/images';
import CariListModal from '../../../context/CariListModal';
import { Filtre } from '../../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import FastImage from 'react-native-fast-image';
import { MainStyles } from '../../../res/style';
import { useAuthDefault } from '../../../components/DefaultUser';

const CariBakiyeYaslandirmaAylik = () => {
  const { defaults } = useAuthDefault();
  const [selectedPersonel, setSelectedPersonel] = useState('');
  const [sth_cari_kodu, setStHCariKodu] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [personelList, setPersonelList] = useState([]); 
  const IQ_MikroPersKod = defaults[0]?.IQ_MikroPersKod || '';
  const IQ_Admin = defaults[0]?.IQ_Admin || '';

  const [searchClicked, setSearchClicked] = useState(false); 
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPersonelList();
    fetchData();
  }, [selectedPersonel]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredData(data); // Boşsa tüm veriyi göster
    } else {
      const normalizedTerm = term.toLowerCase();
      const filtered = data.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(normalizedTerm)
        )
      );
      setFilteredData(filtered);
    }
  };

 // Personel listesini çekme
 const fetchPersonelList = async () => {
  try {
    const response = await axiosLinkMain.get('/Api/Kullanici/Personeller');
    setPersonelList(response.data);
  } catch (error) {
    setError('Personel listesi çekme hatası: ' + error.message);
  }
};

useEffect(() => {
  // Sayfa açılır açılmaz verileri çek
  if (IQ_Admin) {
    fetchData();
  }

  // Personel listesini sayfa açıldığında çek
  if (IQ_Admin === 1) {
    fetchPersonelList();
  }
}, [IQ_Admin, selectedPersonel]);

// API'den veri çekme fonksiyonu
const fetchData = async () => {
  if (!IQ_MikroPersKod) {
    setError('IQ_MikroPersKod değeri bulunamadı.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    let apiUrl = '';

    if (IQ_Admin === 1) {
      // SRV ise Picker'dan seçilen personelin "Adi" değerini API'ye gönder
      const selectedPerson = personelList.find(personel => personel.No === selectedPersonel);
      if (!selectedPerson) {
        setError('Lütfen bir personel seçin.');
        setLoading(false);
        return;
      }
      const personName = selectedPerson.No; // "Adi" değerini alın
      apiUrl = `/Api/Raporlar/CariBakiyeYasladirmaAylik?carikodyapisi=${personName}`;
    } else {
      // SRV değilse IQ_MikroPersKod'u direkt gönder
      apiUrl = `/Api/Raporlar/CariBakiyeYasladirmaAylik?carikodyapisi=${IQ_MikroPersKod}`;
    }

    console.log('API URL:', apiUrl);

    const response = await axiosLinkMain.get(apiUrl);
    setData(response.data);
    setFilteredData(response.data);
  } catch (error) {
    setError('Veri çekme hatası: ' + error.message);
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  fetchPersonelList();
  fetchData();
}, []);

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
          {typeof value === 'number'
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
    <View style={styles.container}>
    {IQ_Admin === 1 && (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Personel Seçimi</Text>
        <View style={MainStyles.inputStyle}>
        {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedPersonel
                ? personelList.find(personel => personel.No === selectedPersonel)?.Adi || 'Personel Seçin'
                : 'Personel Seçin'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal */}
          <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={MainStyles.modalContainerPicker}>
            <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedPersonel}
                  onValueChange={(itemValue) => {
                    setSelectedPersonel(itemValue);
                    setIsModalVisible(false); // Modal'ı kapat
                  }}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Personel Seçin" value="" style={MainStyles.textStyle}/>
                  {personelList.map((personel) => (
                    <Picker.Item key={personel.No} label={personel.Adi} value={personel.No}  style={MainStyles.textStyle}/>
                  ))}
                </Picker>
                <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için doğrudan Picker
        <Picker
          itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
          selectedValue={selectedPersonel}
          onValueChange={(itemValue) => setSelectedPersonel(itemValue)}
        >
          <Picker.Item label="Personel Seçin"  value="" style={MainStyles.textStyle}/>
          {personelList.map((personel) => (
            <Picker.Item key={personel.No} label={personel.Adi} value={personel.No} style={MainStyles.textStyle}/>
          ))}
        </Picker>
      )}
    </View>

      </View>
    )}

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
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    marginTop: 2,
    backgroundColor: colors.white,
  },
  pickerContainer: {
    padding: 1,
    marginTop: 5,
  },
  pickerLabel: {
   fontSize: 12,
   marginBottom: 5,
  },
  filterRow: {
    marginRight: 5,
    marginTop: 10,
  },
  filterInput: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.islembuttongray,
    borderRadius: 5,
    padding: 8,
    fontSize: 12,
  },
  loading: {
    marginTop: 20,
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
    marginTop: 10,
    fontSize: 12,
  },
  
});

export default CariBakiyeYaslandirmaAylik;
