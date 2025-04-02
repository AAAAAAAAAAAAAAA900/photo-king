import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import Header from "../components/Header";
import { CommonActions, useRoute } from "@react-navigation/native";
import Pfp from "../components/Pfp";
import DefaultText from "../components/DefaultText";
import { loadPictures, picStyles } from "./Group";
import { useCallback, useEffect, useState } from "react";

export default function SummaryScreen({ navigation }) {
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placings, setPlacings] = useState([]);

    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures(setPictures, group, setLoading);
    }, []);

    useEffect(()=>{
        if(pictures.length){
            setPlacings([
                group.users.find((value) => value.id == pictures[0].userId),
                group.users.find((value) => value.id == pictures[1].userId),
                group.users.find((value) => value.id == pictures[2].userId)
            ]);
        }
    }, [pictures]);

    const navigateBack = () => {
        navigation.dispatch((state) => {
            const routes = state.routes.slice(0, -2); // Pop 1 screen from stack
            return CommonActions.reset({
                ...state,
                index: routes.length - 1,
                routes
            });
        });
        navigation.navigate('Group', { user: user, group: group });
    }

    // FlatList element's view
    const Pic = useCallback(({ photo, pictures }) => {
        // Gets pfp of poster
        const pfp = group.users.find((value) => value.id == photo.userId)?.pfp;
        // Checks if picture is first, second, or third
        let winningBorder = {};
        if (photo.points != 0) {
            for (let i = 0; i < pictures.length && i < 3; ++i) {
                if (pictures[i].id == photo.id) {
                    switch (i) {
                        case 0:
                            winningBorder = picStyles.firstBorder;
                            break;
                        case 1:
                            winningBorder = picStyles.secondBorder;
                            break;
                        case 2:
                            winningBorder = picStyles.thirdBorder;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("Photo", { user: user, group: group, photo: photo })}
                style={summaryStyles.picHolder}>
                <Image
                    style={[styles.pic, winningBorder]}
                    source={{ uri: photo.url }}
                    progressiveRenderingEnabled={true}
                />
                <View style={picStyles.points}>
                    <DefaultText>{photo.points}</DefaultText>
                </View>
                <View style={picStyles.pfp}>
                    <Pfp url={pfp} />
                </View>
            </TouchableOpacity>
        );
    }, []);

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <Header
                title={"TESTING"}
                backFunction={() => { navigateBack(); }}
            />

            {/* USER PODIUM */}
            <View style={summaryStyles.podiumContainer}>

                {/* SILVER */}
                <View style={summaryStyles.podiumPlace}>
                    <DefaultText numberOfLines={3} style={summaryStyles.username}>username</DefaultText>
                    <Pfp />
                    <View style={summaryStyles.silver} />
                </View>

                {/* GOLD */}
                <View style={summaryStyles.podiumPlace}>
                    <DefaultText numberOfLines={2} style={summaryStyles.username}>username</DefaultText>
                    <Pfp />
                    <View style={summaryStyles.gold} />
                </View>

                {/* BRONZE */}
                <View style={summaryStyles.podiumPlace}>
                    <DefaultText numberOfLines={4} style={summaryStyles.username}>username</DefaultText>
                    <Pfp />
                    <View style={summaryStyles.bronze} />
                </View>

            </View>

            {/* IMAGES */}
            {loading ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <View style={summaryStyles.picturesContainer}>
                    <FlatList
                        keyExtractor={(item) => item.id}
                        numColumns={1}
                        renderItem={({ item }) => <Pic photo={item} pictures={pictures} />}
                        data={pictures}
                        ItemSeparatorComponent={<View style={summaryStyles.separator}/>}
                    />
                </View>
            }
        </SafeAreaView>
    );
}

const summaryStyles = StyleSheet.create({
    podiumContainer: {
        height: '30%',
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingHorizontal: 20,
        gap: 20
    },
    podiumPlace: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'flex-end',
        gap: 10
    },
    silver: {
        width: '100%',
        height: '33%',
        backgroundColor: 'silver',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    gold: {
        width: '100%',
        height: '45%',
        backgroundColor: 'gold',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    bronze: {
        width: '100%',
        height: '22%',
        backgroundColor: '#CD7F32',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    username: [
        styles.bold,
        {
            textAlign: 'center'
        }
    ],
    picHolder:[
        styles.picHolder,
        {
            maxWidth:'100%',
            margin:0,
            
        }
    ],
    picturesContainer:{
        flex:1,
        marginHorizontal:10,
        marginTop:5
    },
    separator:{
        height:20
    }
});