import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';
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
      
      apiUrl = `/Api/Raporlar/YillikRapor?yil=${year}&personel=01}`;
      console.log(apiUrl);
    } else {
      // SRV değilse IQ_MikroPersKod'u direkt gönder
      apiUrl = `/Api/Raporlar/YillikRapor?yil=${year}&personel=${IQ_MikroPersKod}`;
      console.log(apiUrl);
    }

    const response = await axiosLinkMain.get(apiUrl);
    setData(response.data);
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

  const scrollView1Ref = useRef(null);
  const scrollView2Ref = useRef(null);
  const [scrollViewActiveRef, setScrollViewActiveRef] = useState(null);

  const handleScrollRef1 = (ref, event) => {
    if (scrollViewActiveRef == null || scrollViewActiveRef == "scrollView1"){
      setScrollViewActiveRef("scrollView1");
    }
    if(scrollViewActiveRef == "scrollView1")
    {
      const scrollX = event.nativeEvent.contentOffset.x;
      if (ref.current) {
        ref.current.scrollTo({ x: scrollX, animated: false });
      }
    }
  };

  const handleScrollRef2 = (ref, event) => {
    if (scrollViewActiveRef == null || scrollViewActiveRef == "scrollView2"){
      setScrollViewActiveRef("scrollView2");
    }
    if(scrollViewActiveRef == "scrollView2")
    {
      const scrollX = event.nativeEvent.contentOffset.x;
      if (ref.current) {
        ref.current.scrollTo({ x: scrollX, animated: false });
      }
    }
  };

  const handleScrollEnd = () => {
    setScrollViewActiveRef(null); // Scroll işlemi bittiğinde sıfırla
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
        <>
        <ScrollView style={styles.tableHeader} horizontal={true} ref={scrollView1Ref} 
        onScroll={(event) => handleScrollRef1(scrollView2Ref, event)}
        scrollEventThrottle={1}
        //onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}>
          <Grid>
          <Row style={styles.tableHeader}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <Text style={styles.colTitle}>Cari</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ocak</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Şubat</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Mart</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Nisan</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Mayıs</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Haziran</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Temmuz</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ağustos</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Eylül</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ekim</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Kasım</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Aralık</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Toplam</Text>
            </Col>
          </Row>
          </Grid>
        </ScrollView>
        <ScrollView style={styles.scrollView}>
        <ScrollView horizontal={true} style={styles.horizontalScroll} ref={scrollView2Ref} 
        onScroll={(event) => handleScrollRef2(scrollView1Ref, event)}
        scrollEventThrottle={1}
        //onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}>
        <Grid>
          {/* Header Row */}
          <Row style={styles.tableHeader}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <Text style={styles.colTitle}>Cari</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ocak</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Şubat</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Mart</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Nisan</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Mayıs</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Haziran</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Temmuz</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ağustos</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Eylül</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Ekim</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Kasım</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Aralık</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Toplam</Text>
            </Col>
          </Row>
      
          {/* Filter Row */}
          <Row style={styles.tableHeaderFiltre}>
            <Col style={[styles.tableCell, { width: 120}]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Cari}
                  onChangeText={(text) => handleFilterChange('Cari', text)}
                  style={styles.textInputStyle}
                />
                <Filtre width={10} height={10} style={styles.iconStyle} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Ocak}
                  onChangeText={(text) => handleFilterChange('Ocak', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Subat}
                  onChangeText={(text) => handleFilterChange('Şubat', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Mart}
                  onChangeText={(text) => handleFilterChange('Mart', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Nisan}
                  onChangeText={(text) => handleFilterChange('Nisan', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Mayıs}
                  onChangeText={(text) => handleFilterChange('Mayıs', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Haziran}
                  onChangeText={(text) => handleFilterChange('Haziran', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Temmuz}
                  onChangeText={(text) => handleFilterChange('Temmuz', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Ağustos}
                  onChangeText={(text) => handleFilterChange('Ağustos', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Eylül}
                  onChangeText={(text) => handleFilterChange('Eylül', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Ekim}
                  onChangeText={(text) => handleFilterChange('Ekim', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Kasım}
                  onChangeText={(text) => handleFilterChange('Kasım', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Aralık}
                  onChangeText={(text) => handleFilterChange('Aralık', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Toplam}
                  onChangeText={(text) => handleFilterChange('Toplam', text)}
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
                <Text style={styles.cellText}>{item.Cari}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Ocak)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Subat)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Mart)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Nisan)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Mayıs)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Haziran)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Temmuz)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Ağustos)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Eylül)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Ekim)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Kasım)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Aralık)}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(item.Toplam)}</Text>
              </Col>
            </Row>
            </TouchableOpacity>
          ))}
      
          {/* Total Row */}
          {totalRow && (
            <Row style={styles.tableRow}>
              <Col style={[styles.tableToplamCell, { width: 120 }]}>
                <Text style={styles.cellText}>Toplam</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Ocak)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Subat)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Mart)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Nisan)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Mayıs)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Haziran)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Temmuz)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Ağustos)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Eylül)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Ekim)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Kasım)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Aralık)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
                <Text style={styles.cellText}>{formatPrice(totalRow.Toplam)}</Text>
              </Col>
              
            </Row>
          )}
        </Grid>
      </ScrollView>
      </ScrollView>
      </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  containerTitle: {
    borderRadius: 10,
  },
  datePickerContainer: {
  },
  dateTitle: {
    fontSize: 13,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
  },
  selectedRow: {
    // Seçilen satırın arka plan rengi
    backgroundColor: '#e0f7fa',
  },
  
  pickerLabel: {
    fontSize: 13,
    marginBottom: 5,
  },
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
  }

});

export default YillikRapor;
