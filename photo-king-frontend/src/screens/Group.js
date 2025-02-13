import { SafeAreaView, FlatList, StyleSheet, View, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import styles, { colors } from '../styles/ComponentStyles.js';
import {useEffect, useState} from "react";
import GroupPreview from '../components/GroupPreview.js';
import * as ImagePicker from 'expo-image-picker';
import { Controller } from 'react-hook-form';
import {useActionSheet} from "@expo/react-native-action-sheet";
import FriendSearch from '../components/FriendSearch.js';

export default function GroupScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [uploadImage, setUploadImage] = useState([]);

    const { showActionSheetWithOptions } = useActionSheet();

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
    }

    // FlatList element's view
    const Pic = ({ photo }) => {
        return <TouchableOpacity style={groupStyles.picHolder}>{photo.icon}</TouchableOpacity>;
    };

    // API call(?) to get photos from group
    const loadPictures /*= async*/ = () => {
        const pics = [];
        for (let i = 0; i < 3; ++i){
            pics[i]= {
                icon: (
                    <Image
                        style={groupStyles.pic}
                        source={require('../../assets/icons/icon.png')}
                        // defaultSource= default image to display while loading images.
                    />
                ),
                id:i.toString()
            };
        }
        setPictures(pics);
    }

    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures();
    }, []);
    
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                            // useMediaLibraryPermissions?

        if (status !== 'granted'){
            Alert.alert(
                "Permission Required",
                "You need to grant gallery access to upload images.",
                [
                    { text: "Cancel", style: "cancel"},
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return;
        }

        
        let result = await ImagePicker.launchImageLibraryAsync({
          /*mediaTypes: ['images', 'videos'],*/ //Uncomment for videos
          /*allowsEditing: true,*/ //uncomment if multiple selection false
          /*aspect: [4, 3],*/
          allowsMultipleSelection:true,
        });

        if (!result.canceled) {
            setUploadImage(result.assets);
            const pics = pictures.concat((result.assets).map((image) => {return {icon:(
                <Image
                    style={groupStyles.pic}
                    source={{uri:image.uri}}
                    // defaultSource= default image to display while loading images.
                />
            ), id:image.uri};}));
            setPictures(pics);
            /* API CALL ADD IMAGE TO TABLE */
        }
    };

    const takeImage = async () => {

        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted'){
            Alert.alert(
                "Permission Required",
                "You need to grant camera access to take pictures.",
                [
                    { text: "Cancel", style: "cancel"},
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
          /*mediaTypes: ['images', 'videos'],*/ //Uncomment for videos
          allowsEditing: true,
        });

        if (!result.canceled) {
            setUploadImage(result.assets);
            const pics = pictures.concat((result.assets).map((image) => {return {icon:(
                <Image
                    style={groupStyles.pic}
                    source={{uri:image.uri}}
                    // defaultSource= default image to display while loading images.
                />
            ), id:image.uri};}));
            setPictures(pics);
            /* API CALL ADD IMAGE TO TABLE */
        }
    };

    // const addUserToGroup = async (username) => {
    //     try {
    //         const response = await axios.get(`${API_URL}/api/user/get-user/${username}`,
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         setUser(response.data);
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // };

    return(
        <SafeAreaView style={{flex:1}}>

            {/* add photo pop-up 
            <Modal
                animationType="fade"
                transparent={true}
                visible={photoModalVisible}
                onRequestClose={() => {setPhotoModalVisible(false);}}
            >
                <View style={styles.containerCenterAll}>
                    <View style={groupStyles.popupView}>
                        <TouchableOpacity style={[styles.button, {width:'50%', height:'100%'}]}
                            onPress={() => {
                                setPhotoModalVisible(false);
                                takeImage();
                            }}>
                            <DefaultText>Camera</DefaultText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {width:'50%', height:'100%'}]}
                            onPress={() => {
                                setPhotoModalVisible(false);
                                pickImage();
                            }}>
                            <DefaultText>Gallery</DefaultText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            */}
            
            {/* add user pop-up */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={userModalVisible}
                onRequestClose={() => {setUserModalVisible(!userModalVisible);}}
                style={{justifyContent:'center'}}
            >
                <View style={styles.containerCenterAll}>
                    <View style={groupStyles.popupView}>
                        <View style={{flex:1}}>
                            <FriendSearch searchData={user.friends} onSelect={(friend) => {
                                Alert.alert(
                                    `Add ${friend} to group?`,
                                    "They will have access to all photos in this group.",
                                    [
                                        { text: "Cancel", style: "cancel"},
                                        { text: "Confirm", onPress: () => {/*addUserToGroup(friend);*/ console.log("Uncomment function");} }
                                    ]
                                );
                                setUserModalVisible(false);
                            }}/>
                        </View>
                    </View>
                </View>
            </Modal>

            <DefaultText> {JSON.stringify(user)} {JSON.stringify(group)}</DefaultText>

            {/* Photo list */}
            <View style={groupStyles.picList}>
                <FlatList 
                    numColumns={3}
                    renderItem={({ item }) => <Pic photo={item} />}
                    keyExtractor={(picture) => picture.id}
                    data={pictures}
                />
            </View>
            <View style={groupStyles.buttonHolder}>
                <TouchableOpacity style={[styles.button, {width:'50%'}]}
                    onPress={() => {onPressPhoto()}}>
                    <DefaultText>Add Photo</DefaultText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {width:'50%'}]}
                onPress={() => {setUserModalVisible(!userModalVisible)}}>
                    <DefaultText>Add User</DefaultText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const groupStyles = StyleSheet.create({
    picList: {
        flex: 1
    },
    picHolder: {
        flex:1,
        maxWidth: "33%",
        aspectRatio:1,
        alignItems:'center',
        margin: 1.5
    },
    pic: { 
        flex:1, 
        height:'100%', 
        width:'100%', 
        resizeMode:'cover' 
    },
    buttonHolder: {
        alignSelf: 'baseline',
        flexDirection:"row"
    },
    popupView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
        width:300,
        height:300,
        backgroundColor: colors.greyWhite
    }
});