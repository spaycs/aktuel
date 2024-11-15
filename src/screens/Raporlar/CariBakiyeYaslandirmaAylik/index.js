import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ScrollView, FlatList, ActivityIndicator } from 'react-native';
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
  const [isCariListModalVisible, setIsCariListModalVisible] = useState(false);
  const [personelList, setPersonelList] = useState([]); 
  const IQ_MikroPersKod = defaults[0]?.IQ_MikroPersKod || '';
  const IQ_Admin = defaults[0]?.IQ_Admin || '';

  const [searchClicked, setSearchClicked] = useState(false); 
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [filters, setFilters] = useState({
    CARİKODU: '',
    CARİİSMİ: '',
    VADESİGEÇENBAKİYE: '',
    VADESİGEÇMEMİŞBAKİYE: '',
    TOPLAMBAKİYE: '',
    BAKİYETİPİ: '',
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
      CARİKODU: 0,
      CARİİSMİ: 0,
      VADESİGEÇENBAKİYE: 0,
      VADESİGEÇMEMİŞBAKİYE: 0,
      TOPLAMBAKİYE: 0,
      BAKİYETİPİ: 0,
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
    };

    data.forEach(item => {
      totals.CARİKODU += parseFloat(item.CARİKODU) || 0;
      totals.CARİİSMİ += parseFloat(item.CARİİSMİ) || 0;
      totals.VADESİGEÇENBAKİYE += parseFloat(item.VADESİGEÇENBAKİYE) || 0;
      totals.VADESİGEÇMEMİŞBAKİYE += parseFloat(item.VADESİGEÇMEMİŞBAKİYE) || 0;
      totals.TOPLAMBAKİYE += parseFloat(item.TOPLAMBAKİYE) || 0;
      totals.BAKİYETİPİ += parseFloat(item.BAKİYETİPİ) || 0;
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
    });

    return totals;
  };

  const totalRow = data ? calculateTotals(data) : null;
  useEffect(() => {
    fetchPersonelList();
  }, []);

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
      // SRV ise Picker'dan seçilen personeli API'ye gönder
      if (!selectedPersonel) {
        setError('Lütfen bir personel seçin.');
        setLoading(false);
        return;
      }
      apiUrl = `/Api/Raporlar/CariBakiyeYasladirmaAylik?carikodyapisi=${selectedPersonel}`;
    } else {
      // SRV değilse IQ_MikroPersKod'u direkt gönder
      apiUrl = `/Api/Raporlar/CariBakiyeYasladirmaAylik?carikodyapisi=${IQ_MikroPersKod}`;
    }

    const response = await axiosLinkMain.get(apiUrl);
    setData(response.data);
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

  return (
    <View style={styles.container}>
    {IQ_Admin === 1 && (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Personel Seçimi</Text>
        <View style={styles.inputStyle}>
          <Picker
            selectedValue={selectedPersonel}
            itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
            onValueChange={(itemValue) => setSelectedPersonel(itemValue)}
          >
            <Picker.Item label="Personel seçin" value="" />
            {personelList.map((personel) => (
              <Picker.Item key={personel.No} label={personel.Adi} value={personel.No} />
            ))}
          </Picker>
        </View>
      </View>
    )}

  

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
                  onChangeText={(text) => handleFilterChange('Subat', text)}
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
            </Row>
            </TouchableOpacity>
          ))}
      
          {/* Total Row */}
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
                <Text style={styles.cellText}>{formatPrice(totalRow.Ocak)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Subat)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Mart)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Nisan)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Mayıs)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Haziran)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Temmuz)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Ağustos)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Eylül)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Ekim)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Kasım)}</Text>
              </Col>
              <Col style={[styles.tableToplamCell, { width: 100 }]}>
              <Text style={styles.cellText}>Toplam:</Text>
                <Text style={styles.cellText}>{formatPrice(totalRow.Aralık)}</Text>
              </Col>
              
            </Row>
          )}
        </Grid>
      </ScrollView>
      </ScrollView>
      
      ) : null}
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
    marginBottom: 20,
  },
  inputCariKodu: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
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

export default CariBakiyeYaslandirmaAylik;
