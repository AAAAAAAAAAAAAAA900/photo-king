import { View, TouchableOpacity, Image } from 'react-native';
import DefaultText from './DefaultText';
import { colors } from "../styles/ComponentStyles";


export default function NavBar({navigation, user, screen}){

    const iconStyle = {height:'90%', 
        width:'90%', 
        resizeMode:'contain' 
    };
    const iconViewStyle = {height:50, 
        width:'30%', 
        backgroundColor: 
        colors.primary, 
        alignItems:'center', 
        justifyContent:'center', 
        borderRadius:5
    };
    const separator = {
        width: 1,
        backgroundColor: 'black',
        marginVertical:0,
    };


    return(
        <View style={{flexDirection:"row", justifyContent: "space-between", backgroundColor:colors.primary, padding: 10 }}>
            { screen != 'Profile' ? (
                <TouchableOpacity
                    style={iconViewStyle}
                    onPressOut={() => {navigation.replace("Profile", {user: user})}}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/profile.png')}/>
                </TouchableOpacity>
            ) : (
                <View
                    style={[iconViewStyle, {backgroundColor: colors.secondary}]}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/profile.png')}/>
                </View>
            )}

            <View style={separator} />

            { screen != 'Home' ? (
                <TouchableOpacity
                    style={iconViewStyle}
                    onPressOut={() => {navigation.replace("Home", {user: user})}}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/home.png')}/>
                </TouchableOpacity>
            ) : (
                <View
                    style={[iconViewStyle, {backgroundColor: colors.secondary}]}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/home.png')}/>
                </View>
            )}

            <View style={separator} />

            { screen != 'Friends' ? (
                <TouchableOpacity
                    style={iconViewStyle}
                    onPressOut={() => {navigation.replace("Friends", {user: user})}}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/friends.png')}/>
                </TouchableOpacity>
            ) : (
                <View
                    style={[iconViewStyle, {backgroundColor: colors.secondary}]}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/friends.png')}/>
                </View>
            )}
        </View>
    );
}