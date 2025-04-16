import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  getAlisverisListesi,
  setAlisverisListesi,
} from '../../utils/alisverisStorage'; // ← path'e göre güncelle
import { colors } from '../../res/colors';

const AlisverisListesi = () => {
  const [itemText, setItemText] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const saved = await getAlisverisListesi();
      setItems(saved);
    };
    loadData();
  }, []);

  const handleAddItem = async () => {
    if (itemText.trim() === '') return;
    const updated = [...items, itemText.trim()];
    setItems(updated);
    await setAlisverisListesi(updated);
    setItemText('');
  };

  const handleDeleteItem = async (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
    await setAlisverisListesi(updated);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>{index + 1}. {item}</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(index)} style={styles.deleteButton}>
        <Icon name="trash" size={18} color="#d11a2a" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alışveriş Listesi</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={itemText}
          onChangeText={setItemText}
          placeholder="Ürün adı girin..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
          <Icon name="plus" size={15} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default AlisverisListesi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 8,
  },
  listContainer: {
    paddingBottom: 30,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 5,
  },
});
