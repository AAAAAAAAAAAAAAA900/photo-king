import { View, TouchableOpacity, Image } from 'react-native';
import DefaultText from './DefaultText';
import { colors } from "../styles/ComponentStyles";


export default function NavBar({navigation, user, screen}){

    const iconStyle = {height:'90%', 
        width:'90%', 
        resizeMode:'contain' 
    };
    const iconViewStyle = {height:'90%', 
        width:'30%', 
        backgroundColor: 'white', 
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
        <View style={{flexDirection:"row", height: 60, borderTopWidth: .5, borderColor:colors.greyWhite, justifyContent: "space-between", backgroundColor:'white', padding: 10 }}>
            { screen != 'Profile' ? (
                <TouchableOpacity
                    style={iconViewStyle}
                    onPressOut={() => {navigation.replace("Profile", {user: user})}}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/profile.png')}/>
                </TouchableOpacity>
            ) : (
                <View
                    style={[iconViewStyle, {backgroundColor: colors.greyWhite}]}
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
                    style={[iconViewStyle, {backgroundColor: colors.greyWhite}]}
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
                    style={[iconViewStyle, {backgroundColor: colors.greyWhite}]}
                >
                    <Image style={iconStyle} source={require('../../assets/icons/friends.png')}/>
                </View>
            )}
        </View>
    );
}