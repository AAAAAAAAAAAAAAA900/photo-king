import { useRoute } from "@react-navigation/native";
import DefaultText from "../components/DefaultText";
import { SafeAreaView, View } from "react-native";
import styles from "../styles/ComponentStyles";
import NavBar from "../components/NavBar";

export default function ProfileScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    return(
        <SafeAreaView style={{flex:1}}>
            <View style={styles.containerCenterAll}>
                <DefaultText>Profile Screen</DefaultText>
            </View>
            <NavBar navigation={navigation} user={user} screen='Profile'/>
        </SafeAreaView>
    );
}