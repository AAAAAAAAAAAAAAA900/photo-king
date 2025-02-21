import { View, Image, TouchableOpacity } from 'react-native';
import styles, { colors } from '../styles/ComponentStyles.js';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import {API_URL} from "../api/utils";
import {useActionSheet} from "@expo/react-native-action-sheet";
import { lookup } from 'react-native-mime-types';
import { useEffect, useState } from 'react';
import { StackActions } from '@react-navigation/native';


export default function Pfp ({navigation, user, setUser, editable}){

    const [style, setStyle] = useState({});
    
    const press = () => {
        if(editable){
            onPressPhoto();
        } else{
            navigation.dispatch(StackActions.popToTop());
        }
    };

    useEffect(()=>{
        if(editable){
            setStyle({height: 200, width:200, borderWidth:5, borderRadius:100});
        } else{
            setStyle({height: 50, width:50, borderWidth:2, borderRadius:25});
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

        console.log(pfp.uri);
        formData.append('file', {
            uri: pfp.uri,
            name: pfp.fileName || pfp.filename || 'image.jpg', // Ensure proper name field
            type: lookup(pfp.uri)
        });

        formData.append('userId', user.id);

        try {
            const response = await axios.post(`${API_URL}/api/user-image/upload-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUser({...user, profileUrl:response.data});
            console.log('Upload Success');
            console.log(response.data);
        } catch (error) {
            console.log('Upload Error:', error.response?.data || error.message);
        }
    };

    return(
        <View style={{marginRight: 10}}>
            { user.profileUrl ?
                <TouchableOpacity
                onPressOut={press}
                >
                    <Image  
                    style={[style, {borderColor: colors.secondary}]}
                    source={{uri: user.profileUrl}} 
                    />
                </TouchableOpacity>
            : 
                <TouchableOpacity
                onPressOut={press}
                >
                    <Image  
                    style={[style, {borderColor: colors.secondary}]}
                    source={require('../../assets/icons/pfp.png')} 
                    />
                </TouchableOpacity>
            }
        </View>
    );
}