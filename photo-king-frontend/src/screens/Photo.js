import { useRoute } from "@react-navigation/native";
import { FlatList, Image, Modal, SafeAreaView, TextInput, TouchableOpacity, useWindowDimensions, View, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import DefaultText from "../components/DefaultText";
import { CommonActions } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import {API_URL} from "../api/utils";
import imageApi from "../api/imageApi";
import Header from "../components/Header";



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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{flex:1}}>
                <Header title={group.name} backFunction={()=>{
                    navigation.dispatch((state) => {
                        const routes = state.routes.slice(0, -2); // Pop 2 screens from stack
                        return CommonActions.reset({
                            ...state,
                            index: routes.length - 1,
                            routes
                        });
                    });
                    navigation.navigate('Group', {user:user, group:group});
                }}/>

                <Modal
                animationType="fade"
                transparent={true}
                visible={photoModalVisible}
                onRequestClose={() => {setPhotoModalVisible(false);}}
                >
                    <TouchableOpacity activeOpacity={1} onPress={()=>setPhotoModalVisible(false)}
                    style={[styles.containerCenterAll, {flex:1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                        <TouchableOpacity style={{height:'90%', width:'90%'}} activeOpacity={1}>
                            <Image
                            source={{uri: photo.url}}
                            style={{height:'100%', width:'100%', resizeMode:'contain'}}
                            />
                            <TouchableOpacity
                            onPress={()=>{setPhotoModalVisible(false);}}
                            style={{position:'absolute', top:height*0.1, right:width*0.1, height:60, width:60}}
                            >
                                <Image style={[styles.iconStyle, {borderRadius:5, backgroundColor:'rgba(0,0,0,0.2)', boxShadow: '0 0 5 2 rgba(0, 0, 0, 0.25)'}]} source={require('../../assets/icons/close.png')}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
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
                        onPress={()=>{Keyboard.dismiss(); 
                                        Alert.alert(
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
                    onPress={()=>{Keyboard.dismiss();}}
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
        </TouchableWithoutFeedback>
    );
}