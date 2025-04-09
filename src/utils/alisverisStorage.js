import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ALISVERIS_LISTESI';

export const getAlisverisListesi = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log('Veri alınamadı:', e);
    return [];
  }
};

export const setAlisverisListesi = async (list) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.log('Veri kaydedilemedi:', e);
  }
};
