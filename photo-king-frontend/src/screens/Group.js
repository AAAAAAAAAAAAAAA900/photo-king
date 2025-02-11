import { SafeAreaView, FlatList, StyleSheet, View, Image, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { SearchBar } from '@rneui/themed';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import styles, { colors } from '../styles/ComponentStyles.js';
import {useEffect, useState} from "react";
import GroupPreview from '../components/GroupPreview.js';
import * as ImagePicker from 'expo-image-picker';

export default function GroupScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [uploadImage, setUploadImage] = useState([]);

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
            Alert.alert('Photo permissions are needed to upload from gallery!');
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
            Alert.alert('Photo permissions are needed to upload from gallery!');
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

    const templateData = [ // DELETE LATER 
        {username: 'Buckeye Bill', object: "Buckeye Bill's user obj"},
        {username: 'Matthew Hayes', object: "Matthew Hayes's user obj"},
        {username: 'Samwise', object: "Samwise's user obj"},
        {username: 'Robert J Wobert', object: "Robert J Wobert's user obj"},
        {username: 'Mean Martin', object: "Mean Martin's user obj"},
        {username: '123THE_GAMER123', object: "123THE_GAMER123's user obj"},
        {username: 'Meatball_Mike!', object: "Meatball_Mike!'s user obj"}
    ];
    // User search bar search function
    const search = (text) => {
        if (text){
            const data = /* API call: query for friends of user WHERE username LIKE '{text}%' */
                templateData.filter((item) => item.username.toLowerCase().includes(text.toLowerCase()));
            setFilteredData(data);
        } else{
            setFilteredData(templateData);
        }
    };

    // Update search results on type change
    useEffect(() => {
        search(userSearch);
    }, [userSearch]);

    return(
        <SafeAreaView style={{flex:1}}>

            {/* add photo pop-up */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={photoModalVisible}
                onRequestClose={() => {setPhotoModalVisible(!photoModalVisible);}}
            >
                <View style={styles.containerCenterAll}>
                    <View style={groupStyles.popupView}>
                        <TouchableOpacity style={[styles.button, {width:'50%', height:'100%'}]}
                            onPress={() => {
                                setPhotoModalVisible(!photoModalVisible);
                                takeImage();
                            }}>
                            <DefaultText>Camera</DefaultText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {width:'50%', height:'100%'}]}
                            onPress={() => {
                                setPhotoModalVisible(!photoModalVisible);
                                pickImage();
                            }}>
                            <DefaultText>Gallery</DefaultText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
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
                            <SearchBar
                                placeholder="Search Friends..."
                                onChangeText={(userSearch) => {setUserSearch(userSearch)}}
                                value={userSearch}
                                inputContainerStyle={[styles.textIn, {width:'100%'}]}
                                containerStyle={styles.containerCenterAll}
                                lightTheme={true}
                            />
                            <FlatList
                                data={filteredData}
                                keyExtractor={(item) => item.username}
                                renderItem={({item}) => <GroupPreview groupTitle={item.username} navFunction={() => {setUserModalVisible(!userModalVisible)}}  />}
                            />
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
                    onPress={() => {setPhotoModalVisible(!photoModalVisible)}}>
                    <DefaultText>Add photo</DefaultText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {width:'50%'}]}
                onPress={() => {setUserModalVisible(!userModalVisible)}}>
                    <DefaultText>Add user</DefaultText>
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