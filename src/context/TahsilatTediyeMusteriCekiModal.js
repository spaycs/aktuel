import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, FlatList, Alert, SafeAreaView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axiosLinkMain from '../utils/axiosMain';
import { ProductContext } from '../context/ProductContext';
import { Ara, Left, Takvim } from '../res/images';
import { Picker } from '@react-native-picker/picker';
import { useAuthDefault } from '../components/DefaultUser';
import { useAuth } from '../components/userDetail/Id';

const TahsilatTediyeMusteriCekiModal = ({ isModalVisible, setIsModalVisible, firmaCekiValue  }) => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [normalTipi, setNormalTipi] = useState('');
  const { addedProducts, setAddedProducts, faturaBilgileri } = useContext(ProductContext);
  const [date, setDate] = useState(new Date());
  const [pickerValue, setPickerValue] = useState("Kendisi");
  const [cha_aciklama, setCha_aciklama] = useState('');
  const [cha_meblag, setCha_meblag] = useState('1');
  const [cha_kasa_hizkod, setCha_kasa_hizkod] = useState('');
  const [cha_kasa_isim, setCha_kasa_isim] = useState('');
  const [sck_bankano, setSck_bankano] = useState('');
  const [sck_TCMB_Banka_adi, setSck_TCMB_Banka_adi] = useState('');
  const [sck_TCMB_Banka_kodu, setSck_TCMB_Banka_kodu] = useState('');
  const [sck_TCMB_Sube_kodu, setSck_TCMB_Sube_kodu] = useState('');
  const [sck_TCMB_Sube_adi, setSck_TCMB_Sube_adi] = useState('');
  const [sck_TCMB_il_kodu, setSck_TCMB_il_kodu] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAdatVadesiPicker, setShowAdatVadesiPicker] = useState(false);
  const [isCarrierModalVisible, setIsCarrierModalVisible] = useState(false);
  const [isTcmbModalVisible, setIsTcmbModalVisible] = useState(false);
  const [nakitKodlariList, setNakitKodlariList] = useState([]);
  const [tcmbKodlariList, setTcmbKodlariList] = useState([]);
  const [tasrami, setTasrami] = useState(false);
  const [adatVadesi, setAdatVadesi] = useState(new Date());
  const [borcluIsim, setBorcluIsim] = useState('');
  const [hesapNo, setHesapNo] = useState('');
  const [cekNo, setCekNo] = useState('');
  const [kesideYeri, setKesideYeri] = useState('');
  const [selectedPickerValue, setSelectedPickerValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
const [bankList, setBankList] = useState([]);

  useEffect(() => {
    if (faturaBilgileri?.sth_cari_unvan1) {
      setBorcluIsim(faturaBilgileri.sth_cari_unvan1);
    }
  }, [faturaBilgileri]); 

  const handleFetchKodlarList = async () => {
    try {
      if (defaults) {
        const firmaNo = defaults[0].IQ_FirmaNo;
        const apiUrl = firmaCekiValue === 'Firma Çeki' 
          ? `/Api/Banka/Bankalar` 
          : `/Api/Kasa/Kasalar?firmano=${firmaNo}&tip=Çek%20Kasası`;
        
        const response = await axiosLinkMain.get(apiUrl);
        if (firmaCekiValue === 'Firma Çeki') {
          setBankList(response.data);
          setIsBankModalVisible(true);
        } else {
          setNakitKodlariList(response.data);
          setIsCarrierModalVisible(true);
        }
      } else {
        console.error('IQ_FirmaNo değeri bulunamadı');
      }
    } catch (error) {
      console.error('Error fetching kodlar list:', error);
    }
  };
  
  useEffect(() => {
    const fetchTcmbKodlariList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Banka/YerelBankaKodlari');
        setTcmbKodlariList(response.data);
      } catch (error) {
        console.error('Error fetching carrier list:', error);
      }
    };

    fetchTcmbKodlariList();
  }, []);
  
  const filteredTcmbKodlariList = tcmbKodlariList.filter(item =>
    item.BANKA_KODU.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.BANKA_SUBE_KODU.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.BANKA_ADI.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.BANKA_SUBE_ADI.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.BANKA_IL_ADI.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCarrierSelect = (item) => {
    setCha_kasa_hizkod(item.Kod);
    setCha_kasa_isim(item.Isim); 
    setIsCarrierModalVisible(false); 
  };
  
  const handleTcmbSelect = (item) => {
    setSck_TCMB_Banka_adi(item.BANKA_ADI);  
    setSck_TCMB_Banka_kodu(item.BANKA_KODU);  
    setSck_TCMB_Sube_adi(item.BANKA_SUBE_ADI);
    setSck_TCMB_Sube_kodu(item.BANKA_SUBE_KODU);
    setSck_TCMB_il_kodu(item.BANKA_IL_KODU);
    
    setIsTcmbModalVisible(false); 
  };

  const handleAddProduct = () => {

     // Tutar alanı boşsa ekleme işlemini durdur
     if (!cha_meblag || parseFloat(cha_meblag) <= 0) {
      Alert.alert("Uyarı",'Lütfen geçerli bir tutar girin.');
      return;
    }

    const formattedDate = formatDate(date).replace(/\./g, '');
    const formattedAdatVadesi = formatDate(adatVadesi).replace(/\./g, '');
    const newProductId = `${cha_kasa_hizkod}_${formattedDate}_${Date.now()}`;

     // Burada faturaBilgileri.sth_evraktip değerine göre değişkenleri ayarlıyoruz
     let cha_cinsi, cha_karsidgrupno, cha_sntck_poz, cha_kasa_hizmet;
  
  
     if (faturaBilgileri.sth_evraktip === 64) {
       cha_kasa_hizmet = 2; 
       cha_cinsi = 3;
       cha_karsidgrupno = 2;
       cha_sntck_poz = 1;
     } else if (faturaBilgileri.sth_evraktip === 1) {
       cha_kasa_hizmet = 4; 
       cha_cinsi = 1;
       cha_karsidgrupno = 0;
       cha_sntck_poz = 0;
     }

    const newProduct = {
      id: newProductId,
      cha_aciklama,
      cha_meblag,
      cha_kasa_hizkod,
      cha_kasa_isim,
      sck_TCMB_Banka_adi,
      sck_TCMB_Banka_kodu,
      sck_TCMB_Sube_kodu,
      sck_TCMB_Sube_adi,
      sck_TCMB_il_kodu,
      date: formattedDate,
      pickerValue,
      borcluIsim,
      sck_bankano: cha_kasa_hizkod, 
      hesapNo,
      cekNo,
      kesideYeri,
      tasrami: tasrami ? 1 : 0,
      adatVadesi: formattedAdatVadesi,
      tediyeturu: "Musteri Ceki",
      cha_kasa_hizmet,
      cha_cinsi,
      cha_karsidgrupno,
      cha_sntck_poz,
    };

    setAddedProducts([...addedProducts, newProduct]);
    setIsModalVisible(false);

    // Reset fields
    setCha_aciklama('');
    setCha_meblag('');
    setCha_kasa_hizkod('');
    setCha_kasa_isim('');
    setSck_TCMB_Banka_adi('');
    setSck_TCMB_Banka_kodu('');
    setSck_TCMB_Sube_adi('');
    setSck_TCMB_Sube_kodu('');
    setSck_TCMB_il_kodu('');
    setBorcluIsim('');
    setSck_bankano('');
    setPickerValue('Kendisi');
    setHesapNo('');
    setCekNo('');
    setKesideYeri('');
    setTasrami(false);
  };

  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) return 'Geçersiz Tarih';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const newDate = selectedDate || date;
    setDate(newDate);
  };

  const handleAdatVadesiChange = (event, selectedDate) => {
    setShowAdatVadesiPicker(false);
    const newDate = selectedDate || adatVadesi;
    setAdatVadesi(newDate);
  };

  const handleBankSelect = (item) => {
    // Do something with the selected bank, e.g., set state
    console.log('Selected bank:', item);
    setCha_kasa_hizkod(item.Banka_Kodu);
    setCha_kasa_isim(item.Banka_İsmi);
    setIsBankModalVisible(false); // Close the modal after selection
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
            <Text style={MainStyles.modalTahsilatTitle}>Müşteri Çeki Tahsilat</Text>

          {/* Picker */}
          <Text style={MainStyles.formTitle}>Tip</Text>
          <View style={MainStyles.inputStyleAlinanSiparis}>
            <Picker
              itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
              selectedValue={pickerValue}
              onValueChange={(itemValue) => setPickerValue(itemValue)}
            >
              <Picker.Item label="Kendisi" value="Kendisi" style={MainStyles.textStyle}/>
              <Picker.Item label="Müşterisi" value="Müşterisi" style={MainStyles.textStyle}/>
            </Picker>
          </View>

           {/* Tarih */}
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

            {/* Kasa Banka Kodu */}
            <Text style={MainStyles.formTitle}>Kasa Banka Kodu</Text>
            <View style={MainStyles.musteriCekiBanka}>
            <View style={MainStyles.inputContainer}>
              <TextInput
                style={MainStyles.inputMusteriCeki}
                placeholder="Kasa Banka Kodu"
                placeholderTextColor={colors.placeholderTextColor}
                value={cha_kasa_hizkod}
                onChangeText={setCha_kasa_hizkod}
              />
              <TouchableOpacity
                style={MainStyles.buttonCariKodu}
                onPress={handleFetchKodlarList}
              >
                <Text><Ara/></Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={MainStyles.inputMusteriCeki}
              placeholder="Kasa Banka İsmi"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_kasa_isim}
              onChangeText={setCha_kasa_isim}
            />
            </View>

             {/* Kasa Banka Kodu */}
             <Text style={MainStyles.formTitle}>TCMB Banka Kodu</Text>
             <View style={MainStyles.musteriCekiBanka}>
            <View style={MainStyles.inputContainer}>
              <TextInput
                style={MainStyles.inputMusteriCeki}
                placeholder="TCMB Banka Adi"
                placeholderTextColor={colors.placeholderTextColor}
                value={sck_TCMB_Banka_adi}
                onChangeText={setSck_TCMB_Banka_adi}
              />
              <TouchableOpacity
                style={MainStyles.buttonCariKodu}
                onPress={() => setIsTcmbModalVisible(true)}
              >
                <Text><Ara/></Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={MainStyles.inputMusteriCeki}
              placeholder="Banka Şubesi"
              placeholderTextColor={colors.placeholderTextColor}
              value={sck_TCMB_Sube_adi}
              onChangeText={setSck_TCMB_Sube_adi}
            />
            </View>

             {/* Banka No */}
             <Text style={MainStyles.formTitle}>Banka No</Text>
             <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Banka No"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_kasa_hizkod} // cha_kasa_hizkod değerini yazdırıyoruz
              onChangeText={setCha_kasa_hizkod} // Kullanıcı girişi burada güncelleniyor
              keyboardType="numeric"
            />


            {/* Borçlu İsim */}
            <Text style={MainStyles.formTitle}>Borçlu İsim</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Borçlu İsim"
              placeholderTextColor={colors.placeholderTextColor}
              value={borcluIsim}
              onChangeText={setBorcluIsim}
            />

            {/* Açıklama */}
            <Text style={MainStyles.formTitle}>Açıklama</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Açıklama"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_aciklama}
              onChangeText={setCha_aciklama}
            />

            {/* Hesap No */}
            <Text style={MainStyles.formTitle}>Hesap No</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Hesap No"
              placeholderTextColor={colors.placeholderTextColor}
              value={hesapNo}
              onChangeText={setHesapNo}
              keyboardType="numeric"
            />

            {/* Çek No */}
            <Text style={MainStyles.formTitle}>Çek No</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Çek No"
              placeholderTextColor={colors.placeholderTextColor}
              value={cekNo}
              onChangeText={setCekNo}
              keyboardType="numeric"
            />

            {/* Keşide Yeri */}
            <Text style={MainStyles.formTitle}>Keşide Yeri</Text>
            <TextInput
              style={MainStyles.inputMusteriCekiTextInput}
              placeholder="Keşide Yeri"
              placeholderTextColor={colors.placeholderTextColor}
              value={kesideYeri}
              onChangeText={setKesideYeri}
            />

            {/* Taşra mı? Checkbox */}
            <View style={MainStyles.checkboxContainer}>
              <Text style={MainStyles.dateTitle}>Taşra mı?</Text>
              <CheckBox
                value={tasrami}
                onValueChange={setTasrami}
              />
            </View>

            {/* Adat Vadesi */}
            <Text style={MainStyles.formTitle}>Adat Vadesi</Text>
            <View style={MainStyles.datePickerContainer}>
              <TouchableOpacity onPress={() => setShowAdatVadesiPicker(true)} >
                <View style={MainStyles.dateContainer}>
                  <Takvim name="calendar-today" style={MainStyles.dateIcon} />
                  <Text style={MainStyles.dateText}>{formatDate(adatVadesi)}</Text>
                </View>
              </TouchableOpacity>
              {showAdatVadesiPicker && (
                <DateTimePicker
                  value={adatVadesi}
                  mode="date"
                  display="default"
                  onChange={handleAdatVadesiChange}
                />
              )}
            </View>

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

            {/* Ekle Button */}
            <TouchableOpacity
              style={MainStyles.addButton}
              onPress={handleAddProduct}
            >
              <Text style={MainStyles.addButtonText}>Ekle</Text>
            </TouchableOpacity>

            {/* Kapat Button */}

            <TouchableOpacity style={{position :'absolute', marginTop: 12, marginLeft: 10}} onPress={() => setIsModalVisible(false)}>
            <Left width={17} height={17}/>
            </TouchableOpacity>

            <Modal
            visible={isBankModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsBankModalVisible(false)}
          >
            <View style={MainStyles.modalContainer}>
            <View>
              <Text style={MainStyles.modalTitle}>Banka Kodları</Text>
            </View>
                <TouchableOpacity style={{position :'absolute', marginTop: 25, marginLeft: 10}} onPress={() => setIsBankModalVisible(false)} >
                  <Left width={17} height={17}/>
                </TouchableOpacity>
              <View style={MainStyles.modalContent}>
                <FlatList
                  data={bankList}
                  keyExtractor={(item, index) => `${item.Banka_Kodu}_${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={MainStyles.modalItem}
                      onPress={() => handleBankSelect(item)} // Create this function to handle the selection
                    >
                      <Text style={MainStyles.modalItemText}>
                        {item.Banka_Kodu} - {item.Banka_İsmi} - {item.Sube}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              
              </View>
            </View>
          </Modal>

            <Modal
              visible={isCarrierModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsCarrierModalVisible(false)}
             >
              <View style={MainStyles.modalContainer}>
              <View>
                <Text Text style={MainStyles.modalTitle}>Kasa Kodları</Text>
              </View>
                <TouchableOpacity style={{position :'absolute', marginTop: 25, marginLeft: 10}} onPress={() => setIsCarrierModalVisible(false)}>
                  <Left width={17} height={17}/>
                </TouchableOpacity>
                <View style={MainStyles.modalContent}>
                  <FlatList
                    data={nakitKodlariList}
                    keyExtractor={(item, index) => `${item.Kod}_${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={MainStyles.modalItem}
                        onPress={() => handleCarrierSelect(item)}
                      >
                        <Text style={MainStyles.modalItemText}>{item.Kod} - {item.Isim}</Text>
                      </TouchableOpacity>
                    )}
                  />
                 

                </View>
              </View>
            </Modal>

            <Modal
              visible={isTcmbModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsTcmbModalVisible(false)}
              >
              <View style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                  <Text style={MainStyles.modalTitle}>TCMB Banka Kodu</Text>
                  
                  <View style={MainStyles.searchContainer}>
                    <TextInput
                      style={MainStyles.searchInput}
                      placeholder="TCMB Banka Kodu Ara"
                      placeholderTextColor={colors.placeholderTextColor}
                      value={searchTerm}
                      onChangeText={setSearchTerm} // Arama terimi güncelleniyor
                    />
                  </View>
                  
                  <FlatList
                    data={filteredTcmbKodlariList} // Filtrelenmiş liste kullanılıyor
                    keyExtractor={(item, index) => `${item.BankaKod}_${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={MainStyles.modalItem}
                        onPress={() => handleTcmbSelect(item)}
                      >
                        <Text style={MainStyles.modalItemText}>
                          {item.BANKA_KODU} - {item.BANKA_SUBE_KODU} - {item.BANKA_ADI} - {item.BANKA_SUBE_ADI} - {item.BANKA_IL_ADI}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />

                  <TouchableOpacity style={{position :'absolute', marginTop: 12, marginLeft: 10}} onPress={() => setIsTcmbModalVisible(false)}>
                  <Left width={17} height={17}/>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default TahsilatTediyeMusteriCekiModal;
