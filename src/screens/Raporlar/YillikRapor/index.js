import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, FlatList, Modal, Button } from 'react-native';
import axiosLinkMain from '../../../utils/axiosMain'; 
import { colors } from '../../../res/colors'; 
import { Picker } from '@react-native-picker/picker';
import { DataTable } from 'react-native-paper';
import { Filtre } from '../../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { useAuthDefault } from '../../../components/DefaultUser';
import { MainStyles } from '../../../res/style';
import FastImage from 'react-native-fast-image';

const YillikRapor = () => {
  const { defaults } = useAuthDefault();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [personelList, setPersonelList] = useState([]); 
  const [selectedPersonel, setSelectedPersonel] = useState(''); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchClicked, setSearchClicked] = useState(false); 
  const [isPersonelPickerVisible, setIsPersonelPickerVisible] = useState(false); 
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false); 
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const IQ_MikroPersKod = defaults[0]?.IQ_MikroPersKod || '';
  const IQ_Admin = defaults[0]?.IQ_Admin || '';
  const [filteredData, setFilteredData] = useState([]);


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

  const yearList = Array.from(new Array(20), (v, i) => currentYear - i);

  const fetchPersonelList = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Kullanici/Personeller');
      setPersonelList(response.data);
      console.log(response.data);
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

  const fetchData2 = async () => {
    setLoading(true);
    setError('');
    setSearchClicked(true);
    try {
      const response = await axiosLinkMain.get(`/Api/Raporlar/YillikRapor?yil=${year}&personel=${encodeURIComponent(selectedPersonel)}`);
      setData(response.data);
      console.log(response);
    } catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // API'den veri çekme fonksiyonu
const fetchData = async () => {
  if (!IQ_MikroPersKod) {
    setError('IQ_MikroPersKod değeri bulunamadı.');
    return;
  }

  setLoading(true);
  setError('');
  setSearchClicked(true);
  try {
    let apiUrl = '';

    if (IQ_Admin === 1) {
      // SRV ise Picker'dan seçilen personeli API'ye gönder
      if (!selectedPersonel) {
        setError('Lütfen bir personel seçin.');
        setLoading(false);
        return;
      }
      const selectedPersonelObj = personelList.find(personel => personel.Adi === selectedPersonel);
      if (!selectedPersonelObj) {
        setError('Seçilen personel bulunamadı.');
        setLoading(false);
        return;
      }
      apiUrl = `/Api/Raporlar/YillikRapor?yil=${year}&personel=${encodeURIComponent(selectedPersonelObj.No)}`;
      console.log(apiUrl);
    } else {
      // SRV değilse IQ_MikroPersKod'u direkt gönder
      apiUrl = `/Api/Raporlar/YillikRapor?yil=${year}&personel=${IQ_MikroPersKod}`;
      console.log(apiUrl);
    }

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
      <View style={styles.containerTitle}>
      {/* Yıl Seçimi */}
<View style={styles.datePickerContainer}>
  <Text style={styles.pickerLabel}>Yıl Seçimi</Text>
  <View style={styles.inputStyle}>
    {Platform.OS === 'ios' ? (
      <>
        {/* iOS için Modal Picker */}
        <TouchableOpacity onPress={() => setIsYearPickerVisible(true)}>
          <Text style={[styles.textStyle, { paddingVertical: 10, paddingLeft:5 }]}>
            {year || 'Yıl Seçin'}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={isYearPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsYearPickerVisible(false)}
        >
          <View style={MainStyles.modalContainerPicker}>
            <View style={MainStyles.modalContentPicker}>
              <Picker
                selectedValue={year}
                onValueChange={(itemValue) => {
                  setYear(itemValue);
                  setIsYearPickerVisible(false); // Seçim sonrası modal kapanır
                }}
                style={MainStyles.picker}
              >
                {yearList.map((yr) => (
                  <Picker.Item key={yr} label={yr.toString()} value={yr} style={MainStyles.textStyle} />
                ))}
              </Picker>
              <Button title="Kapat" onPress={() => setIsYearPickerVisible(false)} />
            </View>
          </View>
        </Modal>
      </>
    ) : (
      // Android için düz Picker
      <Picker
        selectedValue={year}
        onValueChange={(itemValue) => setYear(itemValue)}
        itemStyle={{ height: 40, fontSize: 12 }}
        style={{ marginHorizontal: -10 }}
      >
        {yearList.map((yr) => (
          <Picker.Item key={yr} label={yr.toString()} value={yr} style={MainStyles.textStyle} />
        ))}
      </Picker>
    )} 
  </View>
</View>

{/* Personel Seçimi */} 
{IQ_Admin === 1 && (
  <View style={styles.pickerContainer}>
    <View style={styles.datePickerContainer}>
      <Text style={styles.pickerLabel}>Personel Seçimi</Text>
      <View style={styles.inputStyle}>
        {Platform.OS === 'ios' ? (
          <>
            {/* iOS için Modal Picker */}
            <TouchableOpacity onPress={() => setIsPersonelPickerVisible(true)}>
              <Text style={[styles.textStyle, { paddingVertical: 10, paddingLeft:5 }]}>
                {selectedPersonel || 'Personel Seçin'}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={isPersonelPickerVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsPersonelPickerVisible(false)}
            >
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={selectedPersonel}
                    onValueChange={(itemValue) => {
                      setSelectedPersonel(itemValue);
                      setIsPersonelPickerVisible(false); // Seçim sonrası modal kapanır
                    }}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Personel Seçin" value="" style={MainStyles.textStyle} />
                    {personelList.map((personel) => (
                      <Picker.Item key={personel.No} label={personel.Adi} value={personel.Adi} style={MainStyles.textStyle} />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsPersonelPickerVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için düz Picker
          <Picker
            selectedValue={selectedPersonel}
            onValueChange={(itemValue) => setSelectedPersonel(itemValue)}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Personel Seçin" value="" style={MainStyles.textStyle} />
            {personelList.map((personel) => (
              <Picker.Item key={personel.No} label={personel.Adi} value={personel.Adi} style={MainStyles.textStyle} />
            ))}
          </Picker>
        )}
      </View>
    </View>
  </View>
)}

    </View>
      <TouchableOpacity onPress={fetchData} style={styles.buttonSearch}>
        <Text style={styles.buttonText}>Listele</Text>
      </TouchableOpacity>
      

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
    borderColor: colors.textInputBg,
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
  buttonSearch: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default YillikRapor;
