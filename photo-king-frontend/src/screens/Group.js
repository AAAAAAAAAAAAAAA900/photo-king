import { SafeAreaView, FlatList, View, Image, TouchableOpacity, Modal, Linking, Alert, ImageBackground, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import styles, { colors } from '../styles/ComponentStyles.js';
import { useEffect, useState, useCallback, useRef } from "react";
import * as ImagePicker from 'expo-image-picker';
import { CommonActions } from "@react-navigation/native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import FriendSearch from '../components/FriendSearch.js';
import { lookup } from 'react-native-mime-types';
import Pfp from '../components/Pfp.js';
import Members from '../components/Members.js';
import imageApi from "../api/imageApi";
import photoGroupApi from "../api/photoGroupApi";
import FriendModal from '../components/FriendModal.js';
import Header from '../components/Header.js';
import Timer from '../components/Timer.js';
import { getUser } from './Login.js';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function GroupScreen({ navigation }) {
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [group, setGroup] = useState(route.params?.group);
    const [pictures, setPictures] = useState([]);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [membersPopUpVisible, setMembersPopUpVisible] = useState(false);
    const [friendModalVisible, setFriendModalVisible] = useState(false);
    const [friendClicked, setFriendClicked] = useState(null);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // For positioning position:absolute elements
    const optionsButtonRef = useRef(null);
    const [optionsHeight, setOptionsHeight] = useState(0);
    const modalAdjustment = Platform.OS == 'ios' ? useSafeAreaInsets().top : 0;

    // update group when members or name changes
    useEffect(() => {
        setGroup(user.groups.find((g) => g.id == group.id));
    }, [user]);

    const { showActionSheetWithOptions } = useActionSheet();

    const onPressPhotoUpload = () => {
        const options = ['Gallery', 'Camera', 'Cancel']
        const cancelButtonIndex = 2;

        showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (selectedIndex) => {
            switch (selectedIndex) {
                case cancelButtonIndex:
                    break;
                case 0:
                    pickImage();
                    break;
                case 1:
                    takeImage();
                    break;
            }
        })
    }

    const uploadPhotos = async (images) => {
        setLoading(true);
        const formData = new FormData();

        images.assets.forEach((image) => {
            formData.append('files', {
                uri: image.uri,
                name: image.fileName || image.filename || 'image.jpg', // Ensure proper name field
                type: lookup(image.uri)
            });
        });

        formData.append('userId', user.id);
        formData.append('groupId', group.id);
        try {
            const response = await imageApi.uploadImages(formData);
            console.log('Upload Success');
        }
        catch (error) {
            console.log('Upload Error:', error.response?.data || error.message);
        }
        loadPictures(setPictures, group, setLoading);
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
                style={styles.picHolder}>
                <Image
                    style={[styles.pic, winningBorder]}
                    source={{ uri: photo.url }}
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

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                "Permission Required",
                "You need to grant gallery access to upload images.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const pics = pictures.concat((result.assets).map((image) => { return { uri: image.url }; }));
            setPictures(pics);
            uploadPhotos(result);
        }
    };

    const takeImage = async () => {

        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                "Permission Required",
                "You need to grant camera access to take pictures.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
        });

        if (!result.canceled) {
            const pics = pictures.concat((result.assets).map((image) => { return { uri: image.url }; }));
            setPictures(pics);
            uploadPhotos(result);
        }
    };

    const addUserToGroup = async (id) => {
        try {
            await photoGroupApi.addUserToGroup(id, group.id).then(() => {
                getUser(setUser, navigation);
            });
        }
        catch (error) {
            console.log(error);
        }
    };

    const removeUserFromGroup = async (id) => {
        try {
            await photoGroupApi.removeUserFromGroup(id, group.id).then(() => {
                getUser(setUser, navigation);
            });
        }
        catch (error) {
            console.log(error);
        }
    };

    const deleteGroup = async () => {
        try {
            await photoGroupApi.deleteGroup(group.id).then(() => {
                getUser(setUser, navigation);
            });
            navigateBack();
        }
        catch (error) {
            console.log(error);
        }
    }

    // renavigates to home
    const navigateBack = () => {
        navigation.dispatch((state) => {
            const routes = state.routes.slice(0, -2); // Pop 1 screen from stack
            return CommonActions.reset({
                ...state,
                index: routes.length - 1,
                routes
            });
        });
        navigation.navigate('Home', { user });
    };


    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures(setPictures, group, setLoading);
    }, []);

    // Date calculations necessary for display
    const getDateInfo = () => {

        const current_date = new Date(Date.now());
        const expirationDate = new Date(group.expiresAt);
        const expirationDay = expirationDate.getDay();
        const isDay = current_date.getDate() === expirationDate.getDate() && current_date.getMonth() === expirationDate.getMonth();

        let secondsToEndDay = 0;
        if(isDay){
            secondsToEndDay = current_date.getTime();
            current_date.setHours(23, 59, 59);
            secondsToEndDay = Math.floor((current_date.getTime() - secondsToEndDay) / 1000);
        }

        return {
            isDay: isDay,                   // true if expiration day
            secondsLeft: secondsToEndDay,   // seconds tell group close
            day: expirationDay              // day of week to display
        }
    };
    const dateInfo = useRef(getDateInfo()).current;

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <Header
                backFunction={() => {navigateBack();}}
                title={group.name}
                buttons={
                    // Member bar toggle button
                    <TouchableOpacity style={groupStyles.membersButton} onPress={() => setMembersPopUpVisible(!membersPopUpVisible)}>
                        <Image style={groupStyles.membersIcon} source={require('../../assets/icons/people.png')} />
                    </TouchableOpacity>
                } />

            {/* add user pop-up */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={userModalVisible}
                onRequestClose={() => { setUserModalVisible(false); }}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => setUserModalVisible(false)} style={styles.modalBackground}>
                    <View style={styles.redModalBanner} />
                    <View style={styles.blueModalBanner} />
                    <TouchableOpacity activeOpacity={1} style={styles.popupView}>
                        <View style={styles.container}>
                            <FriendSearch
                                searchData={user.friends.filter((f) => !group.users.some((member) => member.id == f.id))}
                                onSelect={(friend) => {
                                    Alert.alert(
                                        `Add ${friend.username} to group?`,
                                        "They will have access to all photos in this group.",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Confirm", onPress: () => { addUserToGroup(friend.id) } }
                                        ]
                                    );
                                    setUserModalVisible(false);
                                }} />
                        </View>
                        <View style={groupStyles.modalCloseButtonContainer}>
                            <TouchableOpacity
                                style={groupStyles.modalCloseButton}
                                onPress={() => { setUserModalVisible(false); }}
                            >
                                <DefaultText style={styles.buttonText}>Close</DefaultText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.redModalBanner} />
                </TouchableOpacity>
            </Modal>

            {/* Options modal */}
            {/* owner: delete group & rename | member: leave group */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={optionsModalVisible}
                onRequestClose={() => { setOptionsModalVisible(false); }}
            >
                <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => setOptionsModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} style={[{top: optionsHeight + modalAdjustment + 52}, groupStyles.optionsContainer]}>
                        {group.ownerId == user.id ?
                            <View style={groupStyles.optionsButtonContainer}>
                                {/* DELETE BUTTON */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        Alert.alert(
                                            `Delete ${group.name}?`,
                                            "This will delete all photos stored here",
                                            [
                                                { text: "Cancel", style: "cancel" },
                                                { text: "Confirm", onPress: () => { deleteGroup() } }
                                            ]
                                        );
                                    }}
                                >
                                    <DefaultText style={styles.buttonText}>Delete Group</DefaultText>
                                </TouchableOpacity>

                                {/* RENAME BUTTON */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => { }}
                                >
                                    <DefaultText style={styles.buttonText}>Rename Group</DefaultText>
                                </TouchableOpacity>
                            </View>
                            :
                            /* LEAVE BUTTON */
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    Alert.alert(
                                        `Leave ${group.name}?`,
                                        "You will have to be invited back to rejoin.",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Confirm", onPress: () => { removeUserFromGroup(user.id); navigateBack(); } }
                                        ]
                                    );
                                }}
                            >
                                <DefaultText style={styles.buttonText}>Leave Group</DefaultText>
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Group members side bar popup */}
            <Members users={[...group.users].filter((u) => u.id != user.id)}
                membersPopUpVisible={membersPopUpVisible}
                setMembersPopUpVisible={setMembersPopUpVisible}
                press={(friend) => { setFriendClicked(friend); setFriendModalVisible(true); }}
            />

            {/* Group options bar */}
            <View style={groupStyles.topBar}>

                {/* Day tracker / timer */}
                <View style={groupStyles.timeContainer}>
                    <Image style={groupStyles.timerIcon} source={require('../../assets/icons/clock.png')} />
                    <View style={groupStyles.timerTextContainer}>
                        <DefaultText>Resets:</DefaultText>
                        {!dateInfo.isDay ?
                            <DefaultText style={styles.bold}>{days[dateInfo.day]}</DefaultText>
                            :
                            <Timer startTime={dateInfo.secondsLeft} />
                        }
                    </View>
                </View>

                {/* Ranking button */}
                <TouchableOpacity
                    style={groupStyles.topButton}
                    onPress={() => {
                        if (pictures.length < 2) {
                            Alert.alert(
                                'You need at least 2 images to rank!',
                                `Upload at least ${2 - pictures.length} more to get started.`,
                                [
                                    { text: "Confirm", style: "cancel" }
                                ]
                            );
                        } else {
                            navigation.navigate("Rank", { user: user, group: group });
                        }
                    }}>
                    <Image style={groupStyles.topButtonIcon} source={require('../../assets/icons/podium.png')} />
                    <DefaultText style={styles.buttonText}>Rank</DefaultText>
                </TouchableOpacity>

                {/* Options button */}
                <TouchableOpacity
                    ref={optionsButtonRef}
                    style={groupStyles.topButton}
                    onPress={() => { setOptionsModalVisible(true); }}
                    onLayout={() => {
                        optionsButtonRef.current.measureInWindow((x, y, width, height) => {
                            setOptionsHeight(y);
                        });
                    }}
                >
                    <Image
                        style={groupStyles.topButtonIcon}
                        source={require('../../assets/icons/options.png')}
                    />
                    <DefaultText style={styles.buttonText}>Options</DefaultText>
                </TouchableOpacity>
            </View>

            {/* group member preview */}
            <FriendModal
                friendClicked={friendClicked}
                setFriendClicked={setFriendClicked}
                friendModalVisible={friendModalVisible}
                setFriendModalVisible={setFriendModalVisible}
                removeFriendFromGroup={user.id == group.ownerId ? removeUserFromGroup : null}
            />

            {/* Photo list */}
            <ImageBackground resizeMode='stretch' source={require('../../assets/backgrounds/ImageListBackground.png')} style={groupStyles.backgroundContainer}>
                <View style={groupStyles.imagesContainer}>
                    {loading ?
                        <View style={styles.containerCenterAll}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                        :
                        pictures.length ?
                            <FlatList
                                numColumns={2}
                                renderItem={({ item }) => <Pic photo={item} pictures={pictures} />}
                                keyExtractor={(item) => item.id}
                                data={pictures}
                            />
                            :
                            <View style={styles.containerCenterAll}>
                                <DefaultText>Upload some pictures to get started!</DefaultText>
                            </View>

                    }
                </View>
            </ImageBackground>

            {/* Add images/users buttons */}
            <View style={groupStyles.bottomBar}>
                <TouchableOpacity style={styles.containerCenterAll}
                    onPress={() => { onPressPhotoUpload() }}>
                    <Image style={styles.iconStyle} source={require('../../assets/icons/image.png')} />
                </TouchableOpacity>
                <View style={groupStyles.bottomBarDivider} />
                <TouchableOpacity style={styles.containerCenterAll}
                    onPress={() => { setUserModalVisible(!userModalVisible) }}>
                    <Image style={styles.iconStyle} source={require('../../assets/icons/addFriend.png')} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export const loadPictures = async (setPictures, group, setLoading) => {
    try {
        const response = await imageApi.getGroupImages(group.id);
        if (response.data) {
            setPictures(response.data.sort((a, b) => b.points - a.points));
        }
        if (setLoading) setLoading(false);
    } catch (error) {
        console.log(error);
    }
}

