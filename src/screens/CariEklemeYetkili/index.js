import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Takvim } from '../../res/images';
import { ProductContext } from '../../context/ProductContext';
import { useAuthDefault } from '../../components/DefaultUser';
import ProductModal from '../../context/ProductModal';
import CariListModal from '../../context/CariListModal';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { DataTable } from 'react-native-paper';
import Button from '../../components/Button';

const CariEklemeYetkili = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [mye_isim, setMye_isim] = useState('');
  const [mye_soyisim, setMye_soyisim] = useState('');
  const [mye_dahili_telno, setMye_dahili_telno] = useState('');
  const [mye_email_adres, setMye_email_adres] = useState('');
  const [mye_cep_telno, setMye_cep_telno] = useState('');
// Tüm Değişken Değerleri

const handleInputChange = (field, value) => {
  setFaturaBilgileri((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setFaturaBilgileri({});
      };
    }, [])
  );

  return (
    <ScrollView style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
        {/* İsim */}
        <Text style={MainStyles.formTitle}>İsim</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputStokKodu}
            placeholder="İsim"
            value={mye_isim}
            onChangeText={(value) => {
              setMye_isim(value);
              handleInputChange('mye_isim', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Soyisim */}
        <Text style={MainStyles.formTitle}>Soyisim</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputStokKodu}
            placeholder="Soyisim"
            value={mye_soyisim}
            onChangeText={(value) => {
              setMye_soyisim(value);
              handleInputChange('mye_soyisim', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Dahili Telefon Numarası */}
        <Text style={MainStyles.formTitle}>Dahili Telefon Numarası</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputStokKodu}
            placeholder="Dahili Telefon Numarası"
            value={mye_dahili_telno}
            keyboardType="numeric"
            onChangeText={(value) => {
              setMye_dahili_telno(value);
              handleInputChange('mye_dahili_telno', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* E-posta Adresi */}
        <Text style={MainStyles.formTitle}>E-Posta Adresi</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputStokKodu}
            placeholder="E-posta Adresi"
            value={mye_email_adres}
            onChangeText={(value) => {
              setMye_email_adres(value);
              handleInputChange('mye_email_adres', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Cep Telefonu Numarası */}
        <Text style={MainStyles.formTitle}>Cep Telefonu</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputStokKodu}
            placeholder="Cep Telefonu Numarası"
            value={mye_cep_telno}
            keyboardType="numeric"
            onChangeText={(value) => {
              setMye_cep_telno(value);
              handleInputChange('mye_cep_telno', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

       
    </View>
    </ScrollView>
  );
};

export default CariEklemeYetkili;


