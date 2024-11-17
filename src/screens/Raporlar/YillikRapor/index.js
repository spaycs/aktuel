import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, FlatList } from 'react-native';
import axiosLinkMain from '../../../utils/axiosMain'; 
import { colors } from '../../../res/colors'; 
import { Picker } from '@react-native-picker/picker';
import { DataTable } from 'react-native-paper';
import { Filtre } from '../../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { useAuthDefault } from '../../../components/DefaultUser';

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

  const [filters, setFilters] = useState({
    Cari: '',
    Ocak: '',
    Subat: '',
    Mart: '',
    Nisan: '',
    Mayıs: '',
    Haziran: '',
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

  
  
  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
  };

  const filterData = (data) => {
    return data.filter(item => {
      // Her sütun için filtrelemeyi sadece string veri üzerinde yapıyoruz
      const itemToplam = item.Toplam ? item.Toplam.toString() : '';
  
      return (
        (!filters.Cari || (item.Cari && item.Cari.toLowerCase().includes(filters.Cari.toLowerCase()))) &&
        (!filters.Ocak || (item.Ocak && item.Ocak.toString().includes(filters.Ocak))) &&
        (!filters.Subat || (item.Subat && item.Subat.toString().includes(filters.Subat))) &&
        (!filters.Mart || (item.Mart && item.Mart.toString().includes(filters.Mart))) &&
        (!filters.Nisan || (item.Nisan && item.Nisan.toString().includes(filters.Nisan))) &&
        (!filters.Mayıs || (item.Mayıs && item.Mayıs.toString().includes(filters.Mayıs))) &&
        (!filters.Haziran || (item.Haziran && item.Haziran.toString().includes(filters.Haziran))) &&
        (!filters.Temmuz || (item.Temmuz && item.Temmuz.toString().includes(filters.Temmuz))) &&
        (!filters.Ağustos || (item.Ağustos && item.Ağustos.toString().includes(filters.Ağustos))) &&
        (!filters.Eylül || (item.Eylül && item.Eylül.toString().includes(filters.Eylül))) &&
        (!filters.Ekim || (item.Ekim && item.Ekim.toString().includes(filters.Ekim))) &&
        (!filters.Kasım || (item.Kasım && item.Kasım.toString().includes(filters.Kasım))) &&
        (!filters.Aralık || (item.Aralık && item.Aralık.toString().includes(filters.Aralık))) &&
        (!filters.Toplam || itemToplam.includes(filters.Toplam))
      );
    });
  };
  

  const calculateTotals = (data) => {
    const totals = {
      Ocak: 0,
      Subat: 0,
      Mart: 0,
      Nisan: 0,
      Mayıs: 0,
      Haziran: 0,
      Temmuz: 0,
      Ağustos: 0,
      Eylül: 0,
      Ekim: 0,
      Kasım: 0,
      Aralık: 0,
      Toplam: 0,
    };

    data.forEach(item => {
      totals.Ocak += parseFloat(item.Ocak) || 0;
      totals.Subat += parseFloat(item.Subat) || 0;
      totals.Mart += parseFloat(item.Mart) || 0;
      totals.Nisan += parseFloat(item.Nisan) || 0;
      totals.Mayıs += parseFloat(item.Mayıs) || 0;
      totals.Haziran += parseFloat(item.Haziran) || 0;
      totals.Temmuz += parseFloat(item.Temmuz) || 0;
      totals.Ağustos += parseFloat(item.Ağustos) || 0;
      totals.Eylül += parseFloat(item.Eylül) || 0;
      totals.Ekim += parseFloat(item.Ekim) || 0;
      totals.Kasım += parseFloat(item.Kasım) || 0;
      totals.Aralık += parseFloat(item.Aralık) || 0;
      totals.Toplam += parseFloat(item.Toplam) || 0;
    });

    return totals;
  };

  const totalRow = data ? calculateTotals(data) : null;
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
      <View style={styles.datePickerContainer}>
        <Text style={styles.dateTitle}>Yıl Seçimi</Text>
        <View style={styles.inputStyle}>
        <Picker
        itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          {yearList.map((yr) => (
            <Picker.Item style={styles.textStyle} key={yr} label={yr.toString()} value={yr} />
          ))}
        </Picker>
        </View>
      </View>

      {IQ_Admin === 1 && (
      <View style={styles.pickerContainer}>
      <View style={styles.datePickerContainer}>
        <Text style={styles.pickerLabel}>Personel Seçimi</Text>
        <View style={styles.inputStyle}>
        <Picker
          selectedValue={selectedPersonel}
          itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
          onValueChange={(itemValue) => setSelectedPersonel(itemValue)}
        >
          <Picker.Item style={styles.textStyle} label="Personel seçin" value="" />
          {personelList.map((personel) => (
            <Picker.Item style={styles.textStyle} key={personel.No} label={personel.Adi} value={personel.Adi} />
          ))}
        </Picker>
        </View>
      </View>
      </View>
        )}
    </View>
      <TouchableOpacity onPress={fetchData} style={styles.buttonSearch}>
        <Text style={styles.buttonText}>Listele</Text>
      </TouchableOpacity>
      

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
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
 
  buttonSearch: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
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

export default YillikRapor;
