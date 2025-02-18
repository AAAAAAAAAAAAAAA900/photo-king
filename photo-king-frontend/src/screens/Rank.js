import { useRoute } from "@react-navigation/native";
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import DefaultText from "../components/DefaultText";
import styles, { colors } from '../styles/ComponentStyles.js';
import { loadPictures } from "./Group.js";

export default function RankScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);
    

    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures(setPictures, group).then(r => {});
    }, []);

    // FlatList element's view
    const RankablePic = ({ photo }) => {
        return (
            <TouchableOpacity 
            onPress={()=>navigation.navigate("Photo", {user: user, group: group, photo: photo})}
            style={styles.picHolder}>
                <Image
                    style={styles.pic}
                    source={{uri: photo.url}}
                    // defaultSource= default image to display while loading images.
                />
                <DefaultText style={{position:'relative', top:5, left:5}}>1</DefaultText>
            </TouchableOpacity>
        );
    };

    return(
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1}}>
                <FlatList 
                    numColumns={3}
                    renderItem={({ item }) => <RankablePic photo={item} />}
                    keyExtractor={(picture) => picture.url}
                    data={pictures}
                />
            </View>
        </SafeAreaView>
    );
}