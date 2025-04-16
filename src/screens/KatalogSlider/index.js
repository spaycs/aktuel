import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import MobileAds from 'react-native-google-mobile-ads';
import ImageViewing from 'react-native-image-viewing';
import axiosLinkMain from '../../utils/axiosMain'; // API bağlantısı

const { width } = Dimensions.get('window');

// 📢 Gerçek Reklam Birimi ID'lerin
const BANNER_AD_UNIT_ID = "ca-app-pub-3413497302597553/7062909821";
const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3413497302597553/9961306414";

const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true,
});

const KatalogSlider = ({ route }) => {
  const { katalogId, marketId } = route.params;
  const [images, setImages] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const hasShownInterstitial = useRef(false);

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => console.log('AdMob initialized'));

    fetchImages();
  }, [marketId, katalogId]);

  const fetchImages = async () => {
    try {
      const response = await axiosLinkMain.get(
        `/Api/AktuelGorseller/AktuelGorseller?magazaid=${marketId}&aktuelid=${katalogId}`
      );
      const formattedImages = response.data.map((item) => ({
        uri: item.AktuelGorsel,
        AktuelGunler: item.AktuelGunler,
      }));
      setImages([...formattedImages, { isAd: true }]);
    } catch (error) {
      console.error('Aktüel görselleri çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      hasShownInterstitial.current = true;
      interstitial.load();
    });

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const handleScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / width);

    if (
      currentIndex === images.length - 1 &&
      interstitialLoaded &&
      !hasShownInterstitial.current
    ) {
      interstitial.show();
    }
  };

  const renderItem = ({ item, index }) => {
    if (item?.isAd) {
      return (
        <View style={styles.adPage}>
          <BannerAd
            unitId={BANNER_AD_UNIT_ID}
            size={BannerAdSize.ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.imageWrapper}
        activeOpacity={0.9}
        onPress={() => {
          setSelectedIndex(index);
          setIsVisible(true);
        }}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={handleScrollEnd}
        />
      )}

      <View style={styles.adContainer}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>

      <ImageViewing
        images={images
          .filter((img) => !img?.isAd)
          .map((img) => ({ uri: img.uri }))}
        imageIndex={selectedIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default KatalogSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.98,
    height: '100%',
  },
  adContainer: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  adPage: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  imageText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
