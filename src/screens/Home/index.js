import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../res/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFavorites, setFavorites } from '../../utils/storage';
import axios from 'axios'; // axios import etmeyi unutma
import axiosLinkMain from '../../utils/axiosMain';
import FastImage from 'react-native-fast-image';


Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { color: colors.black };

// 🔤 Türkçe karakter normalize edici
const normalizeText = (text) => {
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ç/g, 'c')
    .toLowerCase();
};

const Home = ({ navigation }) => {
  const [markets, setMarkets] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [favorites, setLocalFavorites] = useState([]);

  useEffect(() => {
    fetchMarketList();
    const fetchFavs = async () => {
      const favs = await getFavorites();
      setLocalFavorites(favs);
    };
    fetchFavs();
  }, []);

  const fetchMarketList = async () => {
    try {
      const response = await axiosLinkMain.get('/api/magaza/magazalar');
      const apiMarkets = response.data.map((item) => ({
        id: item.MagazaId,
        name: item.Adi,
        imageUrl: item.Gorsel,
      }));
      setMarkets(apiMarkets);
      setFilteredMarkets(apiMarkets);
    } catch (error) {
      console.error('Bağlantı Hatası Market Listesi:', error);
    }
  };

  useEffect(() => {
    const normalizedSearch = normalizeText(searchText);
    const filtered = markets.filter((market) =>
      normalizeText(market.name).includes(normalizedSearch)
    );
    setFilteredMarkets(filtered);
  }, [searchText, markets]);

  const handleMarketPress = (market) => {
    navigation.navigate('MarketDetail', {
      marketId: market.id,
      name: market.name,
    });
  };

  const toggleFavorite = async (market) => {
    const isAlreadyFav = favorites.some((fav) => fav.id === market.id);
    const updatedFavorites = isAlreadyFav
      ? favorites.filter((fav) => fav.id !== market.id)
      : [...favorites, market];

    setLocalFavorites(updatedFavorites);
    await setFavorites(updatedFavorites);
  };

  const renderItem = ({ item }) => {
    const isFav = favorites.some((fav) => fav.id === item.id);
    return (
      <TouchableOpacity
        style={styles.marketContainer}
        onPress={() => handleMarketPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.marketImage} />
        <Text style={styles.marketTitle}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(item)}
          style={styles.favoriteIcon}
        >
          <Icon
            name={isFav ? 'heart' : 'heart-o'}
            size={20}
            color={isFav ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <TextInput
        style={styles.searchInput}
        placeholder="Mağaza ara..."
        value={searchText}
        onChangeText={setSearchText}
      />
       <Text style={styles.title}>Mağazalar</Text>
      <FlatList
        data={filteredMarkets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  marketContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 8,
    marginRight: 5,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  marketImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  marketTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});
