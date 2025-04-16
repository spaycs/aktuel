import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { color: colors.black };

const MarketDetail = ({ route, navigation }) => {
  const { marketId, name } = route.params;
  const [katalogList, setKatalogList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKatalogList = async () => {
      try {
        const response = await axiosLinkMain.get(
          `/api/AktuelGunler/AktuelGunler?magazaid=${marketId}`
        );
        const formattedData = response.data.map(item => ({
          id: item.AktuelId.toString(),
          title: item.AktuelGunler,
        }));
        setKatalogList(formattedData);
      } catch (error) {
        console.log('Aktüel günler çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKatalogList();
  }, [marketId]);

  const handleDatePress = (item) => {
    navigation.navigate('KatalogSlider', {
      katalogId: item.id,
      marketId: marketId, // marketId'yi de ekliyoruz!
    });
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleDatePress(item)}
    >
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary || 'gray'} />
      ) : (
        <FlatList
          data={katalogList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default MarketDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
});
