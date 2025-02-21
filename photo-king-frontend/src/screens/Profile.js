import { useRoute } from "@react-navigation/native";
import DefaultText from "../components/DefaultText";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import styles from "../styles/ComponentStyles";
import NavBar from "../components/NavBar";
import Pfp from "../components/Pfp";

export default function ProfileScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    return(
        <SafeAreaView style={{flex:1}}>
            <Pfp user={user}/>
            <View style={styles.containerCenterAll}>
                <DefaultText>Profile Screen</DefaultText>
            </View>
            <NavBar navigation={navigation} user={user} screen='Profile'/>
        </SafeAreaView>
    );
}