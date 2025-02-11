import { View, Alert, TouchableOpacity } from 'react-native';
import DefaultText from './DefaultText';
import styles, { colors } from '../styles/ComponentStyles.js';


export default function TitleButtons(){

    return(
        <View pointerEvents="auto" style={{flexDirection:"row", justifyContent: "space-between", padding:10 }}>
            <TouchableOpacity
                style={styles.button}
                onPressOut={() => {console.log("HERE");}}
            >
                <DefaultText>Profile</DefaultText>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button}
                onPressOut={() => {console.log("HERE");}}
            >
                <DefaultText>Settings</DefaultText>
            </TouchableOpacity>
        </View>
    );
}
                