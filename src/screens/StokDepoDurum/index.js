import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuthDefault } from '../../components/DefaultUser';
import FastImage from 'react-native-fast-image';

const StokDepoDurum = ({ navigation, route }) => {
  const { Stok_Kod } = route.params;
  const [loading, setLoading] = useState(false);
  const [depoData, setDepoData] = useState([]); // Depo verileri için state
  const [error, setError] = useState('');
  const { defaults } = useAuthDefault();

  const fetchStokDetayData = async () => {
    setLoading(true);
    try {
      const response = await axiosLinkMain.get(`/api/Raporlar/StokDurum?stok=${Stok_Kod}&userno=${defaults[0].IQ_MikroPersKod}`);
      const data = response.data || []; // Gelen veri yoksa boş dizi döner
      setDepoData(data); // Depo verilerini state'e ata
    } catch (err) {
      console.error('API bağlantı hatası:', err);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStokDetayData(); // Component mount olduğunda API çağrısı yap
  }, []);

  const closeModal = () => {
    navigation.goBack(); // Modalı kapat
  };
  

  return (
    <View style={styles.container}>
      <View style={MainStyles.marginTop10}>
        {loading ? (
            <FastImage
            style={MainStyles.loadingGif}
            source={require('../../res/images/image/pageloading.gif')}
            resizeMode={FastImage.resizeMode.contain}/>
        ) : (
          <>
            {depoData.length > 0 ? (
              <ScrollView>
                <ScrollView horizontal={true} style={MainStyles.horizontalScroll}>
                  <Grid>
                    {/* Başlık Satırı */}
                    <Row style={styles.tableHeader}>
                      <Col style={[styles.tableCell, { width: 100 }]}>
                        <Text style={styles.colTitle}>Depo No</Text>
                      </Col>
                      <Col style={[styles.tableCell, { width: 170 }]}>
                        <Text style={styles.colTitle}>Depo Adı</Text>
                      </Col>
                      <Col style={[styles.tableCell, { width: 110 }]}>
                        <Text style={styles.colTitle}>Depo Miktar</Text>
                      </Col>
                    </Row>
                    {/* Dinamik Satırlar */}
                    {depoData.map((item, index) => (
                      <Row key={index} style={styles.tableRow}>
                        <Col style={[styles.tableCell, { width: 100 }]}>
                          <Text style={styles.colText}>{item.dep_no}</Text>
                        </Col>
                        <Col style={[styles.tableCell, { width: 170 }]}>
                          <Text style={styles.colText}>{item.dep_adi}</Text>
                        </Col>
                        <Col style={[styles.tableCell, { width: 110 }]}>
                          <Text style={styles.colText}>{item.DepoMiktarı}</Text>
                        </Col>
                      </Row>
                    ))}
                  </Grid>
                </ScrollView>
              </ScrollView>
            ) : (
              <Text style={MainStyles.modalCariDetayText}>
                {error || 'Veri bulunamadı.'}
              </Text>
            )}
          </>
        )}
      </View>
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
  tableHeader: {
    backgroundColor: '#f3f3f3', // Başlık arka plan rengi
    height: 35,

  },
  tableCell: {
    borderWidth: 1, // Hücreler arasına dikey çizgi ekler
    borderColor: colors.textInputBg, // Hücre dikey çizgi rengi
    justifyContent: 'center', // Hücrelerin içeriğini ortalamak
    paddingHorizontal: 5,
  },
  colTitle:{
    fontSize: 11,
  },
  colText:{
    fontSize: 9,
  },
  tableRow: {
    backgroundColor: 'white',
    borderColor: colors.textInputBg,
    height: 30,
  },

});

export default StokDepoDurum;
