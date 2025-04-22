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
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import MobileAds from 'react-native-google-mobile-ads';
import ImageViewing from 'react-native-image-viewing';
import axiosLinkMain from '../../utils/axiosMain'; // API bağlantısı
import axios from 'axios';

const { width } = Dimensions.get('window');

// 📢 Gerçek Reklam Birimi ID'lerin
const BANNER_AD_UNIT_ID = "ca-app-pub-3413497302597553/7062909821";
const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3413497302597553/9961306414";
const REWARDED_AD_UNIT_ID = 'ca-app-pub-3413497302597553/9048904753';


const KatalogSlider = ({ route }) => {
  const { katalogId, marketId } = route.params;
  const [images, setImages] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const hasShownInterstitial = useRef(false);
  const [isLogSent, setIsLogSent] = useState(false); // API çağrısının yapılıp yapılmadığını takip etmek için
  const interstitialRef = useRef(null);

const rewardedAdRef = useRef(
  RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  })
);

useEffect(() => {
  console.log('🧪 RewardedAdEventType:', RewardedAdEventType);
  const timeout = setTimeout(() => {
    const rewardedAd = rewardedAdRef.current;

    const onAdLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewardedAd.show();
      }
    );

    const onAdEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('İzlenme tamamlandı.', reward);
      }
    );

    rewardedAd.load();

    return () => {
      onAdLoaded();   // bu unsubscribe eder
      onAdClosed();
      onAdEarned();
    };
  }, 10000);

  return () => clearTimeout(timeout);
}, []);
    
  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
  
    interstitialRef.current = interstitial;
  
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });
  
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      hasShownInterstitial.current = true;
      interstitial.load(); // kapandıktan sonra tekrar yüklenir
    });
  
    interstitial.load(); // ilk yükleme
  
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);
      useEffect(() => {
        // İlk render'da sadece çalışacak
        const logHareket = async () => {
          if (isLogSent) return;  // Eğer log zaten gönderildiyse, fonksiyonu durdur
    
          try {
            const body = {
              Message: 'Katalog Sayfası Açıldı', // Hardcoded message
              Data: `Katalog Id: ${katalogId}`,   // Hardcoded data
              User: 'Genel'
            };
    
            const response = await axios.post('http://31.210.85.83:8055/api/Log/HareketLogEkle', body);
    
            if (response.status === 200) {
              console.log('Hareket Logu başarıyla eklendi');
              setIsLogSent(true); // Başarıyla log eklendikten sonra flag'i true yap
            } else {
              console.log('Hareket Logu eklenirken bir hata oluştu');
            }
          } catch (error) {
            console.error('API çağrısı sırasında hata oluştu:', error);
          }
        };
    
        logHareket(); // Sayfa yüklendiğinde API çağrısını başlat
      }, []); // Boş bağımlılık dizisi, yalnızca ilk render'da çalışacak

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


  const handleScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / width);

    if (
      currentIndex === images.length - 1 &&
      interstitialLoaded &&
      !hasShownInterstitial.current
    ) {
      interstitialRef.current?.show();
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
