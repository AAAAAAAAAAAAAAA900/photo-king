import { StyleSheet, View } from 'react-native';
import styles, { colors } from '../styles/ComponentStyles.js';
import Pfp from './Pfp.js';

// Wrapper for generic header buttons like logout and settings if we add it
export default function TitleButtons({navigation, user}){
    return(
        <View style={buttonsStyles.container}>
            { user &&
                <Pfp url={user.profileUrl} navigation={navigation}/>
            }
        </View>
    );
}

const buttonsStyles = StyleSheet.create({
    container:{ 
        flexDirection:"row", 
        justifyContent: "flex-end", 
        alignItems:'center', 
        padding:10 
    },
});
                