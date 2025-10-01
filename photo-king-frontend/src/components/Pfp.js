import { View, Image, TouchableOpacity, Modal, Platform, StyleSheet, Alert } from 'react-native';
import styles, { colors } from '../styles/ComponentStyles.js';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from "@expo/react-native-action-sheet";
import imageApi from "../api/imageApi";
import { lookup } from 'react-native-mime-types';
import { useRef, useState } from 'react';
import { StackActions } from '@react-navigation/native';
import DefaultText from './DefaultText.js';
import { clearTokens } from "../api/apiClient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUser } from '../screens/Login.js';
import { useUser } from './UserContext.js';
import userApi from '../api/userApi.js';


export default function Pfp({ navigation, user, setUser, url, size = 50, borderWidth = 0 }) {

    const pfpRef = useRef(null);
    const [modalHeight, setModalHeight] = useState(0);
    const modalAdjustment = Platform.OS == 'ios' ? useSafeAreaInsets().top : 0;
    const [optionsVisible, setOptionsVisible] = useState(false);
    const { showActionSheetWithOptions } = useActionSheet();
    const { user: userObj, updateUser } = useUser();

    const imageStyle = {
        height: size,
        width: size,
        borderRadius: size / 2,
        borderWidth: borderWidth,
        backgroundColor: 'white',
        borderColor: 'black'
    };

    // Determines if it should update pfp or open logout menu
    const press = () => {
        if (user) {
            onPressPhoto();
        } else {
            setOptionsVisible(!optionsVisible);
        }
    };

    // Determine pfp upload method
    const onPressPhoto = () => {
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
    };

    // upload from gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // useMediaLibraryPermissions?
        if (status !== 'granted') {
            Alert.alert(
                "Permission Required",
                "You need to grant gallery access to upload images to share with your friends.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!result.canceled) {
            uploadPfp(result.assets[0]);
        }
    };

    // take photo
    const takeImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                "Permission Required",
                "You need to grant camera access to take pictures to share with your friends.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            uploadPfp(result.assets[0]);
        }
    };

    // update pfp
    const uploadPfp = async (pfp) => {
        const formData = new FormData();

        formData.append('file', {
            uri: pfp.uri,
            name: pfp.fileName || pfp.filename || 'image.jpg', // Ensure proper name field
            type: lookup(pfp.uri)
        });

        formData.append('userId', user.id);

        try {
            const response = await imageApi.uploadProfile(formData);
            await getUser(setUser);

            console.log('Upload Success');
            console.log(response.data);
        } catch (error) {
            console.log('Upload Error:', error.response?.data || error.message);
        }
    };


    const logoutButtonPressed = async () => {
        await clearTokens();
        updateUser(null);
        navigation.dispatch(StackActions.popToTop());
    }

    const deleteButtonPressed = async () => {
        await userApi.deleteAccount(userObj.id);
        await clearTokens();
        updateUser(null);
        navigation.dispatch(StackActions.popToTop());
    }

    return (
        <View>
            {/* LOGOUT MENU */}
            <Modal
                visible={optionsVisible}
                onRequestClose={() => setOptionsVisible(false)}
                animationType="fade"
                transparent={true}
            >
                {/* MODAL CLOSE CLICK AREA */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.container}
                    onPress={() => setOptionsVisible(false)}
                >
                    <View style={[pfpStyles.buttonMenu, { top: modalHeight + 54 }]}>
                        {/* LOGOUT BUTTON */}
                        <TouchableOpacity
                            onPress={logoutButtonPressed}
                            style={pfpStyles.button}>
                            <DefaultText>Logout</DefaultText>
                        </TouchableOpacity>

                        {/* DIVIDER */}
                        <View style={pfpStyles.divider} />

                        {/* DELETE BUTTON */}
                        <TouchableOpacity
                            onPress={()=>{
                                Alert.alert(
                                    "Delete Account",
                                    "Are you sure you want to delete your account? This action cannot be undone.",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        { text: "Delete", style: "destructive", onPress: deleteButtonPressed }
                                    ]
                                );
                            }}
                            style={pfpStyles.button}>
                            <DefaultText style={pfpStyles.deleteButtonText}>Delete Account</DefaultText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* If no function for press, make its container a view */}
            {user || navigation ?
                <TouchableOpacity style={pfpStyles.pfpContainer}
                    onPress={press}
                >
                    <Image
                        ref={pfpRef}
                        style={imageStyle}
                        source={url ? { uri: url } : require('../../assets/icons/pfp.png')}
                        onLayout={() => {
                            pfpRef.current.measureInWindow((x, y, width, height) => {
                                setModalHeight(y + modalAdjustment);
                            });
                        }}
                    />
                </TouchableOpacity>
                :
                <View style={pfpStyles.pfpContainer}>
                    <Image
                        style={imageStyle}
                        source={url ? { uri: url } : require('../../assets/icons/pfp.png')}
                    />
                </View>
            }
        </View>
    );
}

const pfpStyles = StyleSheet.create({
    buttonMenu: {
        position: 'absolute',
        right: 10,
        height: 100,
        width: 85,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '5 5 5 0 rgba(0, 0, 0, 0.25)'
    },
    divider: {
        height:1,
        borderWidth:.5,
        width: '80%',
    },
    button: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpContainer: {
        alignSelf: 'baseline'
    },
    deleteButtonText: {
        color: 'red',
        textAlign:'center',
    },

});