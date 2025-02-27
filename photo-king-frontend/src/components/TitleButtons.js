import { View, Alert, TouchableOpacity } from 'react-native';
import DefaultText from './DefaultText';
import styles, { colors } from '../styles/ComponentStyles.js';
import Pfp from './Pfp.js';


export default function TitleButtons({navigation, user}){

    return(
        <View style={{flexDirection:"row", justifyContent: "flex-end",alignItems:'center', padding:10 }}>
            { user &&
                <Pfp url={user.profileUrl} navigation={navigation}/>
            }
            <TouchableOpacity 
                style={styles.button}
                onPressOut={() => {navigation.navigate("Settings")}}
            >
                <DefaultText>Settings</DefaultText>
            </TouchableOpacity>
        </View>
    );
}
                