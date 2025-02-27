import { useRoute } from "@react-navigation/native";
import DefaultText from "../components/DefaultText";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import styles from "../styles/ComponentStyles";
import NavBar from "../components/NavBar";
import Pfp from "../components/Pfp";
import { useState, useEffect } from "react";
import TitleButtons from "../components/TitleButtons";
import Header from "../components/Header";

export default function ProfileScreen({navigation}){
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);

    return(
        <SafeAreaView style={{flex:1}}>
            <Header title={'Profile'} buttons={<TitleButtons navigation={navigation} user={user}/>}/>
            
            <Pfp user={user} setUser={setUser} url={user.profileUrl}/>
            <View style={styles.containerCenterAll}>
                <DefaultText>Profile Screen</DefaultText>
            </View>
            <NavBar navigation={navigation} user={user} screen='Profile'/>
        </SafeAreaView>
    );
}