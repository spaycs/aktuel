import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { MainStyles } from '../../res/style';
import SatinAlmaTalepFisiProductList from '../../context/SatinAlmaTalepFisiProductList';


const SatinAlmaTalepFisiUrunList = () => {
 
  return (
     <View style={{ flex: 1 }}>
      <SatinAlmaTalepFisiProductList />
    </View>
  );
};

export default SatinAlmaTalepFisiUrunList;
