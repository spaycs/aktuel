import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, FlatList, Alert, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axiosLinkMain from '../utils/axiosMain';
import { ProductContext } from '../context/ProductContext';
import { Ara, Left, Takvim } from '../res/images';
import { useAuthDefault } from '../components/DefaultUser';
import { useAuth } from '../components/userDetail/Id';

const TahsilatTediyeKrediKartiModal = ({ isModalVisible, setIsModalVisible }) => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [normalTipi, setNormalTipi] = useState('');
  const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
  const [date, setDate] = useState(new Date());
  const [cha_aciklama, setCha_aciklama] = useState('');
  const [cha_meblag, setCha_meblag] = useState('1');
  const [cha_kasa_hizkod, setCha_kasa_hizkod] = useState('');
  const [cha_kasa_isim, setCha_kasa_isim] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCarrierModalVisible, setIsCarrierModalVisible] = useState(false);
  const [nakitKodlariList, setNakitKodlariList] = useState([]);
  const [isTcmbModalVisible, setIsTcmbModalVisible] = useState(false);
  const [tcmbKodlariList, setTcmbKodlariList] = useState([]);
  const [sck_banka_adres1, setSck_banka_adres1] = useState('');
  const [sck_sube_adres2, setSck_sube_adres2] = useState('');
  const [sck_hesapno_sehir, setSck_hesapno_sehir] = useState('');


  useEffect(() => {
    const fetchTcmbKodlariList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Banka/Bankalar');
        setTcmbKodlariList(response.data);
      } catch (error) {
        console.error('Error fetching TCMB kodlari list:', error);
      }
    };

    fetchTcmbKodlariList();
  }, []);

  const handleTcmbSelect = (item) => {
    setCha_kasa_isim(item.Banka_İsmi);
    setCha_kasa_hizkod(item.Banka_Kodu);
    setSck_banka_adres1(item.Banka_İsmi); // Banka kodunu ayarlıyoruz
    setSck_sube_adres2(item.Sube);  // Banka ismini ayarlıyoruz
    setSck_hesapno_sehir(item.Hesap_No);
    setIsTcmbModalVisible(false);
  };

  const handleCarrierSearch = () => {
    fetchNakitKodlariList(); 
    setIsCarrierModalVisible(true); 
  };

  const handleAddProduct = () => {
    // Tutar alanı boşsa ekleme işlemini durdur
    if (!cha_meblag || parseFloat(cha_meblag) <= 0) {
      Alert.alert("Uyarı",'Lütfen geçerli bir tutar girin.');
      return;
    }
    
    const formattedDate = formatDate(date).replace(/\./g, '');
    const newProductId = `${cha_kasa_hizkod}_${formattedDate}_${Date.now()}`;
    
    // faturaBilgileri.sth_evraktip değerini buradan alacağız
    const evrakTipi = faturaBilgileri?.sth_evraktip; // defaults veya uygun state'den alın
  
    let cha_cinsi, cha_karsidgrupno, cha_sntck_poz, cha_kasa_hizmet;
  
    // faturaBilgileri.sth_evraktip değerine göre ayarlama
    if (evrakTipi === 64) {
      cha_cinsi = 22;
      cha_karsidgrupno = 8;
      cha_sntck_poz = 1;
      cha_kasa_hizmet = 2; // Eğer başka bir değer atanmayacaksa null bırakabilirsin
    } else if (evrakTipi === 1) {
      cha_cinsi = 19;
      cha_karsidgrupno = 7;
      cha_sntck_poz = 2;
      cha_kasa_hizmet = 2; 
    } 
  
    const newProduct = {
      id: newProductId,
      cha_aciklama,
      cha_meblag,
      cha_kasa_hizkod,
      cha_kasa_isim,
      date: formattedDate,
      tediyeturu: "Kredi Karti",
      cha_kasa_hizmet,
      cha_cinsi,
      cha_karsidgrupno,
      cha_sntck_poz,
      sck_banka_adres1,
      sck_sube_adres2,
      sck_hesapno_sehir,
    };
  
    setAddedProducts([
      ...addedProducts,
      newProduct,
    ]);
    setIsModalVisible(false);
  
    setCha_aciklama('');
    setCha_meblag('');
    setCha_kasa_hizkod('');
    setCha_kasa_isim('');
    setSck_banka_adres1('');
    setSck_sube_adres2('');
    setSck_hesapno_sehir('');
  };
  
  
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}${month}${year}`; 
  };
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const newDate = selectedDate || date;
    setDate(newDate);
  
    const formattedDate = formatDate(newDate);
    setFaturaBilgileri(prevState => ({
      ...prevState,
      date: formattedDate,
    }));
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <ScrollView style={{ backgroundColor: 'white' }}>
        <SafeAreaView style={MainStyles.modalContainer}>
          <View style={MainStyles.modalContent}>
            <Text style={MainStyles.modalTahsilatTitle}>Kredi Kartı Tahsilat</Text>
            <Text style={MainStyles.formTitle}>Tarih</Text>
            <View style={MainStyles.datePickerContainer}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} >
              <View style={MainStyles.dateContainer}>
              <Takvim name="calendar-today" style={MainStyles.dateIcon} />
              <Text style={MainStyles.dateText}>{formatDate(date)}</Text>
            </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
            <Text style={MainStyles.formTitle}>Kasa Banka Kodu</Text>
            <View style={MainStyles.inputContainer}>
              <TextInput
                style={MainStyles.inputCariKodu}
                placeholder="Kasa Banka Kodu"
                placeholderTextColor={colors.placeholderTextColor}
                value={cha_kasa_hizkod}
                onChangeText={setCha_kasa_hizkod}
              />
              <TouchableOpacity
                style={MainStyles.buttonCariKodu}
                onPress={() => setIsTcmbModalVisible(true)}
              >
                <Text><Ara/></Text>
              </TouchableOpacity>
            </View>
            <Text style={MainStyles.formTitle}>Kasa Banka İsmi</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Kasa Banka İsmi"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_kasa_isim}
              onChangeText={setCha_kasa_isim}
            />
           <Text style={MainStyles.formTitle}>Açıklama</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Açıklama"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_aciklama}
              onChangeText={setCha_aciklama}
            />
            <Text style={MainStyles.formTitle}>Tutar</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Tutar"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_meblag}
              keyboardType="numeric"
              onChangeText={(value) => {
                // Virgülü noktaya çevir
                const formattedValue = value.replace(',', '.');

                // Sadece rakamlar ve . (nokta) karakteri kabul edilsin
                const validValue = formattedValue.replace(/[^0-9.]/g, '');

                // Eğer birden fazla . (nokta) varsa, sonrasını kabul etme
                const finalValue = validValue.split('.').length > 2 ? validValue.slice(0, -1) : validValue;

                setCha_meblag(finalValue);
              }}
            />

            <TouchableOpacity
              style={MainStyles.addButton}
              onPress={handleAddProduct}
            >
              <Text style={MainStyles.addButtonText}>Ekle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{position :'absolute', marginTop: 12, marginLeft: 10}}  onPress={() => setIsModalVisible(false)}>
              <Left width={17} height={17}/>
            </TouchableOpacity>

             {/* TCMB Modal */}
            <Modal
              visible={isTcmbModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsTcmbModalVisible(false)}
            >
              <View style={MainStyles.modalContainer}>
              <View>
                <Text style={MainStyles.modalTitle}>TCMB Banka Kodları</Text>
              </View>
                <TouchableOpacity TouchableOpacity style={{position :'absolute', marginTop: 20, marginLeft: 10}}  onPress={() => setIsTcmbModalVisible(false)}>
                  <Left width={17} height={17}/>
                </TouchableOpacity>
                <View style={MainStyles.modalContent}>
                  <FlatList
                    data={tcmbKodlariList}
                    keyExtractor={(item, index) => `${item.Banka_Kodu}_${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={MainStyles.modalItem}
                        onPress={() => handleTcmbSelect(item)}
                      >
                        <Text style={MainStyles.modalItemText}>{item.Banka_Kodu} - {item.Banka_İsmi} - {item.Sube} </Text>
                      </TouchableOpacity>
                    )}
                  />
                
                </View>
              </View>
            </Modal>

          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default TahsilatTediyeKrediKartiModal;
