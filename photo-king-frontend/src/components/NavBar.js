import { View, TouchableOpacity } from 'react-native';
import DefaultText from './DefaultText';
import { colors } from "../styles/ComponentStyles";


export default function NavBar({navigation, user, screen}){
    return(
        <View style={{flexDirection:"row", justifyContent: "space-between", backgroundColor:colors.primary, padding: 10 }}>
            { screen != 'Profile' ? (
                <TouchableOpacity
                    style={styles.button}
                    onPressOut={() => {navigation.replace("Profile", {user: user})}}
                >
                    <DefaultText>Profile</DefaultText>
                </TouchableOpacity>
            ) : (
                <View
                    style={[styles.button, {backgroundColor: colors.secondary}]}
                >
                    <DefaultText>Profile</DefaultText>
                </View>
            )}

            { screen != 'Friends' ? (
                <TouchableOpacity
                    style={styles.button}
                    onPressOut={() => {navigation.replace("Friends", {user: user})}}
                >
                    <DefaultText>Friends</DefaultText>
                </TouchableOpacity>
            ) : (
                <View
                    style={[styles.button, {backgroundColor: colors.secondary}]}
                >
                    <DefaultText>Friends</DefaultText>
                </View>
            )}

            { screen != 'Home' ? (
                <TouchableOpacity
                    style={styles.button}
                    onPressOut={() => {navigation.replace("Home", {user: user})}}
                >
                    <DefaultText>Home</DefaultText>
                </TouchableOpacity>
            ) : (
                <View
                    style={[styles.button, {backgroundColor: colors.secondary}]}
                >
                    <DefaultText>Home</DefaultText>
                </View>
            )}
        </View>
    );
}