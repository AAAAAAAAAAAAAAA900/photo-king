import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#99b898',
    secondary: '#960019',
    tertiary: '#342E37',
    greyWhite: '#f5f5f5',
    lightBlue: '#73c2fb'
};

export default styles = StyleSheet.create({
    baseText: {
        fontFamily: 'DMSans-Regular',
        fontSize:16
    },
    titleText:{
        fontFamily: 'DMSans-Regular',
        fontSize: 25
    },
    urlText:{
        
    },
    textIn: {
        height: 40, 
        width: 300,
        borderColor: colors.secondary, 
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
        backgroundColor: colors.lightBlue,
        alignItems: 'center',
        justifyContent: 'center',
    }
});