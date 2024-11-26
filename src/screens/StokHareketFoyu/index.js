import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, View, Alert, FlatList, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
import { MainStyles } from '../../res/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../components/userDetail/Id';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuthDefault } from '../../components/DefaultUser';
import { Filtre, Takvim } from '../../res/images';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../res/colors';
import FastImage from 'react-native-fast-image';

const turkishCharacterMap = {
  'Ç': 'c', 'ç': 'c',
  'Ğ': 'g', 'ğ': 'g',
  'I': 'i', 'İ': 'i',
  'Ö': 'o', 'ö': 'o',
  'Ş': 's', 'ş': 's',
  'Ü': 'u', 'ü': 'u'
};

const normalizeText = (text) => {
  return text
    .normalize('NFD')  // Normalleştirme, diakritikleri ayırır
    .replace(/[\u0300-\u036f]/g, '')  // Diakritik işaretlerini kaldır
    .replace(/[ÇçĞğIİÖöŞşÜü]/g, (char) => turkishCharacterMap[char] || char)  // Türkçe karakterleri dönüştür
    .toLowerCase();  // Küçük harfe çevir
};

const StokHareketFoyu = ({ navigation, route  }) => {
  const { Stok_Kod } = route.params;
  const { authData } = useAuth();
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
  const [date, setDate] = useState(new Date());
  const [evrakDate, setEvrakDate] = useState(new Date());
  const [showIlkTarihPicker, setShowIlkTarihPicker] = useState(false);
  const [showSonTarihPicker, setShowSonTarihPicker] = useState(false);
 
  const [filters, setFilters] = useState({
    Tarih: '',
    Seri: '',
    Sıra: '',
    Evrak_Tipi: '',
    Hareket_Cinsi: '',
    Hareket_Tipi: '',
    Belge_No: '',
    Depo: '',
    Karşı_Depo: '',
    Giren_Miktar: '',
    Çıkan_Miktar: '',
    Miktar: '',
    Birim_Adı: '',
    Brüt_Birim_Fiyatı: '',
    Net_Birim_Fiyatı: '',
    Brüt_Tutar: '',
    Net_Tutar: '',
    Açıklama: '',
    Fatura_Seri: '',
    Fatura_Sıra: '',
    Sorumluluk_Merkezi: '',
    Cari_Kodu: '',
    Cari_İsmi: '',
    Plasiyer: '',
    Giren_Maliyet_Değer: '',
    Çıkan_Maliyet_Değer: '',
    Kar_veya_Maliyet_Farkı: '',
  });

  const yearList = Array.from(new Array(20), (v, i) => currentYear - i);

  const fetchPersonelList = async () => {
    try {
      const response = await axiosLinkMain.get('/Api/Kullanici/Personeller');
      setPersonelList(response.data);
    } catch (error) {
      setError('Personel listesi çekme hatası: ' + error.message);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
  };

  const filterData = (data) => {
    return data.filter(item => {
      return (
        (!filters.Tarih || (item.Tarih && normalizeText(item.Tarih).includes(normalizeText(filters.Tarih)))) &&
        (!filters.Seri || (item.Seri && normalizeText(item.Seri).includes(normalizeText(filters.Seri)))) &&
        (!filters.Sıra || (item.Sıra && normalizeText(item.Sıra).includes(normalizeText(filters.Sıra)))) &&
        (!filters.Evrak_Tipi || (item.Evrak_Tipi && normalizeText(item.Evrak_Tipi).includes(normalizeText(filters.Evrak_Tipi)))) &&
        (!filters.Hareket_Cinsi || (item.Hareket_Cinsi && normalizeText(item.Hareket_Cinsi).includes(normalizeText(filters.Hareket_Cinsi)))) &&
        (!filters.Hareket_Tipi || (item.Hareket_Tipi && normalizeText(item.Hareket_Tipi).includes(normalizeText(filters.Hareket_Tipi)))) &&
        (!filters.Belge_No || (item.Belge_No && normalizeText(item.Belge_No).includes(normalizeText(filters.Belge_No)))) &&
        (!filters.Depo || (item.Depo && normalizeText(item.Depo).includes(normalizeText(filters.Depo)))) &&
        (!filters.Karşı_Depo || (item.Karşı_Depo && normalizeText(item.Karşı_Depo).includes(normalizeText(filters.Karşı_Depo)))) &&
        (!filters.Giren_Miktar || (item.Giren_Miktar && normalizeText(item.Giren_Miktar).includes(normalizeText(filters.Giren_Miktar)))) &&
        (!filters.Çıkan_Miktar || (item.Çıkan_Miktar && normalizeText(item.Çıkan_Miktar).includes(normalizeText(filters.Çıkan_Miktar)))) &&
        (!filters.Miktar || (item.Miktar && normalizeText(item.Miktar).includes(normalizeText(filters.Miktar)))) &&
        (!filters.Birim_Adı || (item.Birim_Adı && normalizeText(item.Birim_Adı).includes(normalizeText(filters.Birim_Adı)))) &&
        (!filters.Brüt_Birim_Fiyatı || (item.Brüt_Birim_Fiyatı && normalizeText(item.Brüt_Birim_Fiyatı).includes(normalizeText(filters.Brüt_Birim_Fiyatı)))) &&
        (!filters.Net_Birim_Fiyatı || (item.Net_Birim_Fiyatı && normalizeText(item.Net_Birim_Fiyatı).includes(normalizeText(filters.Net_Birim_Fiyatı)))) &&
        (!filters.Brüt_Tutar || (item.Brüt_Tutar && normalizeText(item.Brüt_Tutar).includes(normalizeText(filters.Brüt_Tutar)))) &&
        (!filters.Net_Tutar || (item.Net_Tutar && normalizeText(item.Net_Tutar).includes(normalizeText(filters.Net_Tutar)))) &&
        (!filters.Açıklama || (item.Açıklama && normalizeText(item.Açıklama).includes(normalizeText(filters.Açıklama)))) &&
        (!filters.Fatura_Seri || (item.Fatura_Seri && normalizeText(item.Fatura_Seri).includes(normalizeText(filters.Fatura_Seri)))) &&
        (!filters.Fatura_Sıra || (item.Fatura_Sıra && normalizeText(item.Fatura_Sıra).includes(normalizeText(filters.Fatura_Sıra)))) &&
        (!filters.Sorumluluk_Merkezi || (item.Sorumluluk_Merkezi && normalizeText(item.Sorumluluk_Merkezi).includes(normalizeText(filters.Sorumluluk_Merkezi)))) &&
        (!filters.Cari_Kodu || (item.Cari_Kodu && normalizeText(item.Cari_Kodu).includes(normalizeText(filters.Cari_Kodu)))) &&
        (!filters.Cari_İsmi || (item.Cari_İsmi && normalizeText(item.Cari_İsmi).includes(normalizeText(filters.Cari_İsmi)))) &&
        (!filters.Plasiyer || (item.Plasiyer && normalizeText(item.Plasiyer).includes(normalizeText(filters.Plasiyer)))) &&
        (!filters.Giren_Maliyet_Değer || (item.Giren_Maliyet_Değer && normalizeText(item.Giren_Maliyet_Değer).includes(normalizeText(filters.Giren_Maliyet_Değer)))) &&
        (!filters.Çıkan_Maliyet_Değer || (item.Çıkan_Maliyet_Değer && normalizeText(item.Çıkan_Maliyet_Değer).includes(normalizeText(filters.Çıkan_Maliyet_Değer)))) &&
        (!filters.Kar_veya_Maliyet_Farkı || (item.Kar_veya_Maliyet_Farkı && normalizeText(item.Kar_veya_Maliyet_Farkı).includes(normalizeText(filters.Kar_veya_Maliyet_Farkı))))
      );
    });
  };

  const [ilkTarih, setIlkTarih] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // Ayın ilk günü
  });
  const [sonTarih, setSonTarih] = useState(new Date());
  
  // Tarih formatlama fonksiyonu
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  // İlk Tarih Değişikliği
  const handleIlkTarihChange = (event, selectedDate) => {
    const currentDate = selectedDate || ilkTarih;
    setShowIlkTarihPicker(false);
    setIlkTarih(currentDate);
  };
  
  // Son Tarih Değişikliği
  const handleSonTarihChange = (event, selectedDate) => {
    const currentDate = selectedDate || sonTarih;
    setShowSonTarihPicker(false);
    setSonTarih(currentDate);
  };
  

  // Veri çekme fonksiyonu
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const formattedIlkTarih = ilkTarih.toISOString().split('T')[0];
      const formattedSonTarih = sonTarih.toISOString().split('T')[0];

      const response = await axiosLinkMain.get(`/Api/Raporlar/StokFoyu?stokkod=${Stok_Kod}&ilktarih=${formattedIlkTarih}&sontarih=${formattedSonTarih}`);
      setData(response.data);
    } catch (error) {
      setError('Veri çekme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Stok_Kod]);

  return (
    <View style={styles.container}>
       <View style={styles.inputContainer}>
        {/* İlk Tarih Seçimi */}
        <View style={[styles.datePickerContainer, { flex: 1 }]}>
        <Text style={styles.dateTitle}>İlk Tarih: </Text>
          <TouchableOpacity onPress={() => setShowIlkTarihPicker(true)}>
              <View style={styles.dateContainer}>
              <Takvim name="calendar-today" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(ilkTarih)}</Text>
            </View>
          </TouchableOpacity>
          {showIlkTarihPicker && (
            <DateTimePicker
              value={ilkTarih}
              mode="date"
              display="default"
              onChange={handleIlkTarihChange}
            />
          )}
        </View>

        {/* Son Tarih Seçimi */}
        <View style={[styles.datePickerContainer, { flex: 1 }]}>
        <Text style={styles.dateTitle}>Son Tarih Seç: </Text>
          <TouchableOpacity onPress={() => setShowSonTarihPicker(true)}>
              <View style={styles.dateContainer}>
              <Takvim name="calendar-today" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(sonTarih)}</Text>
            </View>
          </TouchableOpacity>
          {showSonTarihPicker  && (
            <DateTimePicker
              value={sonTarih}
              mode="date"
              display="default"
              onChange={handleSonTarihChange}
            />
          )}
        </View>

      {/* Listele Butonu */}
        <TouchableOpacity onPress={fetchData} style={styles.button}>
          <Text style={styles.buttonText}>Listele</Text>
        </TouchableOpacity>
    </View>
      

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
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Tarih</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Seri</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Sıra</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Evrak_Tipi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Hareket_Cinsi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Hareket_Tipi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Belge_No</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Depo</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Karşı_Depo</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Giren_Miktar</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Çıkan_Miktar</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Miktar</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Birim_Adı</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Brüt_Birim_Fiyatı</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Net_Birim_Fiyatı</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Brüt_Tutar</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Net_Tutar</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Açıklama</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Fatura_Seri</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Fatura_Sıra</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Sorumluluk_Merkezi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Cari_Kodu</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Cari_İsmi</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Plasiyer</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Giren_Maliyet_Değer</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Çıkan_Maliyet_Değer</Text>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <Text style={styles.colTitle}>Kar_veya_Maliyet_Farkı</Text>
            </Col>
          </Row>
      
          {/* Filter Row */}
          <Row style={styles.tableHeaderFiltre}>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Tarih}
                  onChangeText={(text) => handleFilterChange('Tarih', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
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
                  value={filters.Hareket_Cinsi}
                  onChangeText={(text) => handleFilterChange('Hareket_Cinsi', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Hareket_Tipi}
                  onChangeText={(text) => handleFilterChange('Hareket_Tipi', text)}
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
                  value={filters.Depo}
                  onChangeText={(text) => handleFilterChange('Depo', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Karşı_Depo}
                  onChangeText={(text) => handleFilterChange('Karşı_Depo', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Giren_Miktar}
                  onChangeText={(text) => handleFilterChange('Giren_Miktar', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Çıkan_Miktar}
                  onChangeText={(text) => handleFilterChange('Çıkan_Miktar', text)}
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
                  value={filters.Birim_Adı}
                  onChangeText={(text) => handleFilterChange('Birim_Adı', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Brüt_Birim_Fiyatı}
                  onChangeText={(text) => handleFilterChange('Brüt_Birim_Fiyatı', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Net_Birim_Fiyatı}
                  onChangeText={(text) => handleFilterChange('Net_Birim_Fiyatı', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Brüt_Tutar}
                  onChangeText={(text) => handleFilterChange('Brüt_Tutar', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Net_Tutar}
                  onChangeText={(text) => handleFilterChange('Net_Tutar', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Açıklama}
                  onChangeText={(text) => handleFilterChange('Açıklama', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Fatura_Seri}
                  onChangeText={(text) => handleFilterChange('Fatura_Seri', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Fatura_Sıra}
                  onChangeText={(text) => handleFilterChange('Fatura_Sıra', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Sorumluluk_Merkezi}
                  onChangeText={(text) => handleFilterChange('Sorumluluk_Merkezi', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Cari_Kodu}
                  onChangeText={(text) => handleFilterChange('Cari_Kodu', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Cari_İsmi}
                  onChangeText={(text) => handleFilterChange('Cari_İsmi', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Plasiyer}
                  onChangeText={(text) => handleFilterChange('Plasiyer', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Giren_Maliyet_Değer}
                  onChangeText={(text) => handleFilterChange('Giren_Maliyet_Değer', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Çıkan_Maliyet_Değer}
                  onChangeText={(text) => handleFilterChange('Çıkan_Maliyet_Değer', text)}
                  style={styles.textInputStyle2}
                />
                <Filtre width={10} height={10} style={styles.iconStyle2} />
              </View>
            </Col>
            <Col style={[styles.tableCell, { width: 100 }]}>
              <View style={styles.filterContainer}>
                <TextInput
                  value={filters.Kar_veya_Maliyet_Farkı}
                  onChangeText={(text) => handleFilterChange('Kar_veya_Maliyet_Farkı', text)}
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
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Tarih}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Seri}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Sıra}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Evrak_Tipi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Hareket_Cinsi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Hareket_Tipi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Belge_No}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Depo}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Karşı_Depo}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Giren_Miktar}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Çıkan_Miktar}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Miktar}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Birim_Adı}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Brüt_Birim_Fiyatı}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Net_Birim_Fiyatı}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Brüt_Tutar}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Net_Tutar}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Açıklama}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Fatura_Seri}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Fatura_Sıra}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Sorumluluk_Merkezi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Cari_Kodu}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Cari_İsmi}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Plasiyer}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Giren_Maliyet_Değer}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Çıkan_Maliyet_Değer}</Text>
              </Col>
              <Col style={[styles.tableCell, { width: 100 }]}>
                <Text style={styles.cellText}>{item.Kar_veya_Maliyet_Farkı}</Text>
              </Col>
            </Row>
            </TouchableOpacity>
          ))}
      
      
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
    backgroundColor: colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  button: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonSearch: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
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
    maxHeight: 50,
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
  },
  textInputStyle2: {
    width: 90, // Adjust this value
    height: 40, // Adjust this value
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
  datePickerContainer: {
    marginRight: 10,
  },
  datePickerContainerDetail: {
    width: "50%",
    borderRadius: 10,
    marginBottom: 10,
    padding: 5,
    backgroundColor: colors.textInputBg,
  },
 
  dateContainer:{
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
    color: colors.black,
  },
  dateIcon: {
    marginRight: 10,
  },

});
export default StokHareketFoyu;
