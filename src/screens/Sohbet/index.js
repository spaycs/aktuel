import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Alert, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import axiosLinkMain from '../../utils/axiosMain';
import { ProductContext } from '../../context/ProductContext';
import { useAuth } from '../../components/userDetail/Id';
import { Picker } from '@react-native-picker/picker';
import { useAuthDefault } from '../../components/DefaultUser';
import { colors } from '../../res/colors';

const Sohbet = () => {
    const { defaults } = useAuthDefault();
    const { authData } = useAuth(); // Authentication data
    const { addedProducts, setAddedProducts } = useContext(ProductContext); // Product context
    const [userList, setUserList] = useState([]); // State to store user list
    const [selectedUserCode, setSelectedUserCode] = useState(null); // Selected user code
    const [message, setMessage] = useState(''); // Message to be sent
    const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
    const [kullanicikodu, setKullanicikodu] = useState('');

    // Create a ref for the ScrollView
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const fetchSohbetKullanicino = async () => {
          try {
            const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${authData.KullaniciKodu}`);
            const kullanicikodu = response.data[0].IQ_Kod;
            setKullanicikodu(kullanicikodu);
      
          } catch (error) {
            console.error('API Hatası:', error);
          }
        };
    
        fetchSohbetKullanicino();
      }, []);
    

    // Fetch user list from API
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await axiosLinkMain.get('/Api/Sohbet/KullaniciListesiSohbet');
                setUserList(response.data); // Assume response.data is an array of users
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch user list');
            }
        };

        fetchUserList();
    }, []);

    useEffect(() => {
        const fetchChatMessages = async () => {
            if (selectedUserCode && defaults.length > 0) {
                const kod = defaults[0].IQ_Kod; 
                try {
                    const response = await axiosLinkMain.get(`/Api/Sohbet/SohbetGoruntule?kod=${kod}&skod=${selectedUserCode}`);
                    console.log(response.data);
                    setChatMessages(response.data); // Assume response.data is an array of messages
                } catch (error) {
                    Alert.alert('Error', 'Failed to fetch chat messages');
                }
            }
        };

        fetchChatMessages();

        // Set up interval to fetch chat messages every 10 seconds
        const intervalId = setInterval(() => {
            fetchChatMessages();
        }, 10000); // 10000 ms = 10 seconds

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [selectedUserCode, defaults]);

    // Scroll to the bottom of the chat container when messages change
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (!selectedUserCode || !message) {
            Alert.alert('Error', 'Mesaj alanı boş olamaz');
            return;
        }

        const kod = kullanicikodu; 
        const skod = selectedUserCode; 
        const url = `/Api/Sohbet/Sohbet?kod=${kod}&skod=${skod}&mesaj=${encodeURIComponent(message)}`;

        try {
            await axiosLinkMain.post(url); 
            setMessage(''); 
            // Fetch chat messages again after sending the message
            const response = await axiosLinkMain.get(`/Api/Sohbet/SohbetGoruntule?kod=${kod}&skod=${selectedUserCode}`);
            setChatMessages(response.data); // Update chat messages
        } catch (error) {
            Alert.alert('Error', 'Failed to send message');
        }
    };

        return (
            <View style={styles.container}>
                <View style={styles.userSelectionContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                        {userList.map((user) => (
                            <TouchableOpacity
                                key={user.KOD}
                                onPress={() => setSelectedUserCode(user.KOD)}
                                style={[
                                    styles.userItem,
                                    selectedUserCode === user.KOD && styles.selectedUserItem
                                ]}
                            >
                                <Text style={styles.userName}>{user.AD}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
    
                {selectedUserCode && (
                    <View style={styles.chatContainer}>
                        <ScrollView style={styles.messageContainer} ref={scrollViewRef}>
                            {chatMessages.map((message, index) => {
                                const isCurrentUser = message.Kod === kullanicikodu;
    
                                return (
                                    <View
                                        key={index}
                                        style={[
                                            styles.messageItem,
                                            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
                                        ]}
                                    >
                                        <Text style={styles.messageUser}>{message.Kullanici}:</Text>
                                        <Text style={styles.messageText}>{message.Mesaj}</Text>
                                        <Text style={styles.messageDate}>
                                            {new Date(message.Tarih).toLocaleString()}
                                        </Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Mesajını yaz"
                                value={message}
                                onChangeText={setMessage}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
                                <Text style={styles.buttonText}>Gönder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.textinputgray,
    },
    userSelectionContainer: {
    },
    picker: {
        height: 40,
        width: '100%',
    },
    userScroll: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    userItem: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.red,
        marginHorizontal: 5,
        marginVertical: 10,
    },
    selectedUser: {
        backgroundColor:  colors.buttonblue,
    },
    userName: {
        color: colors.white,
    },
    messageItem: {
        marginBottom: 8,
        padding: 10,
        borderRadius: 10,
        maxWidth: '75%',
    },
    currentUserMessage: {
        alignSelf: 'flex-end', // Sağda göster
        backgroundColor: '#d9fdd3',
        color: colors.white,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
    },
    otherUserMessage: {
        alignSelf: 'flex-start', // Solda göster
        backgroundColor: '#eeeeee',
        color: colors.black,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    messageContainer: {
        flex: 1,
        marginBottom: 5,
    },
    messageItem: {
        marginBottom: 8,
    },
    messageUser: {
        fontWeight: 'bold',
    },
    messageText: {
        fontSize: 13,
    },
    messageDate: {
        fontSize: 11,
        color: '#888',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    inputContainer: {
        flexDirection: 'row',
    },
    button: {
        height: 40,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 5,
    },
    buttonText: {
        color: colors.white,
        fontSize: 13,
    },
});

export default Sohbet;
