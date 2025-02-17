import { useRoute } from "@react-navigation/native";
import { FlatList, Image, SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import DefaultText from "../components/DefaultText";



export default function PhotoScreen ({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const photo = route.params?.photo;

    return(
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, maxHeight:'60%', maxWidth:'100%', backgroundColor:colors.grey }}>
                <Image 
                source={{uri: photo.uri}}
                style={{height:'100%', width:'100%', resizeMode:'contain'}}
                />
            </View>
            <View borderWidth={1} style={{padding: 20, flexDirection:'row', backgroundColor:colors.primary}}>
                <TouchableOpacity
                onPress={()=>{}}
                style={[styles.button, {backgroundColor: colors.secondary}]}
                >
                    <DefaultText>Like</DefaultText>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{}}
                style={[styles.button, {backgroundColor: colors.secondary}]}
                >
                    <DefaultText>Download</DefaultText>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <FlatList/>
                <TextInput
                style={[styles.textIn, {margin:20}]}
                onChangeText={()=>{}}
                placeholder="Enter Comment..."
                />
            </View>
        </SafeAreaView>
    );
}