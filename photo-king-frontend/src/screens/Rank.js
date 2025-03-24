import { useRoute } from "@react-navigation/native";
import { Image, SafeAreaView, TouchableOpacity, View, FlatList, Alert, ImageBackground } from "react-native";
import DefaultText from "../components/DefaultText";
import styles, { colors } from '../styles/ComponentStyles.js';
import { CommonActions } from "@react-navigation/native";
import { loadPictures } from "./Group.js";
import {useEffect, useState, useCallback} from "react";
import photoGroupApi from "../api/photoGroupApi";
import Header from "../components/Header.js";

export default function RankScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const [group, setGroup] = useState(route.params?.group);
    const [pictures, setPictures] = useState([]);
    const [isSubmitted, setSubmitted] = useState(false);
    const [ranks, setRanks] =  useState([]);  // image ids ordered by ranking
    
    // get group pictures on load
    useEffect(() => {
        loadPictures(setPictures, group).then(r => {});
    }, []);

    // Determine number of ranking slots
    useEffect(()=>{
        setRanks(pictures.length == 2 ? [null,null] : [null,null,null]);
    }, [pictures]);

    const rankPhoto = (photo, rank, ranks) =>{
        if(rank != -1){
            // If already ranked, undo rank
            const copy = [...ranks];
            copy[rank] = null;
            setRanks(copy);
        } else if (ranks.findIndex((element)=> element===null) != -1){
            // If there are available rankings, find them
            const copy = [...ranks];
            copy[ranks.findIndex((element)=> element===null)] = photo.id;
            setRanks(copy);
        }
    };

    // FlatList element's view
    const RankablePic = useCallback(({ photo, imageRank, ranks}) => {
        return (
            <TouchableOpacity 
            onPress={()=>{rankPhoto(photo, imageRank, ranks);}}
            style={styles.picHolder}>
                <Image
                    style={styles.pic}
                    source={{uri: photo.url}}
                    // defaultSource= default image to display while loading images.
                />
                { imageRank != -1 &&
                    <View style={{width:30, height:30, borderRadius:15, position:'absolute', top:10, left:10, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                        <DefaultText>{imageRank+1}</DefaultText>
                    </View>
                }
            </TouchableOpacity>
        );
    }, []);

    useEffect(()=>{
        if(isSubmitted){
            navigation.dispatch((state) => {
                const routes = state.routes.slice(0, -2); // Pop 2 screens from stack
                return CommonActions.reset({
                    ...state,
                    index: routes.length - 1,
                    routes
                });
            });
            navigation.navigate('Group', {user:user, group:group});
        } 
    }, [isSubmitted]);

    const submitRanks = async () => {
        try{
            const data = {
                userId: user.id,
                groupId: group.id,
                images: ranks.filter((element) => element !== null)
            };

            const updateRankResponse = await photoGroupApi.updateUserRank(data);
            setSubmitted(true);
        } catch(error){
            console.log(error);
        }
    };

    const submitRanksPressed = () => {
        if(ranks.findIndex((element)=> element===null) != -1){
            Alert.alert(
                `Please rank ${ranks.length} images.`,
                'Make sure no placings remain at the top.',
                [
                    { text: "Confirm", style: "cancel"}
                ]
            );
        } else{
            submitRanks();
        }
    };

    return(
        <SafeAreaView style={{flex:1, backgroundColor:colors.secondary}}>
            <Header 
                backFunction={()=> {
                    navigation.dispatch((state) => {
                        const routes = state.routes.slice(0, -2); // Pop 2 screens from stack
                        return CommonActions.reset({
                            ...state,
                            index: routes.length - 1,
                            routes
                        });
                    });
                    navigation.navigate('Group', {user:user, group:group});
                }} 
                title={group.name} 
            />

            <View style={{padding:10, borderBottomWidth:.5, height:50, backgroundColor:'white', flexDirection:'row', alignItems:'center'}}>
                <View style={{flex:1, gap:5, flexDirection:'row'}}>
                    {!ranks[0] &&
                        <View style={{width:30, height:30, borderRadius:15, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                            <DefaultText>1</DefaultText>
                        </View>
                    }
                    {!ranks[1] &&
                        <View style={{width:30, height:30, borderRadius:15, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                            <DefaultText>2</DefaultText>
                        </View>
                    }
                    {ranks.length > 2 && !ranks[2] &&
                        <View style={{width:30, height:30, borderRadius:15, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                            <DefaultText>3</DefaultText>
                        </View>
                    }
                </View>
                <View style={{flex:1, flexDirection:'row-reverse'}}>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{submitRanksPressed();}}
                    >
                        <DefaultText style={styles.buttonText}>Submit</DefaultText>
                    </TouchableOpacity>
                </View>
            </View>

            <ImageBackground resizeMode='stretch' source={require('../../assets/backgrounds/ImageListBackground.png')} style={{flex:1, backgroundColor:'white'}}>
                <View style={{flex:1, paddingHorizontal:5}}>
                    <FlatList 
                        numColumns={2}
                        renderItem={({ item }) => <RankablePic ranks={ranks} photo={item} imageRank={ranks.findIndex((element) => element==item.id)}/>}
                        keyExtractor={(picture) => picture.url}
                        data={[...pictures].sort((a,b)=> b.points-a.points)}
                    />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}