import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from "../styles/ComponentStyles";


export default function NavBar({navigation, screen}){
    return(
        <View style={navStyles.bottomBar}>
            {/* PROFILE ICON */}
            { screen != 'Profile' ? (
                <TouchableOpacity
                    style={navStyles.iconViewStyle}
                    onPressOut={() => {navigation.replace("Profile")}}
                >
                    <Image style={navStyles.iconStyle} source={require('../../assets/icons/profile.png')}/>
                </TouchableOpacity>
            ) : (
                <View
                    style={navStyles.selected}
                >
                    <Image style={navStyles.iconStyle} source={require('../../assets/icons/profile.png')}/>
                </View>
            )}

            <View style={navStyles.separator} />

            {/* HOME ICON */}
            { screen != 'Home' ? (
                <TouchableOpacity
                    style={navStyles.iconViewStyle}
                    onPressOut={() => {navigation.replace("Home")}}
                >
                    <Image style={navStyles.iconStyle} source={require('../../assets/icons/home.png')}/>
                </TouchableOpacity>
            ) : (
                <View
                    style={navStyles.selected}
                >
                    <Image style={navStyles.iconStyle} source={require('../../assets/icons/home.png')}/>
                </View>
            )}

            <View style={navStyles.separator} />

            {/* FRIENDS ICON */}
            { screen != 'Friends' ? (
                <TouchableOpacity
                    style={navStyles.iconViewStyle}
                    onPressOut={() => {navigation.replace("Friends")}}
                >
                    <Image style={navStyles.iconStyle} source={require('../../assets/icons/friends.png')}/>
                </TouchableOpacity>
            ) : (
                <View
                    style={navStyles.selected}
                >
                    <Image style={navStyles.iconStyle} source={require('../../assets/icons/friends.png')}/>
                </View>
            )}
        </View>
    );
}

const navStyles = StyleSheet.create({
    iconStyle:{
        height:'90%', 
        width:'90%', 
        resizeMode:'contain' 
    },
    iconViewStyle:{
        height:'90%', 
        width:'30%', 
        backgroundColor: 'white', 
        alignItems:'center', 
        justifyContent:'center', 
        borderRadius:5
    },
    separator:{
        width: 1,
        backgroundColor: 'black',
        marginVertical:0,
    },
    bottomBar:{
        flexDirection:"row", 
        height: 60, 
        borderTopWidth: .5, 
        borderColor:colors.greyWhite, 
        justifyContent: "space-between", 
        backgroundColor:'white', 
        padding: 10 
    },
    selected:{
        height:'90%', 
        width:'30%', 
        backgroundColor: 'white', 
        alignItems:'center', 
        justifyContent:'center', 
        borderRadius:5,
        backgroundColor: colors.greyWhite
    },
});