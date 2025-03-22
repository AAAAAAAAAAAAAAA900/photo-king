import { SafeAreaView, FlatList, View, Image, TouchableOpacity, Modal, Linking, Alert, ImageBackground, ActivityIndicator, Platform } from 'react-native';
import {  useSafeAreaInsets } from 'react-native-safe-area-context';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import styles, { colors } from '../styles/ComponentStyles.js';
import {useEffect, useState, useCallback, useRef} from "react";
import * as ImagePicker from 'expo-image-picker';
import { CommonActions } from "@react-navigation/native";
import {useActionSheet} from "@expo/react-native-action-sheet";
import FriendSearch from '../components/FriendSearch.js';
import { lookup } from 'react-native-mime-types';
import Pfp from '../components/Pfp.js';
import Members from '../components/Members.js';
import imageApi from "../api/imageApi";
import photoGroupApi from "../api/photoGroupApi";
import FriendModal from '../components/FriendModal.js';
import Header from '../components/Header.js';
import Timer from '../components/Timer.js';

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
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const optionsButtonRef = useRef(null);
    const [optionsHeight, setOptionsHeight] = useState(0);
    const modalAdjustment = Platform.OS == 'ios' ? useSafeAreaInsets().top : 0;

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
        const pfp = group.users.find((value)=> {return value.id==photo.userId;})?.pfp;
        // Checks if picture is first, second, or third
        const winningBorder = {};
        if (photo.points != 0){
            for(let i = 0; i < pictures.length && i < 3; ++i){
                if(pictures[i].id == photo.id){
                    winningBorder['borderWidth'] = 4;
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
        }
        return (
            <TouchableOpacity 
            onPress={()=>navigation.navigate("Photo", {user: user, group: group, photo: photo})}
            style={styles.picHolder}>
                <Image
                    style={[styles.pic, winningBorder]}
                    source={{uri: photo.url}}
                />
                <View style={{width:30, height:30, borderRadius:15, position:'absolute', top:10, left:10, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                    <DefaultText>{photo.points}</DefaultText>
                </View>
                <View style={{width:50, height:50, borderRadius:25, position:'absolute', bottom:10, left:10, backgroundColor:colors.primary, alignItems:'center', justifyContent: 'center'}}>
                    <Pfp url={pfp}/>
                </View>
            </TouchableOpacity>
        );
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
            const groupsCopy = user.groups.filter((g) => g.id != group.id);
            groupsCopy.push(response.data);
            setUser({...user, groups: groupsCopy});   
        }
        catch (error) {
            console.log(error);
        }
    };

    const removeUserFromGroup = async (id) => {
        try {
            const response = await photoGroupApi.removeUserFromGroup(id, group.id);
            // remove current group then add back updated version
            const groupsCopy = user.groups.filter((g) => g.id != group.id);
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
        loadPictures(setPictures, group, setLoading).then(r => {});
    }, []);

    const getDateInfo = () => {

        const current_date = new Date(Date.now());
        const expirationDate = new Date(group.expiresAt);
        const expirationDay = expirationDate.getDay();
        const isDay = current_date.getDate() === expirationDate.getDate() && current_date.getMonth() === expirationDate.getMonth();

        
        let secondsToEndDay = current_date.getTime();
        current_date.setHours(23, 59, 59);
        secondsToEndDay = Math.floor((current_date.getTime() - secondsToEndDay)/1000);

        return {
            isDay: isDay, // adjusts sunday from 0 to 7 to match database
            secondsLeft: secondsToEndDay,
            day: expirationDay
        }
    };

    const dateInfo = useRef(getDateInfo()).current;
    

    return(
        <SafeAreaView style={{flex:1, backgroundColor:colors.secondary}}>
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
                <TouchableOpacity style={{height:'100%', width:70}} onPress={() => setMembersPopUpVisible(!membersPopUpVisible)}>
                    <Image style={[styles.iconStyle, {backgroundColor:'white', borderRadius:25}]} source={require('../../assets/icons/people.png')}/>
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
                <TouchableOpacity activeOpacity={1} onPress={()=>setUserModalVisible(false)} style={[styles.containerCenterAll, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                    <View style={{width:'75%', height:30, backgroundColor:colors.secondary}}/>
                    <View style={{width:'75%', height:10, backgroundColor:colors.primary}}/>
                    <TouchableOpacity
                    onPress={()=>{setUserModalVisible(false);}}
                    style={{position:'absolute', top:'15%', right:'10%', height:60, width:60}}
                    >
                        <Image style={styles.iconStyle} source={require('../../assets/icons/close.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.popupView}>
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
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'75%', height:10, backgroundColor:colors.primary}}/>
                    <View style={{width:'75%', height:30, backgroundColor:colors.secondary}}/>
                </TouchableOpacity>
            </Modal>

            {/* Options modal */}
            {/* owner: delete group & change title | member: leave group */}
            <Modal
            animationType="fade"
            transparent={true}
            visible={optionsModalVisible}
            onRequestClose={() => {setOptionsModalVisible(false);}}
            style={{justifyContent:'center'}}
            >
                <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={()=>setOptionsModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} style={{backgroundColor:'white', borderBottomLeftRadius:5, borderBottomRightRadius:5, padding:8, position:'absolute',right:0,top:optionsHeight+modalAdjustment+42, alignSelf:'baseline', boxShadow:'0 8 5 0 rgba(0, 0, 0, .25)'}}>
                        { group.ownerId == user.id ?
                            <View style={{gap:8}}>
                                <TouchableOpacity
                                style={styles.button}
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
                                <TouchableOpacity
                                style={styles.button}
                                onPress={()=>{}}
                                >
                                    <DefaultText>Rename Group</DefaultText>
                                </TouchableOpacity>
                            </View>
                        :
                            <TouchableOpacity
                            style={styles.button}
                            onPress={()=>{Alert.alert(
                                `Leave ${group.name}?`,
                                "You will have to be invited back to rejoin.",
                                [
                                    { text: "Cancel", style: "cancel"},
                                    { text: "Confirm", onPress: () => {removeUserFromGroup(user.id); setIsGroupDeleted(true);} }
                                ]
                            );}}
                            >
                                <DefaultText>Leave Group</DefaultText>
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Group members side bar popup */}
            <Members users={[...group.users].filter((u) => u.id != user.id)}
            membersPopUpVisible={membersPopUpVisible} 
            setMembersPopUpVisible={setMembersPopUpVisible}
            press={(friend)=>{setFriendClicked(friend); setFriendModalVisible(true);}}
            />
            
            {/* Group options bar */}
            <View style={{padding:8, backgroundColor:'white',borderBottomWidth:.5,justifyContent:'space-between', alignItems:'center',flexDirection:'row'}}>
                
                {/* Day tracker / timer */}
                <View style={{height:50, width: 154, alignItems:'center', backgroundColor:'#CCCCCC',  alignSelf: 'flex-start', borderRadius:8, flexDirection:'row', gap:6}}>
                    <Image style={[styles.iconStyle, {width:'28%', marginLeft:5}]} source={require('../../assets/icons/clock.png')}/>
                    <View style={{alignItems:'center', width:'60%'}}>
                        <DefaultText>Resets:</DefaultText>
                        {!dateInfo.isDay ?
                            <DefaultText style={{fontFamily: 'DMSans-Bold'}}>{days[dateInfo.day]}</DefaultText>
                        :
                            <Timer startTime={dateInfo.secondsLeft}/>
                        }
                    </View>
                </View>

                {/* Ranking button */}
                <TouchableOpacity
                style={styles.button}
                onPress={()=>{
                    if(pictures.length < 2){
                        Alert.alert(
                            'You need at least 2 images to rank!',
                            `Upload at least ${2-pictures.length} more to get started.`,
                            [
                                { text: "Confirm", style: "cancel"}
                            ]
                        );
                    } else {
                        navigation.navigate("Rank", {user: user, group: group});
                    }
                }}>
                    <Image style={styles.iconStyle} source={require('../../assets/icons/podium.png')}/>
                </TouchableOpacity>

                {/* Options button */}
                <TouchableOpacity 
                ref={optionsButtonRef} 
                style={styles.button} 
                onPress={()=>{setOptionsModalVisible(true);}}
                onLayout={()=>{
                    optionsButtonRef.current.measureInWindow((x, y, width, height) => {
                        setOptionsHeight(y);
                    });
                }}
                >
                    <Image 
                        style={styles.iconStyle} 
                        source={require('../../assets/icons/options.png')}
                    />
                </TouchableOpacity>
            </View>

            {/* group member preview */}
            <FriendModal 
            friendClicked={friendClicked}
            setFriendClicked={setFriendClicked}
            friendModalVisible={friendModalVisible}
            setFriendModalVisible={setFriendModalVisible}
            removeFriendFromGroup={ user.id == group.ownerId ? removeUserFromGroup : null}
            />

            {/* Photo list */}
            <ImageBackground resizeMode='stretch' source={require('../../assets/backgrounds/ImageListBackground.png')} style={{flex:1, backgroundColor:'white'}}>
                <View style={{flex:1}}>
                    { loading ? 
                        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
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
                            <View style={{alignItems:'center', justifyContent:'center', flex:1, padding:20}}>
                                <DefaultText>Upload some pictures to get started!</DefaultText>
                            </View>
                        
                    }
                </View>
            </ImageBackground>
            
            {/* Add images/users buttons */}
            <View style={{flexDirection:'row', height:'8%',alignContent:'space-between',paddingHorizontal:0, backgroundColor:colors.secondary}}>
                <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
                    onPress={() => {onPressPhoto()}}>
                    <Image style={styles.iconStyle} source={require('../../assets/icons/image.png')}/>
                </TouchableOpacity>
                <View style={{width:1, backgroundColor:'white', marginVertical:9}}/>
                <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
                onPress={() => {setUserModalVisible(!userModalVisible)}}>
                    <Image style={styles.iconStyle} source={require('../../assets/icons/addFriend.png')}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export const loadPictures = async (setPictures, group, setLoading) => {
    try {
        const response = await imageApi.getGroupImages(group.id);
        if(response.data){
            setPictures(response.data.sort((a,b)=> b.points-a.points));
        }
        if(setLoading) setLoading(false);
    } catch (error) {
        console.log(error);
    }
}