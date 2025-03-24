import { Image, Platform, TouchableOpacity, View } from "react-native";
import DefaultText from "./DefaultText";
import styles, { colors } from "../styles/ComponentStyles";


export default function Header({ title, backFunction, buttons, border, height=100}){
    return(
        <View style={[
            border ? {
                borderBottomWidth:10, 
                borderColor: colors.primary,
            } : {}, {
            height: height,
            width:'100%', 
            alignItems:'center', 
            justifyContent:'center', 
            flexDirection:'row', 
            paddingTop: 30, 
            padding:10,  
            backgroundColor: colors.secondary}
            ]}>
            <View style={{flex:1, flexDirection:"row", alignItems:'center', justifyContent:'flex-start'}}>
                {backFunction &&
                    <TouchableOpacity style={{height:'100%', width:70}} onPress={backFunction}>
                        <Image style={styles.iconStyle} source={require('../../assets/icons/back.png')}/>
                    </TouchableOpacity>
                }
            </View>
            <View style={{flex:2, alignItems:'center', justifyContent:'center'}}>
                { title && <DefaultText numberOfLines={1} style={[styles.titleText, {color:'white'}]}>{title}</DefaultText> }
            </View>
            <View style={{flex:1, flexDirection:"row", alignItems:'center', justifyContent:'flex-end'}}>
                {buttons}
            </View>
        </View>
    );
}