import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFavorites } from '../../utils/storage';
import axiosLinkMain from '../../utils/axiosMain'; 

const Favorites = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = await getFavorites();
        const marketResponse = await axiosLinkMain.get('/api/magaza/magazalar');
        const allMarkets = marketResponse.data.map((item) => ({
          id: item.MagazaId,
          name: item.Adi,
          imageUrl: item.Gorsel,
        }));

        const enrichedFavorites = favs.map(fav => {
          const matchedMarket = allMarkets.find(market => market.id === fav.id);
          return matchedMarket ? { ...fav, imageUrl: matchedMarket.imageUrl } : fav;
        });

        setFavorites(enrichedFavorites);
      } catch (error) {
        console.error('Favoriler çekilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchFavorites);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.marketContainer}
      onPress={() => navigation.navigate('MarketDetail', { marketId: item.id, name: item.name })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.marketImage} />
      <Text style={styles.marketTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favori Mağazalarım</Text>
      {loading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz hiçbir mağazayı favorilerinize eklemediniz.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
        />
      )}
    </SafeAreaView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 10 },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
  },
  marketContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D6D6D6',
  },
  marketImage: { width: 60, height: 60, resizeMode: 'contain', marginBottom: 5 },
  marketTitle: { fontSize: 14, fontWeight: '500' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
