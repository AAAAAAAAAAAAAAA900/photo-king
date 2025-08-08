import { ActivityIndicator, BackHandler, FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import Header from "../components/Header";
import { CommonActions, useRoute } from "@react-navigation/native";
import Pfp from "../components/Pfp";
import DefaultText from "../components/DefaultText";
import { loadPictures, picStyles } from "./Group";
import { useCallback, useEffect, useState } from "react";
import photoGroupApi from "../api/photoGroupApi";

export default function SummaryScreen({ navigation }) {
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placings, setPlacings] = useState([]);

    const getSummary = async () => {
        try {
            const response = await photoGroupApi.getGroupSummary(group.id);
            const images = response.data.userImages.sort((a, b) => b.points - a.points);
            setPictures(images);
            if (images.length) {
                if (images[0].points != 0) {
                    const podium = [];
                    for (let i = 0; i < 3 && i < images.length; ++i) {
                        podium.push(group.users.find((member) => member.id === images[i].userId));
                    }
                    setPlacings(podium);
                }
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

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

    // useEffect to get group pictures on load
    useEffect(() => {
        // Create Android back action handler
        const backAction = () => {
            navigateBack();
            return true;
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Load summary
        getSummary();

        // Remove handler
        return () => backHandler.remove();
    }, []);

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
                onPress={() => navigation.navigate("Photo", { user: user, group: group, photo: photo, from: "Summary" })}
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

            {loading ?
                <View style={styles.containerCenterAll}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
                :

                <View style={styles.container}>

                    {/* USER PODIUM */}
                    {placings.length ?
                        <View style={summaryStyles.podiumContainer}>

                            {/* SILVER */}
                            {placings[1] &&
                                < View style={summaryStyles.podiumPlace}>
                                    <DefaultText numberOfLines={3} style={summaryStyles.username}>{placings[1].username}</DefaultText>
                                    <Pfp url={placings[1].pfp} />
                                    <View style={summaryStyles.silver} />
                                </View>
                            }

                            {/* GOLD */}
                            {placings[0] &&
                                <View style={summaryStyles.podiumPlace}>
                                    <DefaultText numberOfLines={2} style={summaryStyles.username}>{placings[0].username}</DefaultText>
                                    <Pfp url={placings[0].pfp} />
                                    <View style={summaryStyles.gold} />
                                </View>
                            }

                            {/* BRONZE */}
                            {placings[2] &&
                                <View style={summaryStyles.podiumPlace}>
                                    <DefaultText numberOfLines={4} style={summaryStyles.username}>{placings[2].username}</DefaultText>
                                    <Pfp url={placings[2].pfp} />
                                    <View style={summaryStyles.bronze} />
                                </View>
                            }
                        </View>
                        :
                        <View style={summaryStyles.messageContainer}>
                            <DefaultText style={styles.titleText}>LAST WEEKS PHOTOS:</DefaultText>
                        </View>
                    }

                    {/* IMAGES */}
                    <View style={summaryStyles.picturesContainer}>
                        <FlatList
                            keyExtractor={(item) => item.id}
                            numColumns={1}
                            renderItem={({ item }) => <Pic photo={item} pictures={pictures} />}
                            data={pictures}
                            ItemSeparatorComponent={<View style={summaryStyles.separator} />}
                        />
                    </View>
                </View>
            }
        </SafeAreaView >
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
        gap: 20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
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
    picHolder: [
        styles.picHolder,
        {
            maxWidth: '100%',
            margin: 0,

        }
    ],
    picturesContainer: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 5
    },
    separator: {
        height: 20
    },
    messageContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'white',
        width: '100%',
        height: 70,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 3,
        borderColor: colors.greyWhite
    },
});