import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import DefaultText from "./DefaultText";
import styles, { colors } from "../styles/ComponentStyles";


export default function Header({ title, backFunction, buttons, border, height=100}){
    return(
        <View style={[
            border ? headerStyles.border : {}, 
            headerStyles.headerContainer,
            {height: height}
            ]}>
            <View style={headerStyles.headerLeft}>
                {backFunction &&
                    <TouchableOpacity style={headerStyles.backButton} onPress={backFunction}>
                        <Image style={styles.iconStyle} source={require('../../assets/icons/back.png')}/>
                    </TouchableOpacity>
                }
            </View>
            <View style={headerStyles.headerCenter}>
                { title && <DefaultText numberOfLines={1} style={headerStyles.titleText}>{title}</DefaultText> }
            </View>
            <View style={headerStyles.headerRight}>
                {buttons}
            </View>
        </View>
    );
}

const headerStyles = StyleSheet.create({
    border:{
        borderBottomWidth:10, 
        borderColor: colors.primary,
    },
    headerContainer:{
        width:'100%', 
        alignItems:'center', 
        justifyContent:'center', 
        flexDirection:'row', 
        paddingTop: 30, 
        padding:10,  
        backgroundColor: colors.secondary
    },
    headerLeft:{
        flex:1, 
        flexDirection:"row", 
        alignItems:'center', 
        justifyContent:'flex-start'
    },
    backButton:{
        height:'100%', 
        width:70
    },
    headerCenter:{
        flex:2, 
        alignItems:'center', 
        justifyContent:'center'
    },
    titleText:[
        styles.titleText, 
        {
            color:'white'
        }
    ],
    headerRight:{
        flex:1, 
        flexDirection:"row", 
        alignItems:'center', 
        justifyContent:'flex-end'
    }

});