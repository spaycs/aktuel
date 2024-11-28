import { StyleSheet } from "react-native";
import { colors } from "../../colors";

export const MainStyles = {
  /* Main*/
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
        justifyContent: "center",
        borderRadius: 10,
    },

  /* Main*/

  /* Genel */
    // Padding & Margin
    padding5: {
      padding: 5,
    },
    padding10: {
      padding: 10,
    },
    paddingTop10: {
      paddingTop: 10,
    },
    paddingHorizontal15: {
      paddingHorizontal: 15,
    },
    paddingVertical15: {
      paddingVertical: 15,
    },
    margin5: {
      margin: 5,
    },
    marginBottom5: {
      marginBottom: 5,
    },
    marginBottom10: {
      marginBottom: 10,
    },
    marginTop5: {
      marginTop: 5,
    },
    marginTop10: {
      marginTop: 10,
    },
    marginLeft10: {
      marginLeft: 10,
    },
    marginHorizontal10: {
      marginHorizontal: 10,
    },
    marginVertical10: {
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
    },
    column: {
      flexDirection: 'column',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    alignCenter: {
      alignItems: 'center',
    },
    justifySpaceBetween: {
      justifyContent: 'space-between',
    },
    justifyContent: {
      justifyContent: "center",
    },
    flex1:{
      flex: 1,
    },
    flexDirection:{
      flexDirection: 'row',
    },
    alignItems:{
      alignItems: 'center',
    },
    backgroundColorWhite:{
      backgroundColor: colors.white,
    },
    backgroundColorBlue:{
      backgroundColor: '#d0e9ff',
    },
    fontSize11:{
      fontSize: 11,
    },
    fontSize12:{
      fontSize: 12,
    },
    fontSize13:{
      fontSize: 13,
    },
    fontSize14:{
      fontSize: 14,
    },
    fontSize16:{
      fontSize: 16,
    },
    textColorBlack:{
      color:colors.black,
    },
    textColorPrimary:{
      color:colors.red,
    },
    textAlignCenter:{
      textAlign: 'center',
    },
    textAlignLeft:{
      textAlign: 'left',
    },
    paddingHorizontal15:{
      paddingHorizontal: 15,
    },
    fontWeightBold:{
      fontWeight: 'bold',
    },
    borderRadius5:{
      borderRadius: 5,
    },
    borderRadius10:{
      borderRadius: 10,
    },
    borderWidth1:{
      borderWidth: 1,
    },
    borderColor:{
      borderColor: colors.textInputBg,
    },
    height40:{
      height: 40,
    },
    height50:{
      height: 50,
    },
    paddingLeft10:{
      paddingLeft: 10,
    },
    positionAbsolute:{
      position: 'absolute',
    },
    top50:{
      top:50,
    },
    right0:{
      right:0,
    },
    
    



  


    pageTop:{
      marginTop: 15,
    },
    inputStyle:{
      borderRadius: 5,
      textAlign: 'left',
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      justifyContent: 'center',
      height: 40,
      marginRight: 5,
    },
  
    inputStyle2:{
      borderRadius: 5,
      textAlign: 'left',
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      justifyContent: 'center',
      height: 40,
    },
    teksirabirlestir:{
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      textAlign: 'left',
      marginBottom: 10,
      justifyContent: 'center',
    },
    textLabel: {
      marginBottom: 6, 
      fontSize: 14,
      color: colors.textDark, // İsteğe bağlı renklendirme
    },
    textStyle:{
      fontSize: 12,
      color: colors.black,
      textAlign: 'left',
    },
    modalSearchButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 15,
      color: colors.white
    },
    loadingGif: {
      width: 120,
      height: 80,
      alignSelf: 'center',
      marginTop: 10,
    },
  
  /* Genel */

  /* Login Sayfası */
    loginContainerDetail: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginServiceSetting:{
        backgroundColor: colors.red,
    },
    loginHeader: {
        backgroundColor: colors.white,
        marginTop: 210,
    },
    loginHeaderTitle: {
        fontSize: 13,
        color: colors.black,
        textAlign: "center",
    },
   
    textInputSifre:{
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 52,
      width: '100%',
      borderRadius: 5,
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 10,
      paddingHorizontal:15,
      color: colors.black,
      marginBottom: 30,
      fontSize: 12,
    },
    rememberMeContainer: {
      flexDirection: 'row',
      paddingVertical: 10,
    },
    logintoggleRememberMeContainer: {
      flexDirection: 'row',
    },
    beniunutmatext: {
      margin: 6,
      color: colors.black,
    },
    loginUserSelect:{
      marginTop: 10,
      height: 52,
      backgroundColor: colors.textinputgray,
    },
    modalLoginContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: '90%',
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    textInput: {
      width: '100%',
      height: 40,
      borderColor: colors.textInputBg,
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
      borderRadius: 5,
      fontSize: 12,
      
    },
    textSubeNoInput: {
      width: '100%',
      height: 40,
      borderColor: colors.textInputBg,
      borderWidth: 1,
      marginBottom: 20,
      paddingLeft: 10,
      borderRadius: 10,
      fontSize: 12,
      
    },
    buttonLoginContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
  
    buttonClose: {
      backgroundColor: colors.islembuttongray,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: 10,
    },
  /* Login Sayfası */

  /* Home Sayfası */
    homeContainerFlatlist:{
      paddingTop: 5,
    },
    homeButtonContainer: {
      flex: 1,
      borderWidth: 1,

    },
    homeButtonTitle:{
      fontSize: 11,
      marginLeft: 5,
      color: colors.black,
      
    },
    disabledMenuItem:{
      opacity: 0.5,
    },
    iconActive: {
      color: '#000',
    },
    iconDisabled: {
      color: '#d3d3d3', // Gri renk
    },
    disabledTitle: {
      color: '#a9a9a9', // Gri renk
    },
  /* Home Sayfası */

  /* Stok List Sayfası */
    slContainer:{
      flex: 1,
      backgroundColor: '#ffffff',
      paddingHorizontal: 15,
    },
    slinputUrunAra: {
      flex: 4,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: colors.textinputgray,
      fontSize: 13,
      color: colors.black,
      height: 40,
      marginTop:12,
      borderColor: colors.textInputBg,
      borderWidth: 1,
    },
    slbuttonUrunAra: {
      flex: 1,
      backgroundColor: colors.textinputgray,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      height: 40,
      borderTopRightRadius: 5,
      borderBottomRightRadius:5,
      marginTop:12,
      borderColor: colors.textInputBg,
      borderWidth: 1,
    },
    cameraContainer: {
      width: '100%',
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: 15,
    },
    searchInput: {
      flex: 4, 
      height: 40, 
      paddingHorizontal: 10,
      borderColor: colors.textInputBg,
      borderWidth: 1,
      borderRadius: 5, 
    },
    searchIcon: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchButton: {
      backgroundColor: colors.red,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    itemImage: {
      width: 50,
      height: 50,
      marginRight: 16,
      borderRadius: 4,
    },
    itemTextContainer: {
      
      padding: 10,
      flex: 1,
    },
    itemText: {
      fontSize: 12,
    },
    modalStokContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)', 
    },
    modalStokContent: {
      backgroundColor: colors.white,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
      textAlign: 'left',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      elevation: 5, 
      borderRadius: 10,
    },
    modalCariContainer: {
      flex: 1,
      justifyContent: 'flex-end', 
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalCariContent: {
      backgroundColor: colors.white,
      paddingTop: 10,
      width: '95%',
      maxHeight: '80%',
      textAlign: 'center',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    buttonCariTitle:{
      color: colors.black,
      fontWeight: 'bold',
    },
    modalImage: {
      width: 60,
      height: 60,
      marginBottom: 15,
    },
    closeStokDetayiOnizlemeButtonText:{
      fontSize: 15,
      color: colors.black,
    },
    closeProductModalButton: {
      backgroundColor: colors.red,
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
    },
    modalBackground1: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Statik arka plan siyahlığı
      justifyContent: 'flex-end', // Modalı ekranın altına sabitlemek
    },
    modalContent1: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      elevation: 10,
    },

  /* Stok List Sayfası */

  /* Faturalar */
  faturaContainerMenu:{
    backgroundColor: colors.ustmenubggray,
  },
    faturaContainer: {
      flex: 1,
      padding: 16,
      marginHorizontal: 10,
      borderRadius: 10,
      backgroundColor: colors.white,
      marginTop: 10,
    },
    irsaliyeContainer: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: colors.white,
    },
    formTitle:{
      fontSize: 12, 
      color:'#979797',
      marginBottom: 2,
    },
    input: {
      borderRadius: 10,
      backgroundColor: colors.textinputgray,
      marginBottom: 10,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
    },
    inputContainer:{
      flexDirection: 'row',
    },
    inputEvrakNo: {
      width: "32%",
      borderColor: colors.textInputBg,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      color: colors.black,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      height: 40,
    },
    inputEvrakSira: {
      width: "33%",
      borderColor: colors.textInputBg,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      color: colors.black,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      height: 40,
    },
    inputSatisIrsaliyesiEvrakNo: {
      width: "49%",
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      color: colors.black,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      fontSize: 12,
      height: 40,
    },
    inputSatisIrsaliyesiEvrakSira: {
      width: "49%",
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      color: colors.black,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      fontSize: 12,
      height: 40,
    },
    inputSatisIrsaliyesi: {
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      color: colors.black,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      fontSize: 12,
      height: 40,
    },
    inputDepoSayim: {
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      color: colors.black,
      backgroundColor: colors.textInputBg,
    },
    
    dateTitle:{
      fontSize: 12,
      color: colors.black,
      textAlign: 'left',
      marginBottom: 5,
    },
    inputFaturaTipiLabel:{
      fontSize: 12,
      color: colors.gray,
    },
    inputDepoSecimLabel:{
      fontSize: 12,
      color: colors.black,
    },
    inputCariKodu: {
      flex: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      color: colors.black,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 40,
    },
   
    inputStokKodu: {
      width: "100%",
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      fontSize: 12,
      color: colors.black,
      height: 40,
    },
    inputMusteriSenediKodu: {
      width: "100%",
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      fontSize: 12,
      color: colors.black,
      height: 40,
    },
    inputPersonelAdi: {
      width: "100%",
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      color: colors.black,
      height: 40,
    },
    inputGValue: {
      borderColor: colors.textInputBg,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      fontSize: 12,
      color: colors.placeholderTextColor,
      height: 40,
      paddingHorizontal: 8,
    },
    inputDepoSevk: {
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: colors.textInputBg,
    },
    inputCariUnvan: {
      flex: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      color: colors.black,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 40
    },
    inputTahsilatTediye: {
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textInputBg,
    },
    inputVade: {
      width: "65%",
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 40,
    },
    inputDovizTipi:{
      borderRadius: 5,
      marginBottom: 12,
      backgroundColor: colors.textInputBg,
    },
    inputDovizTipiLabel:{
      fontSize: 12,
      color: colors.black,
    },
    inputDepoSecin:{
      borderRadius: 5,
      marginBottom: 12,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      justifyContent: "center",
      flex: 1,
      height: 40,
      
    },
    buttonEvrakGetir: {
      width: "32%",
      backgroundColor: colors.red,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderRadius: 5,
    },
    buttonCariKodu: {
      width: "20%",
      backgroundColor: colors.red,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderRadius: 5,
    },
    buttonCariKoduText: {
      fontWeight: 'bold',
      color: colors.white,
    },
    buttonCariUnvan: {
      width: "20%",
      backgroundColor: colors.red,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderRadius: 5,
    },
    buttonCariUnvanText: {
      fontWeight: 'bold',
      color: colors.white,
    },
    buttonCariModalDetail: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.islembuttongray,
    },
    buttonSatisFaturasiModalDetail: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.islembuttongray,
    },
    buttonVade: {
      width: "10%",
      borderRadius: 5,
      backgroundColor: colors.red,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      marginRight: 5,
    },
    buttonVadeG: {
      width: "10%",
      borderRadius: 5,
      backgroundColor: colors.yellow,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      marginRight: 5,
    },
    buttonVadeT: {
      width: "10%",
      borderRadius: 5,
      backgroundColor: colors.textInputBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      marginRight: 5,
    },
    buttonbuttonVadeGText: {
      color: colors.white,
      fontWeight: 'bold'
    },
    buttonbuttonVadeTText: {
      color: colors.white,
      fontWeight: 'bold'
    },
    button: {
      height: 40,
      backgroundColor: colors.islembuttongray,
      justifyContent: 'center',
      alignItems: 'center',
    },
   
    buttonText: {
      textAlign: 'center',
      color:  colors.white,
      fontSize: 12,
    },
    buttonTextKapat: {
      fontWeight: 'bold',
      color: colors.red,
    },
    pickerTitle: {
      fontSize: 13
    },
    datePickerContainer: {
      marginBottom: 10,
      borderRadius: 5,
      padding: 5,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      justifyContent: 'center',
      height: 40,
    },
    datePickerContainerDetail: {
      flex: 1,
      marginRight: 10,
      borderRadius: 10,
      marginBottom: 10,
      padding: 5,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      
    },
    datePickerContainerDetail2: {
      flex: 1,
      borderRadius: 10,
      marginBottom: 10,
      padding: 5,
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      
    },
    dateButton: {
      borderColor: colors.textInputBg,
      marginBottom: 10,
      borderWidth:1,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 10,
    },
    dateText: {
      fontSize: 12,
      color: colors.black,
    },
    datePickerText: {
      fontSize: 12,
      color: colors.black,
    },
    dateIcon: {
      marginRight: 10,
    },
    statsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
      color: colors.white,
      marginTop: 10,
    },
    value: {
      fontSize: 16,
      marginBottom: 10,
      textAlign: 'center',
      color: colors.white,
    },
    statsContainerTab: {
      backgroundColor: colors.red,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    dateContainer:{
      flexDirection: 'row',

    },
    sorumlulukModalContainer:{
      width: '100%',
      flex: 1,
      backgroundColor: colors.white,
      position: 'relative',
      paddingTop: 20,
      
    },
    gContainer:{
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.white,
    },
    sorumlulukModalContent: {
      width: '100%',
      backgroundColor: colors.white,
      padding: 10,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Hafif siyah arkaplan
      justifyContent: 'center',
  },
    modalContent: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: 10,
      position: 'relative',
      marginTop: 10,
      paddingHorizontal: 10,
    },
    modalCariDetayContent:{
      height: '95%',
      marginTop: 40,
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    },
    modalTitleAciklama: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.black,
      marginBottom: 10,
    },
    modalTahsilatTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.black,
      marginBottom: 20,
    },
    modalDetail: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    tahsilatButton:{
      padding: 10,
      backgroundColor: colors.textInputBg,
      marginVertical: 5,
      borderRadius: 5,
      alignItems: 'center',
    },
    tahsilatSelectedButton: {
      backgroundColor: colors.red,
  },
    tahsilatButtonText:{
      fontSize: 13,
      color: colors.black,
    },

    
  /* Faturalar */
     
  /* Fatura Ürün List */
    urunlistcontainer:{
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: "center",
    },
    
    itemContainer: {
      justifyContent: 'space-between',
      backgroundColor: colors.textinputgray,
      padding: 10,
      borderRadius: 5,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
      marginHorizontal: 12,
      marginBottom: 10,
      marginTop: 2,

    },

    
    
    modalUrunListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalUrunListContent: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
      padding: 20,
    },
    
    modalSatisFaturasiContent: {
      backgroundColor: colors.white,
      paddingTop: 10,
      width: '95%',
      maxHeight: '80%',
      alignItems: 'left',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalSatisFaturasiContainer: {
      flex: 1,
      justifyContent: 'flex-end', 
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    buttonSatisFaturasiDetail: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.islembuttongray,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 10,
      color: colors.black,
    },
    modalCariDetayText: {
      fontSize: 12,
      color: colors.black,
    },
    modalAlinanSiparisItem: {
      justifyContent: 'space-between',
      backgroundColor: colors.textinputgray,
      paddingVertical: 10,
      paddingHorizontal: 5,
      marginBottom: 5,
      marginTop: 5,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
      borderRadius: 5,

    },
    modalCariDetayTextTitle: {
      fontSize: 12,
      color: colors.black,
      fontWeight: 'bold',
    },
    modalCariDetayRow: {
      flexDirection: 'row', // Yatayda hizalama
      justifyContent: 'space-between', // Hücreler arasında boşluk bırak
      marginBottom: 10, // Satırların arasına boşluk
  },
  modalCariDetayCell: {
    flex: 1, // Hücreler eşit genişlikte olsun
    textAlign: 'left', // Soldan hizalama
    fontSize: 14, // Yazı boyutu
    paddingVertical: 5, // Hücre içi dikey padding
},
    picker: {
      height: 200,
      borderColor: colors.gray,
      justifyContent: 'center',
    },
    pickerContainer: {
      width: "50%",
      height: 40,
      borderColor: colors.gray,
      borderWidth: 1,
      marginBottom: 10,
      justifyContent: 'center',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    checkbox: {
      marginRight: 8,
    },
    checkboxLabel: {
      fontSize: 16,
    },
    closeButton: {
      position: 'absolute',
      top: 5,
      right: 10,
      padding: 10,
      borderRadius: 5,
    },
    closeAlinanProductButton: {
      backgroundColor: colors.textInputBg,
      height: 30,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    closeButtonText: {
      color: colors.black,
      textAlign: 'center',
      fontSize: 15,
    },
    closeOnizlemeButton: {
      backgroundColor: colors.red,
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    closeOnizlemeButtonText: {
      fontSize: 13,
      color: colors.white,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    modalCloseButton: {
      position: 'absolute',
      top: 5,
      right: 10,
      padding: 10,
      borderRadius: 5,
    },
    addButton: {
      backgroundColor: colors.red,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    
    },
    addButtonUrunDetay: {
      backgroundColor: colors.red,
      padding: 10,
      borderRadius: 10,
      marginTop: 15,
    
    },
    
    addButtonText: {
      color: colors.white,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    

    itemContainerPL: {
      backgroundColor: colors.white,
      borderRadius: 15,
      padding: 15,
      marginVertical: 10,
      marginHorizontal: 5,
      justifyContent: 'space-between',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
      borderBottomWidth: 3.5,
      borderColor: colors.red,

    },
    itemContentPL: {
      flexDirection: 'column',
    },
    itemHeaderPL: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    headerTextPL: {
      fontSize: 12,
      color: colors.black,
    },
    headerTextPL2: {
      fontSize: 12,
      color: colors.black,
    },
    itemTitlePL: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.black,
    },
    itemStokPL: {
      marginBottom: 10,
      
    },
    itemSubTitlePL: {
      fontSize: 12,
      color: colors.black,
      textAlign: 'center',
      opacity: 0.6
    },
    itemContainerDetailPL: {
      flexDirection: 'row', // Yan yana hizala
      justifyContent: 'space-between', // Soldaki ve sağdaki View'leri hizala
    },
    leftDetails: {
      flex: 1, // Sol taraftaki alan
      marginRight: 10, // Sağdaki View ile boşluk bırak
    },
    rightDetails: {
      flex: 1, // Sağ taraftaki alan
    },
    itemTextPL: {
      fontSize: 10,
      color: colors.black,
      opacity: 0.6
    },

  /* Fatura Ürün List */


  /* Fatura Önizleme */
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    stokContainer: {
      marginBottom: 5,
    },
    columnContainer: {
      flexDirection: 'column',
      flex: 1,
    },
    productName: {
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
    },
    productTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
    },
    productDetail: {
      fontSize: 14,
      flex: 1,
    },
    productContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.textinputgray,
    borderRadius: 8,
    backgroundColor: colors.white,
    },
    productTitle: {
      fontSize: 11,
    },
    productName: {
      fontSize: 11,
      fontWeight: 'bold',
    },
    productDetail: {
      fontSize: 11,
      color: colors.black,
    },
    containerstf: { 
      margin: 5,
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2, 
      backgroundColor: colors.white, 
    },
    
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
      borderBottomWidth: 1,
      borderBottomColor: colors.islembuttongray,
      backgroundColor: colors.buttongray,
    },
    
    totalsContainer: {
      padding: 5,
      backgroundColor: colors.white,
      borderRadius: 5,
    },
    
    headerText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.black,
    },
    
    totalText: {
      fontSize: 11,
      textAlign: 'left',
    },
    
    amountText: {
      color: colors.black, 
      textAlign: 'right', 
      fontSize: 11,
    },
    
    amountTextYekun: {
      fontWeight: 'bold', 
      color: colors.black, 
      textAlign: 'right', 
      fontSize: 12,
    },
    
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      paddingVertical: 2, 
    },
    rowContainerOnizleme: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      paddingVertical: 0.5, 
    },
    
   
    totalTextYekun: {
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    totalText2: {
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'left',
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.primary,
    },
    faturaBilgileriContainer: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    faturaBilgileriLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#333',
      marginVertical: 5,
    },
    faturaBilgileriValue: {
      fontSize: 12,
      color: '#555',
      marginBottom: 10,
    },
    
    modalContainer: {
      flex: 1,
      backgroundColor: colors.white,
      position: 'relative',
      paddingTop: 10,
      paddingHorizontal: 15,
    },
    modalContainerProduct: {
      flex: 1,
      backgroundColor: colors.white,
      position: 'relative',
      paddingTop: 10,
      paddingHorizontal: 15,
    },
    modalContainerProductName: {
      marginBottom: 10,
    },
    modalContainerDetail: {
      flex: 1,
      backgroundColor: colors.white,
    },
    modalContainerUrunDetay: {
      width: '100%',
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: 10,
      position: 'relative',
      marginTop: 20,
      paddingHorizontal: 15,
    },
    modalProductContainer: {
      width: '50%',
      height: '50%',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      padding: 15,
    },
    modalSatisFaturasiOnizlemeContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContainerAciklama: {
      flex: 1,
      backgroundColor: colors.white,
    },
   
    modalContentUrunDetay: {
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: colors.white,
    },
    modalProductContent: {
      width: '100%',
      backgroundColor: colors.white,
      padding: 10,
    },
    modalItem: {
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: 10,
      borderRadius: 5,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
      marginHorizontal: 15,
      marginBottom: 10,
      marginTop: 2,
      borderLeftWidth: 3.5,
      borderColor: colors.red,

    },
    modalItemMusteriCeki: {
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: 10,
      borderRadius: 5,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
      marginBottom: 10,
      marginTop: 2,
      borderLeftWidth: 3.5,
      borderColor: colors.red,

    },

    modalItemText: {
      fontSize: 10,
    },
    modalItemTextDetay: {
      fontSize: 10,
      opacity: 0.6

    },
    modalItemText2: {
      fontSize: 10,
    },
    modalSubItemText: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    saveContainer:{
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10, // Üstte görünsün
    },
  
    saveContainerButton:{
      flexDirection: 'row',
      justifyContent: 'center',
    },
    saveButton:{
      marginTop: 10,
      flex: 1,
      height: 40,
      backgroundColor: colors.red,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: colors.white,
      paddingHorizontal: 15,
      justifyContent: 'center',
    },
    saveButtonText: {
      color:  colors.white, // Buton metninin rengini belirleyin
      textAlign: 'center',
      fontWeight: 'bold',
    },
    saveButtonTextAciklama: {
      color:  colors.black, // Buton metninin rengini belirleyin
      textAlign: 'center',
      fontWeight: 'bold',
    },
    saveIcon:{
      marginRight: 10,
    },
    aciklamaContainer:{
      marginTop: 10,
      height: 35,
      borderRadius: 10,
      backgroundColor: '#f7f7f7',
      paddingHorizontal: 15,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.textInputBg
    },
    vadeContainer: {
      marginTop: 10,
      padding: 5,
      backgroundColor: colors.red,
      borderRadius: 10,
    },
    vadeText: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.white
    },
  /* Fatura Önizleme */

  /* Cari Listesi Sayfası */
    cariListesiContainer:{
      flex: 1,
      backgroundColor: '#ffffff',
      paddingHorizontal: 15,
    },
    searchCariContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputCariAra: {
      width: "100%",
      borderRadius: 10,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textInputBg,
      fontSize: 13,
      color: colors.black,
      height: 40,
    },
    itemTextCariList: {
      fontSize :11,
      color: colors.white
    },
    itemContainerCariList: {
      flex: 1,
      flexDirection: 'row', // Yan yana öğeler
      alignItems: 'center', // Dikey hizalama
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderColor: colors.textInputBg,
    },
    detailContainer: {
      backgroundColor: colors.red,
      justifyContent: 'center', // Dikey ortalama
      padding: 5,
      marginBottom: 5,
      marginLeft: 'auto', // Sağ tarafa itmek için
      height: '100%', // Yüksekliği tam kaplaması için
    },
    cariListesiPageTop:{
      marginTop: 10,
    },
    
  /* Cari Listesi Sayfası */
 

  /* Product Modal Sayfası */
     productModalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputIskontoGroup: {
      flexDirection: 'column',
      width: "32%", 
    },
    inputBirimGroup: {
      flexDirection: 'column',
      width: "48%", 
    },
    inputProductModalBirimGroup: {
      flexDirection: 'column',
      width: "100%", 
    },
    productModalText: {
      marginBottom: 4, 
      color: colors.black,
      fontSize: 13,
    },
    productModalPickerContainer: {
      borderRadius: 10,
      backgroundColor: colors.textinputgray,
      height: 40, 
      justifyContent: 'center',
      borderColor: colors.textInputBg,
      borderWidth: 1,
    },
    productModalPicker: {
      width: '100%', 
      fontSize: 13,
    },
    productModalMiktarInput: {
      width: '100%', 
      borderRadius: 10,
      backgroundColor: colors.textinputgray,
      marginBottom: 12,
      paddingHorizontal: 8,
      color: colors.black,
      fontSize: 12,
      height: 40,
      borderColor: colors.textInputBg,
      borderWidth: 1,
    },
    productDepolarArasiModalMiktarInput: {
      width: '100%', 
      borderRadius: 10,
      backgroundColor: colors.textInputBg,
      marginBottom: 12,
      paddingHorizontal: 8,
      color: colors.black,
      fontSize: 12,
      height: 40,
    },
    inputDepolarArasiModalFiyat: {
      fontSize: 12,
      color: colors.black,
      paddingVertical: 10,
    },
    productModalIskontoInput: {
      width: '90%', 
      borderRadius: 10,
      backgroundColor: colors.textinputgray,
      marginBottom: 10,
      paddingHorizontal: 8,
      color: colors.black,
      fontSize: 12,
      borderColor: colors.textInputBg,
      borderWidth: 1,
      height: 40,
    },
    productModalStokKoduInput: {
      borderColor: colors.gray,
        marginBottom: 10,
        paddingVertical: 17,
        borderWidth: 1,
        padding: 5,
        backgroundColor: colors.white,
    },
    modalStokKodu: {
      borderColor: colors.gray,
      fontSize: 12,
      textAlign: 'left',
      fontWeight: 'bold'
    },
    modalStokAd: {
      borderColor: colors.gray,
      fontSize: 12,
      textAlign: 'left',
    },
    modalBorder: {
      borderBottomWidth: 1,
      borderColor: colors.textinputgray,
      marginTop: 10,
      marginBottom: 10,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputGroup: {
      width: "48%", 
    },
    inputtip: {
      fontSize: 11,
      marginBottom: 2,
    },
    inputGroupTutar: {
      width: "100%", 
    },
    modalInfoContainer:{
      flexDirection: 'row',
      marginBottom: 10,
    },
    modalInfoDoviz:{
      width: "50%",
      padding: 5,
    },
    modalInfoKdv:{
      width: "50%",
      padding: 5,
    },
    border: {
      width: 1,  
      height: '100%',  
      backgroundColor: colors.textinputgray,  
    },
    
  /* Product Modal Sayfası */

     

     cariButtonText: {
      textAlign: 'center',
      color:  colors.black,
      fontSize: 13,
    },
     musteriCekiBanka: {
      backgroundColor: colors.textinputgray, 
      padding: 10, 
      borderRadius: 10, 
      marginBottom: 10,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
    },


     modalContainer2: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    tableHeaderText:{
      fontWeight :'bold',
      color: colors.black,
    },

    cameraWrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    camera: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayMask: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    },
    overlayBox: {
      position: 'absolute',
      borderColor: 'white',
      borderWidth: 2,
      width: '80%',
      height: '30%',
      borderRadius: 10,
      justifyContent: 'center',
    },
    overlayLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      borderBottomWidth: 2,
      borderBottomColor: 'blue',
      zIndex: 1,
    },
    barcodeTitle: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: "#000000",
      marginBottom: 20,
      marginTop: 20,
      fontSize: 20,
    },
    kapat:{
      width: '100%',
      height: 50,
      justifyContent: 'center',
      backgroundColor: colors.red,
      textAlign: 'center',
      alignItems: 'center',
      padding: 10,
    },
    kapatTitle:{
     color: '#FFFFFF',
     fontSize: 20,
    },

    searchContainer: {
      flexDirection: 'row',
    marginBottom: 10,
    },
    searchButtonText: {
      color: colors.white,
      textAlign: 'center',
      fontSize: 16,
    },

    
    
   
    tableHeaderContainer: {
      backgroundColor: '#f1f1f1',
      borderBottomWidth: 2,
      borderColor: '#ddd',
    },
    tableHeaderText: {
      fontWeight: 'bold',
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
    },
    withBorder: {
      borderRightWidth: 1,
      borderColor: '#ddd',
      padding: 10,
    },
    tableRow: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 30,
    },
    evenRow: {
      backgroundColor: '#f9f9f9', // Çift satırlara açık gri renk
    },
    oddRow: {
      backgroundColor: '#fff', // Tek satırlara beyaz
    },
    onizlemeButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.red,
      borderRadius: 5,
    },
    addButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    inputStyleAlinanSiparis:{
      borderRadius: 5,
      marginRight: 5,
      textAlign: 'left',
      backgroundColor: colors.textinputgray,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      justifyContent: 'center',
      height: 40,
      marginBottom: 10
    },
    inputVadeTahsilatTediye: {
      flex: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 40,
    },
    inputMusteriCeki: {
      flex: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.white,
      fontSize: 12,
      color: colors.black,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 40,
    },
    inputMusteriCekiTextInput: {
      flex: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      marginRight: 5,
      backgroundColor: colors.textinputgray,
      fontSize: 12,
      color: colors.black,
      borderWidth: 1,
      borderColor: colors.textInputBg,
      height: 40,
    },
    modalContainerPicker: {
     flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContentPicker: {
      backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20
    },


    tableHeader: {
      backgroundColor: '#f3f3f3', // Başlık arka plan rengi
      height: 15
    },
    tableCell: {
      borderWidth: 1, // Hücreler arasına dikey çizgi ekler
      borderColor: '#e0e0e0', // Hücre dikey çizgi rengi
      justifyContent: 'center', // Hücrelerin içeriğini ortalamak
      paddingHorizontal: 5,
    },
    colTitle:{
      fontSize: 9,
    },
    colText:{
      fontSize: 9,
    },
}