import { View, Image, TouchableOpacity } from 'react-native';
import styles, { colors } from '../styles/ComponentStyles.js';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import {API_URL} from "../api/utils";
import {useActionSheet} from "@expo/react-native-action-sheet";
import imageApi from "../api/imageApi";
import { lookup } from 'react-native-mime-types';
import { useEffect, useState } from 'react';
import { StackActions } from '@react-navigation/native';


export default function Pfp ({navigation, user, setUser, url}){

    const [style, setStyle] = useState({height: 50, width:50, borderRadius:25, backgroundColor:'white', borderColor:'white'});
    
    const press = () => {
        if(user){
            onPressPhoto();
        } else{
            navigation.dispatch(StackActions.popToTop());
        }
    };

    useEffect(()=>{
        if(user){
            setStyle({height: 200, width:200, borderWidth:5, borderRadius:100,backgroundColor:'white', borderColor:'black'});
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
            console.log('Upload Success');
            console.log(response.data);
        } catch (error) {
            console.log('Upload Error:', error.response?.data || error.message);
        }
    };

    return(
        <View style={{marginRight: 10}}>
            {/* If passed user or navigation make it clickable, else just a view */}
            {/* If passed a non empty url use it, else use default pfp icon */}
            { user || navigation ? ( url ?
                <TouchableOpacity
                onPress={press}
                >
                    <Image  
                    style={style}
                    source={{uri: url}} 
                    />
                </TouchableOpacity>
            : 
                <TouchableOpacity
                onPress={press}
                >
                    <Image  
                    style={style}
                    source={require('../../assets/icons/pfp.png')} 
                    />
                </TouchableOpacity>
            ) : ( url ?
                <View>
                    <Image  
                    style={style}
                    source={{uri: url}} 
                    />
                </View>
            : 
                <View>
                    <Image  
                    style={style}
                    source={require('../../assets/icons/pfp.png')} 
                    />
                </View>
            )}
        </View>
    );
}