const groupStyles = StyleSheet.create({
    membersButton:{ 
        height: '100%', 
        width: 70 
    },
    membersIcon:[
        styles.iconStyle, 
        { 
            backgroundColor: 'white', 
            borderRadius: 25 
        }
    ],
    modalCloseButtonContainer:{ 
        backgroundColor: colors.primary, 
        height: 50, 
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    modalCloseButton:[
        styles.button, 
        {
            width: '70%' 
        }
    ],
    optionsContainer:{ backgroundColor: 'white', 
        borderBottomLeftRadius: 5, 
        borderBottomRightRadius: 5, 
        padding: 8, 
        position: 'absolute', 
        right: 0, 
        alignSelf: 'baseline', 
        boxShadow: '0 8 5 0 rgba(0, 0, 0, .25)' 
    },
    optionsButtonContainer:{ 
        gap: 8 
    },
    topBar:{ 
        padding: 8, 
        backgroundColor: 'white', 
        borderBottomWidth: .5, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexDirection: 'row' 
    },
    timeContainer:{ 
        height: 50, 
        width: 154, 
        alignItems: 'center', 
        backgroundColor: '#CCCCCC', 
        alignSelf: 'flex-start', 
        borderRadius: 8, 
        flexDirection: 'row', 
        gap: 6  
    },
    timerIcon:[
        styles.iconStyle, 
        { 
            width: '28%', 
            marginLeft: 5 
        }
    ],
    timerTextContainer:{ 
        alignItems: 'center', 
        width: '60%' 
    },
    topButton:[
        styles.button, 
        { 
            height: 50 
        }
    ],
    topButtonIcon:[
        styles.iconStyle, 
        { 
            height: '60%' 
        }
    ],
    backgroundContainer:{ 
        flex: 1, 
        backgroundColor: 'white' 
    },
    imagesContainer:{ 
        flex: 1, 
        paddingHorizontal: 5 
    },
    bottomBar:{ 
        flexDirection: 'row', 
        height: '8%', 
        alignContent: 'space-between', 
        paddingHorizontal: 0,
        backgroundColor: colors.secondary 
    },
    bottomBarDivider:{ 
        width: 1,
        backgroundColor: 'white', 
        marginVertical: 9 
    },
});

const picStyles = StyleSheet.create({
    firstBorder:{
        borderWidth: 4,
        borderColor: '#FFD700'
    },
    secondBorder:{
        borderWidth: 4,
        borderColor: '#C0C0C0'
    },
    thirdBorder:{
        borderWidth: 4,
        borderColor: '#CD7F32'
    },
    points:{ 
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        backgroundColor: colors.primary, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    pfp:{
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        position: 'absolute', 
        bottom: 10, 
        left: 10, 
        backgroundColor: colors.primary, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
});