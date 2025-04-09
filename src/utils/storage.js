import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFavorites = async () => {
  const data = await AsyncStorage.getItem('FAVORITE_MARKETS');
  return data ? JSON.parse(data) : [];
};

export const setFavorites = async (favorites) => {
  await AsyncStorage.setItem('FAVORITE_MARKETS', JSON.stringify(favorites));
};
