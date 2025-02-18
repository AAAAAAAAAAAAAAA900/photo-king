import { useRoute } from "@react-navigation/native";
import { Image, SafeAreaView, TouchableOpacity, View, FlatList } from "react-native";
import DefaultText from "../components/DefaultText";
import styles, { colors } from '../styles/ComponentStyles.js';
import { loadPictures } from "./Group.js";
import { useEffect, useState } from "react";

export default function RankScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);
    const [ranks, setRanks] = useState({});  //tracks image rankings by url

    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures(setPictures, group).then(r => {});
    }, []);

    const rankPhoto = (url) =>{
        if(ranks[url] != undefined){
            // If already ranked, undo rank
            const {[url]:_, ...copy} = ranks;
            setRanks(copy);
        } else if (Object.keys(ranks).length < 3 ){
            // If there are available rankings, find them
            const openings = [true, true, true];
            for(const url in ranks){
                openings[ranks[url]] = false;
            }
            // Take the lowest available ranking
            for(let i = 0; i < 3; ++i){
                if(openings[i]){
                    const copy = {...ranks, [url]:i};
                    setRanks(copy);
                    break;
                }
            }
        }
    };

    // FlatList element's view
    const RankablePic = ({ photo }) => {
        const imageRank = ranks[photo.url] ?? null;
        return (
            <TouchableOpacity 
            onPress={()=>{rankPhoto(photo.url);}}
            style={styles.picHolder}>
                <Image
                    style={styles.pic}
                    source={{uri: photo.url}}
                    // defaultSource= default image to display while loading images.
                />
                { imageRank !== null &&
                    <View style={{width:30, height:30, borderRadius:15, position:'absolute', top:5, left:5, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                        <DefaultText>{imageRank+1}</DefaultText>
                    </View>
                }
            </TouchableOpacity>
        );
    };

    return(
        <SafeAreaView style={{flex:1}}>
            <View style={{padding:10, height:50, backgroundColor:colors.secondary, flexDirection:'row', alignItems:'center'}}>
                {!Object.values(ranks).includes(0) &&
                    <View style={{width:30, height:30, borderRadius:15, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                        <DefaultText>1</DefaultText>
                    </View>
                }
                {!Object.values(ranks).includes(1) &&
                    <View style={{width:30, height:30, borderRadius:15, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                        <DefaultText>2</DefaultText>
                    </View>
                }
                {!Object.values(ranks).includes(2) &&
                    <View style={{width:30, height:30, borderRadius:15, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                        <DefaultText>3</DefaultText>
                    </View>
                }
            </View>
            <View style={{flex:1}}>
                <FlatList 
                    numColumns={3}
                    renderItem={({ item }) => <RankablePic photo={item}/>}
                    keyExtractor={(picture) => picture.url}
                    data={pictures}
                />
            </View>
        </SafeAreaView>
    );
}