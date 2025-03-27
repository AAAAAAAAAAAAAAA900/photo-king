import { StyleSheet } from 'react-native';

export const colors = {
    // primary: '#99b898', //vomit
    primary: '#94FEEC',
    secondary: '#E41366',
    tertiary: '#342E37',
    greyWhite: '#f5f5f5',
    lightBlue: '#73c2fb',
    grey: '#dddddd'
};

export default styles = StyleSheet.create({
    baseText: {
        fontFamily: 'DMSans-Regular',
        fontSize:16
    },
    bold:{
        fontFamily: 'DMSans-Bold',
    },
    titleText:{
        fontFamily: 'DMSans-Bold',
        fontSize: 25
    },
    urlText:{
        fontFamily: 'DMSans-Bold',
        fontSize: 16,
        color: colors.secondary,
        textDecorationLine: 'underline'
    },
    textIn: {
        height: 40, 
        width: 250,
        padding:5,
        color:'black',
        borderColor: 'black', 
        borderRadius:5,
        backgroundColor:colors.greyWhite,
        fontFamily: 'DMSans-Regular', 
        fontSize: 16,
    },
    container: {
        flex: 1,
    },
    safeAreaContainer: {    // matches color of header
        flex:1, 
        backgroundColor:colors.secondary
    },
    containerCenterAll: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height:40, 
        width:90, 
        backgroundColor: colors.secondary,
        borderRadius:10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color:'white',
        textAlign:'center',
        fontFamily: 'DMSans-Bold',
    },
    listItem: {
        padding: 20, 
        margin: 10,
        marginVertical:5,
        backgroundColor:'white',
        borderColor: colors.greyWhite, 
        borderWidth: 1,
        borderRadius: 10,
        alignItems:'center',
        flexDirection:'row',
        gap:10
    },
    popupView: {
        justifyContent: 'center',
        alignItems: 'center',
        width:'75%',
        height: 300,
        backgroundColor: 'white'
    },
    modalBackground:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    redModalBanner:{ 
        width: '75%', 
        height: 30, 
        backgroundColor: colors.secondary 

    },
    blueModalBanner:{
        width: '75%', 
        height: 10, 
        backgroundColor: colors.primary
    },
    picHolder: {
        flex:1,
        maxWidth: "49%",
        aspectRatio:1,
        alignItems:'center',
        margin: 5
    },
    pic: { 
        flex:1, 
        height:'100%', 
        width:'100%', 
        resizeMode:'cover',
        borderRadius:20,
        backgroundColor:'white'
    },
    iconStyle : {
        height:'90%', 
        width:'90%', 
        resizeMode:'contain' 
    },
});

