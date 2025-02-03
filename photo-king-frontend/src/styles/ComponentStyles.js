import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#342E37',
    secondary: '#99b898',
    tertiary: '#f5f5f5'
};
export const fonts = {
    primary: 'Verdana'
};

export default styles = StyleSheet.create({
    textIn: {
        height: 60, 
        width: 300,
        borderColor: colors.secondary, 
        borderWidth: 1, 
        fontSize:25,
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
    },
    button: {
        height:40, 
        width:90, 
        backgroundColor: 'dodgerblue',
        alignItems: 'center',
        justifyContent: 'center',
    }
});