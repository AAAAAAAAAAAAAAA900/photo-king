import { SafeAreaView, FlatList, StyleSheet, View, Image, TouchableOpacity, Modal, Linking, Alert, Text } from 'react-native';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import styles, { colors } from '../styles/ComponentStyles.js';
import {useEffect, useState} from "react";
import GroupPreview from '../components/GroupPreview.js';
import * as ImagePicker from 'expo-image-picker';
import { Controller } from 'react-hook-form';
import {useActionSheet} from "@expo/react-native-action-sheet";
import FriendSearch from '../components/FriendSearch.js';
import axios from "axios";
import {API_URL} from "../api/utils";

export default function GroupScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);

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

    const uploadPhotos = async (images) => {
        const formData = new FormData();

        images.assets.forEach((image) => {
            formData.append('files', {
                uri: image.uri,
                name: image.fileName || image.filename || 'image.jpg', // Ensure proper name field
                type: image.type
            });
        });

        formData.append('userId', user.id);
        formData.append('groupId', group.id);

        try {
            const response = await axios.post(`${API_URL}/api/user-image/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload Success');
            console.log(response.data);
        } catch (error) {
            console.log('Upload Error:', error.response?.data || error.message);
        }

        loadPictures(setPictures, group);
    }

    // FlatList element's view
    const Pic = ({ photo }) => {
        return (
            <TouchableOpacity 
            onPress={()=>navigation.navigate("Photo", {user: user, group: group, photo: photo})}
            style={styles.picHolder}>
                <Image
                    style={styles.pic}
                    source={{uri: photo.url}}
                    // defaultSource= default image to display while loading images.
                />
            </TouchableOpacity>
        );
    };


    
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
          mediaTypes: ['images'],
          /*allowsEditing: true,*/ //uncomment if multiple selection false
          /*aspect: [4, 3],*/
          allowsMultipleSelection:true,
        });

        if (!result.canceled) {
            const pics = pictures.concat((result.assets).map((image) => {return {uri:image.url};}));
            setPictures(pics);
            /* API CALL ADD IMAGE TO TABLE */
            uploadPhotos(result);
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
            const pics = pictures.concat((result.assets).map((image) => {return {uri:image.url};}));
            setPictures(pics);
            /* API CALL ADD IMAGE TO TABLE */
            uploadPhotos(result);
        }
    };

    const addUserToGroup = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/api/user-groups/add-user/${id}/${group.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    };

    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures(setPictures, group).then(r => {});
    }, []);

    return(
        <SafeAreaView style={{flex:1}}>
            
            {/* add user pop-up */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={userModalVisible}
                onRequestClose={() => {setUserModalVisible(!userModalVisible);}}
                style={{justifyContent:'center'}}
            >
                <View style={styles.containerCenterAll}>
                    <View style={styles.popupView}>
                        <View style={{flex:1}}>
                            <FriendSearch searchData={user.friends} onSelect={(friend) => {
                                Alert.alert(
                                    `Add ${friend.username} to group?`,
                                    "They will have access to all photos in this group.",
                                    [
                                        { text: "Cancel", style: "cancel"},
                                        { text: "Confirm", onPress: () => {addUserToGroup(friend.id)} }
                                    ]
                                );
                                setUserModalVisible(false);
                            }}/>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Group title bar */}
            <View style={{padding:5, backgroundColor:colors.primary, flexDirection:'row'}}>
                <Text style={styles.titleText}>{group.name}</Text>
                <TouchableOpacity
                style={styles.button}
                onPress={()=>{navigation.navigate("Rank", {user: user, group: group});}}
                >
                    <DefaultText>Rank Images</DefaultText>
                </TouchableOpacity>
            </View>

            {/* Photo list */}
            <View style={groupStyles.picList}>
                <FlatList 
                    numColumns={3}
                    renderItem={({ item }) => <Pic photo={item} />}
                    keyExtractor={(picture) => picture.url}
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
    buttonHolder: {
        alignSelf: 'baseline',
        flexDirection:"row"
    },
});

export const loadPictures = async (setPictures, group) => {
    try {
        const response = await axios.get(`${API_URL}/api/user-image/get-group-images/${group.id}`);
        setPictures(response.data);
    } catch (error) {
        console.log(error);
    }
}