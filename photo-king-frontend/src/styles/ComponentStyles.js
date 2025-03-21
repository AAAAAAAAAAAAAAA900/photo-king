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
        textDecorationLine: 'underline'
    },
    textIn: {
        height: 40, 
        width: 300,
        padding:5,
        color:'black',
        borderColor: 'black', 
        borderRadius:5,
        backgroundColor:colors.greyWhite,
        borderWidth: 1,
        fontFamily: 'DMSans-Regular', 
        fontSize: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    containerCenterAll: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // alignSelf:'center'
    },
    inputContainer: {
        alignSelf: 'baseline',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        rowGap:10,
        alignItems: 'center',
    },
    button: {
        height:40, 
        width:90, 
        backgroundColor: colors.secondary,
        borderWidth:1,
        borderRadius:5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        padding: 20, 
        margin: 10,
        backgroundColor: colors.greyWhite, 
        borderRadius: 10,
        alignItems:'center',
        flexDirection:'row',
        gap:10
    },
    separator:{
        height: 1,
        backgroundColor: colors.grey,
        marginHorizontal: 30,
    },
    popupView: {
        justifyContent: 'center',
        alignItems: 'center',
        width:'75%',
        height: 300,
        backgroundColor: colors.greyWhite
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
    iconStyle : {height:'90%', 
        width:'90%', 
        resizeMode:'contain' 
    },
});

