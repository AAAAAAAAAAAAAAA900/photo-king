import { SafeAreaView, FlatList, StyleSheet, View, Image, TouchableOpacity, Modal, Linking, Alert, Text, TouchableWithoutFeedback } from 'react-native';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import styles, { colors } from '../styles/ComponentStyles.js';
import {useEffect, useState} from "react";
import GroupPreview from '../components/GroupPreview.js';
import * as ImagePicker from 'expo-image-picker';
import { Controller } from 'react-hook-form';
import { CommonActions } from "@react-navigation/native";
import {useActionSheet} from "@expo/react-native-action-sheet";
import FriendSearch, { FriendPreview } from '../components/FriendSearch.js';
import axios from "axios";
import {API_URL} from "../api/utils";
import { lookup } from 'react-native-mime-types';
import Pfp from '../components/Pfp.js';
import Members from '../components/Members.js';
import imageApi from "../api/imageApi";
import photoGroupApi from "../api/photoGroupApi";
import FriendModal from '../components/FriendModal.js';
import Header from '../components/Header.js';
import TitleButtons from '../components/TitleButtons.js';

export default function GroupScreen({navigation}){
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [group, setGroup] = useState(route.params?.group);
    const [pictures, setPictures] = useState([]);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [isGroupDeleted, setIsGroupDeleted] = useState(false);
    const [membersPopUpVisible, setMembersPopUpVisible] = useState(false);
    const [friendModalVisible, setFriendModalVisible] = useState(false); 
    const [friendClicked, setFriendClicked] = useState(null);   

    useEffect(() => {
        setGroup(user.groups.filter((g)=>g.id == group.id)[0]);    // update group when members or name changes
    }, [user]);

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
                type: lookup(image.uri)
            });
        });

        formData.append('userId', user.id);
        formData.append('groupId', group.id);

        console.log(formData._parts);

        try {
            const response2 = await imageApi.uploadImages(formData);
            console.log('Upload Success');
        }
        catch (error) {
            console.log('Upload Error:', error.response?.data || error.message);
        }

        /*
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

         */

        loadPictures(setPictures, group);
    }

    // FlatList element's view
    const Pic = ({ photo }) => {
        // Checks if picture is first, second, or third
        const winningBorder = {};
        for(let i = 0; i < pictures.length && i < 3; ++i){
            if(pictures[i].id == photo.id){
                winningBorder['borderWidth'] = 4;
                winningBorder['borderRadius'] = 4;
                switch (i) {
                    case 0:
                        winningBorder['borderColor'] = '#FFD700'
                        break;
                    case 1:
                        winningBorder['borderColor'] = '#C0C0C0'
                        break;
                    case 2:
                        winningBorder['borderColor'] = '#CD7F32'
                        break;
                    default:
                        break;
                }
            }
        }
        return (
            <TouchableOpacity 
            onPress={()=>navigation.navigate("Photo", {user: user, group: group, photo: photo})}
            style={[styles.picHolder, winningBorder]}>
                <Image
                    style={styles.pic}
                    source={{uri: photo.url}}
                    // defaultSource= default image to display while loading images.
                />
                <View style={{width:30, height:30, borderRadius:15, position:'absolute', bottom:5, left:5, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                    <DefaultText>{photo.points}</DefaultText>
                </View>
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
            const response = await photoGroupApi.addUserToGroup(id, group.id);
            // remove current group then add back updated version
            const groupsCopy = user.groups.filter((g) => {g.id != group.id});
            groupsCopy.push(response.data);
            setUser({...user, groups: groupsCopy});   
        }
        catch (error) {
            console.log(error);
        }
    };

    const removeUserFromGroup = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/api/user-groups/remove-user/${id}/${group.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // remove current group then add back updated version
            const groupsCopy = user.groups.filter((g) => {g.id != group.id});
            groupsCopy.push(response.data);
            setUser({...user, groups: groupsCopy});   
        }
        catch (error) {
            console.log(error);
        }
    };

    const deleteGroup = async () => {
        try{
            const response2 = await photoGroupApi.deleteGroup(group.id);
            setUser({...user, groups: user.groups.filter((thisGroup) => thisGroup.id != group.id)});
            setIsGroupDeleted(true);
        }
        catch(error){
            console.log(error);
        }
    }

    // Ensures group is removed from user obj before navigation
    useEffect(() => {
        if(isGroupDeleted){
            navigation.dispatch((state) => {
                const routes = state.routes.slice(0, -2); // Pop 1 screen from stack
                return CommonActions.reset({
                    ...state,
                    index: routes.length - 1,
                    routes
                });
            });
            navigation.navigate('Home', {user:{...user, groups:user.groups.filter((g)=> g.id != group.id)}});
        }
    }, [isGroupDeleted]);


    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures(setPictures, group).then(r => {});
    }, []);

    return(
        <SafeAreaView style={{flex:1}}>
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
                navigation.navigate('Home', {user:user});
            }} 
            title={group.name} 
            buttons={
                <TouchableOpacity style={styles.button} 
                    onPress={() => setMembersPopUpVisible(!membersPopUpVisible)}
                >
                    <DefaultText>people</DefaultText>
                </TouchableOpacity>
            }/>


            {/* add user pop-up */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={userModalVisible}
                onRequestClose={() => {setUserModalVisible(false);}}
                style={{justifyContent:'center'}}
            >
                <View style={[styles.containerCenterAll, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                    <View style={styles.popupView}>
                        <View style={{width:'100%', height:'100%'}}>
                            <FriendSearch 
                            searchData={user.friends.filter((f)=>!group.users.some((member)=>member.id==f.id))} 
                            onSelect={(friend) => {
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
                            <TouchableOpacity style={styles.button} onPress={()=>setUserModalVisible(false)}>
                                <DefaultText>Close</DefaultText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Group members side bar popup */}
            <Members group={group}
            membersPopUpVisible={membersPopUpVisible} 
            setMembersPopUpVisible={setMembersPopUpVisible}
            press={(friend)=>{setFriendClicked(friend); setFriendModalVisible(true);}}
            />
            
            {/* Group title bar */}
            <View style={{padding:5, backgroundColor:colors.primary, flexDirection:'row'}}>
                {/* Disables ranking button if user already ranked this week */}
                { !group.userRanked[user.id] ?
                    <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{navigation.navigate("Rank", {user: user, group: group});}}
                    >
                        <DefaultText>Rank Images</DefaultText>
                    </TouchableOpacity>
                :
                    <View
                    style={[styles.button, {backgroundColor:'grey'}]}                >
                        <DefaultText>Rank Images</DefaultText>
                    </View>
                }
                { group.ownerId == user.id &&
                    <TouchableOpacity
                    style={[styles.button, {backgroundColor:colors.secondary}]}
                    onPress={()=>{Alert.alert(
                        `Delete ${group.name}?`,
                        "This will delete all photos stored here",
                        [
                            { text: "Cancel", style: "cancel"},
                            { text: "Confirm", onPress: () => {deleteGroup()} }
                        ]
                    );}}
                    >
                        <DefaultText>Delete Group</DefaultText>
                    </TouchableOpacity>
                }
            </View>

            {/* group member preview */}
            <FriendModal 
            friendClicked={friendClicked}
            setFriendClicked={setFriendClicked}
            friendModalVisible={friendModalVisible}
            setFriendModalVisible={setFriendModalVisible}
            removeFriendFromGroup={removeUserFromGroup}
            />

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
        const response = await imageApi.getGroupImages(group.id);
        setPictures(response.data.sort((a,b)=> b.points-a.points));
    } catch (error) {
        console.log(error);
    }
}