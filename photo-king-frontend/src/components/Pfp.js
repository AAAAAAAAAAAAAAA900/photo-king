import { View, Image, TouchableOpacity, Modal } from 'react-native';
import styles, { colors } from '../styles/ComponentStyles.js';
import * as ImagePicker from 'expo-image-picker';
import {useActionSheet} from "@expo/react-native-action-sheet";
import imageApi from "../api/imageApi";
import { lookup } from 'react-native-mime-types';
import { useEffect, useState } from 'react';
import { StackActions } from '@react-navigation/native';
import DefaultText from './DefaultText.js';
import * as SecureStore from "expo-secure-store";
import {clearTokens} from "../api/apiClient";


export default function Pfp ({navigation, user, setUser, setUserUpdated, url, size}){

    const [style, setStyle] = useState({height: 50, width:50, borderRadius:25, backgroundColor:'white', borderColor:'white'});
    const [optionsVisible, setOptionsVisible] = useState(false);

    const press = () => {
        if(user){
            onPressPhoto();
        } else{
            setOptionsVisible(!optionsVisible);
        }
    };

    useEffect(()=>{
        if(size){
            setStyle({height: size, width:size, borderWidth:4, borderRadius:size/2,backgroundColor:'white', borderColor:'black'});
        }
    },[]);

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
            allowsEditing: true,
            aspect: [1,1],
        });
        if (!result.canceled) {
            uploadPfp(result.assets[0]);
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
            allowsEditing: true,
            aspect: [1,1],
        });

        if (!result.canceled) {
            uploadPfp(result.assets[0]);
        }
    };

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
            setUser({...user, profileUrl:response.data});
            setUserUpdated(true);
            console.log('Upload Success');
            console.log(response.data);
        } catch (error) {
            console.log('Upload Error:', error.response?.data || error.message);
        }
    };

    const logoutButton = async () => {
        await clearTokens();
        navigation.dispatch(StackActions.popToTop());
    }

    return(
        <View>

            <Modal
            visible={optionsVisible}
            onRequestClose={()=> setOptionsVisible(false)}
            animationType="fade"
            transparent={true}
            >
                <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={()=>setOptionsVisible(false)}>
                    <TouchableOpacity onPress={logoutButton} style={{position:'absolute', top:58, right:10, height:45, width:85, backgroundColor:'white', borderRadius:20, alignItems:'center', justifyContent:'center', boxShadow:'5 5 5 0 rgba(0, 0, 0, 0.25)'}}>
                        <DefaultText>Logout</DefaultText>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* If passed user or navigation make it clickable, else just a view */}
            {/* If passed a non empty url use it, else use default pfp icon */}
            { user || navigation ? ( url ?
                <TouchableOpacity style={{alignSelf:'baseline'}}
                onPress={press}
                >
                    <Image  
                    style={style}
                    source={{uri: url}} 
                    />
                </TouchableOpacity>
            : 
                <TouchableOpacity style={{alignSelf:'baseline'}}
                onPress={press}
                >
                    <Image  
                    style={style}
                    source={require('../../assets/icons/pfp.png')} 
                    />
                </TouchableOpacity>
            ) : ( url ?
                <View style={{alignSelf:'baseline'}}>
                    <Image  
                    style={style}
                    source={{uri: url}} 
                    />
                </View>
            : 
                <View style={{alignSelf:'baseline'}}>
                    <Image  
                    style={style}
                    source={require('../../assets/icons/pfp.png')} 
                    />
                </View>
            )}
        </View>
    );
}