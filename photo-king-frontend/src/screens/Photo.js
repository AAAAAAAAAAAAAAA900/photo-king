import { useRoute } from "@react-navigation/native";
import { Image, SafeAreaView } from "react-native";



export default function PhotoScreen ({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const photo = route.params?.photo;

    console.log(user);
    console.log(group);
    console.log(photo);

    return(
        <SafeAreaView style={{flex:1}}>
            <Image 
            source={{uri: photo.uri}}
            style={{flex:1, maxHeight:'60%', maxWidth:'100%'}}
            />
        </SafeAreaView>
    );
}