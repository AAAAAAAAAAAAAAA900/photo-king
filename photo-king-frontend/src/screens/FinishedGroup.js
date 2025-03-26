import { SafeAreaView, View } from "react-native";
import { colors } from "../styles/ComponentStyles";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";

export default function FinishedGroupScreen({navigation}){
    const route = useRoute();
    const [group, setGroup] = useState(route.params?.group);


    return(
        <SafeAreaView style={{flex:1, backgroundColor:colors.secondary}}>
            <Header title={group.name}/>
            <View style={{flex:1, backgroundColor:'white'}}>

            </View>
        </SafeAreaView>
    );
}