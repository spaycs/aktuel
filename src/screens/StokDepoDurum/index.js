import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { MainStyles } from '../../res/style';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';
import { useAuthDefault } from '../../components/DefaultUser';

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
    <View >
      <View style={MainStyles.marginTop10}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            {depoData.length > 0 ? (
              <ScrollView>
                <ScrollView horizontal={true} style={MainStyles.horizontalScroll}>
                  <Grid>
                    {/* Başlık Satırı */}
                    <Row style={MainStyles.tableHeader}>
                      <Col style={[MainStyles.tableCell, { width: 100 }]}>
                        <Text style={MainStyles.colTitle}>Depo No</Text>
                      </Col>
                      <Col style={[MainStyles.tableCell, { width: 150 }]}>
                        <Text style={MainStyles.colTitle}>Depo Adı</Text>
                      </Col>
                      <Col style={[MainStyles.tableCell, { width: 100 }]}>
                        <Text style={MainStyles.colTitle}>Depo Miktar</Text>
                      </Col>
                    </Row>
                    {/* Dinamik Satırlar */}
                    {depoData.map((item, index) => (
                      <Row key={index} style={MainStyles.tableRow}>
                        <Col style={[MainStyles.tableCell, { width: 100 }]}>
                          <Text style={MainStyles.colText}>{item.dep_no}</Text>
                        </Col>
                        <Col style={[MainStyles.tableCell, { width: 150 }]}>
                          <Text style={MainStyles.colText}>{item.dep_adi}</Text>
                        </Col>
                        <Col style={[MainStyles.tableCell, { width: 100 }]}>
                          <Text style={MainStyles.colText}>{item.DepoMiktarı}</Text>
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

export default StokDepoDurum;
