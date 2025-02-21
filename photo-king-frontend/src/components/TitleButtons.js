import { View, Alert, TouchableOpacity } from 'react-native';
import DefaultText from './DefaultText';
import { StackActions } from '@react-navigation/native';
import styles, { colors } from '../styles/ComponentStyles.js';


export default function TitleButtons({navigation}){

    return(
        <View style={{flexDirection:"row", justifyContent: "space-between", padding:10 }}>
            <TouchableOpacity 
                style={styles.button}
                onPressOut={() => {navigation.dispatch(StackActions.popToTop());}}
            >
                <DefaultText>Logout</DefaultText>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button}
                onPressOut={() => {navigation.navigate("Settings")}}
            >
                <DefaultText>Settings</DefaultText>
            </TouchableOpacity>
        </View>
    );
}
                