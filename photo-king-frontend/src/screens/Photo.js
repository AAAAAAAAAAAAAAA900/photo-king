import { useRoute } from "@react-navigation/native";
import { FlatList, Image, Modal, SafeAreaView, TextInput, TouchableOpacity, useWindowDimensions, View, Alert } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import DefaultText from "../components/DefaultText";
import { CommonActions } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import {API_URL} from "../api/utils";
import imageApi from "../api/imageApi";



export default function PhotoScreen ({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const photo = route.params?.photo;
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const { width, height } = useWindowDimensions();

    const deletePhoto = async () => {
        try {
            const response = await imageApi.deleteImage(photo.id);

            navigation.dispatch((state) => {
                const routes = state.routes.slice(0, -2); // Pop 2 screens from stack
                return CommonActions.reset({
                    ...state,
                    index: routes.length - 1,
                    routes
                });
            });
            navigation.navigate('Group', route.params);
        } catch (error) {
            console.log(error);
        }
    };

    return(
        <SafeAreaView style={{flex:1}}>

            <Modal
            animationType="fade"
            transparent={true}
            visible={photoModalVisible}
            onRequestClose={() => {setPhotoModalVisible(false);}}
            >
                <View style={[styles.containerCenterAll, {flex:1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                    <Image
                    source={{uri: photo.url}}
                    style={{height:'90%', width:'90%', resizeMode:'contain'}}
                    />
                    <TouchableOpacity
                    onPress={()=>{setPhotoModalVisible(false);}}
                    style={[styles.button, {position:'absolute', top:height*0.1, right:width*0.1}]}
                    >
                        <DefaultText>close icon</DefaultText>
                    </TouchableOpacity>
                </View>
            </Modal>

            <TouchableOpacity 
            style={{flex:1, maxHeight:'60%', maxWidth:'100%', backgroundColor:colors.grey }}
            onPress={()=>{setPhotoModalVisible(true);}}
            >
                <Image 
                source={{uri: photo.url}}
                style={{height:'100%', width:'100%', resizeMode:'contain'}}
                />
            </TouchableOpacity>
            <View borderWidth={1} style={{padding: 20, flexDirection:'row', backgroundColor:colors.primary}}>
                { photo.userId == user.id &&
                    <TouchableOpacity
                    onPress={()=>{Alert.alert(
                                        `Delete this photo?`,
                                        "It will be removed from the group for everyone.",
                                        [
                                            { text: "Cancel", style: "cancel"},
                                            { text: "Confirm", onPress: () => {deletePhoto()} }
                                        ]
                                    );}}
                    style={[styles.button, {backgroundColor: colors.secondary}]}
                    >
                        <DefaultText>Delete Photo</DefaultText>
                    </TouchableOpacity>
                }
                <TouchableOpacity
                onPress={()=>{}}
                style={[styles.button, {backgroundColor: colors.secondary}]}
                >
                    <DefaultText>Download</DefaultText>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <FlatList/>
                <TextInput
                style={[styles.textIn, {margin:20}]}
                onChangeText={()=>{}}
                placeholder="Enter Comment..."
                />
            </View>
        </SafeAreaView>
    );
}