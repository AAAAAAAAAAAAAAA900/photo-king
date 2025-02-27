import { TouchableOpacity, View } from "react-native";
import DefaultText from "./DefaultText";
import styles, { colors } from "../styles/ComponentStyles";


export default function Header({ title, backFunction, buttons }){
    return(
        <View style={{height: 90, width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row', paddingTop:30, padding:10, borderBottomWidth:2, borderColor:'#D3D3D3'}}>
            <View style={{flex:1, flexDirection:"row", alignItems:'center', justifyContent:'flex-start'}}>
                {backFunction &&
                    <TouchableOpacity style={styles.button} onPress={backFunction}>
                        <DefaultText>Back</DefaultText>
                    </TouchableOpacity>
                }
            </View>
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                { title && <DefaultText numberOfLines={1} style={styles.titleText}>{title}</DefaultText> }
            </View>
            <View style={{flex:1, flexDirection:"row", alignItems:'center', justifyContent:'flex-end'}}>
                {buttons}
            </View>
        </View>
    );
}