import { Modal, Alert, Image, SafeAreaView, TextInput, TouchableOpacity, View, Animated, Dimensions, FlatList, TouchableWithoutFeedback, Keyboard } from "react-native";
import DefaultText from "../components/DefaultText";
import { useRoute } from '@react-navigation/native';
import NavBar from "../components/NavBar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import FriendSearch, { FriendPreview } from "../components/FriendSearch";
import styles, { colors } from '../styles/ComponentStyles.js';
import {API_URL} from "../api/utils";
import Pfp from "../components/Pfp.js";
import userApi from "../api/userApi";
import FriendModal from "../components/FriendModal.js";
import Header from "../components/Header.js";
import TitleButtons from "../components/TitleButtons.js";



export default function FriendsScreen({navigation}){
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [loading, setLoading] = useState(false);
    const [friendsList, setFriendsList] = useState(route.params?.user.friends);
    const [userSearch, setUserSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friendModalVisible, setFriendModalVisible] = useState(false); 
    const [friendClicked, setFriendClicked] = useState(null);   
    const [invitesTab, setInvitesTab] = useState(false);
    const screenWidth = Dimensions.get("window").width;
    const slideAnim = useRef(new Animated.Value(0)).current; // for sliding invite tab off screen
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    const getSearchData = async (search) => {
        if(search){
            try{
                const response = await userApi.searchUsers(search);
                setSearchResults(response.data);
            }
            catch(e){
                console.log(e);
                setSearchResults([]);
            }
        } else{
            setSearchResults([]);
        }
    }

    useEffect(()=>{
        getSearchData(userSearch);
    }, [userSearch]);

    const addFriendPressed = async (username) => {
        // Check for user matching search
        let friend;
        try {
            const response = await userApi.getFriend(username);
            friend = response.data; // UserDTO
        }
        catch (error) {
            Alert.alert("No such user", 
                `No user found by username ${username}. Check to see you entered it correctly.`,
                [
                    { text: "Okay", style: "cancel"}
                ]
            );
            console.log(error);
            return(-1);
        }
        // Add Friend
        try {
            Alert.alert(`Send ${friend.username} a friend request?`, 
                'They will receive an invitation to become your friend',
                [
                    { text: "Cancel", style: "cancel"},
                    { text: "Send", onPress:() => addFriend(friend.id)}
                ]
            );
        }
        catch (error) {
            console.log(error);
        }
    };

    const addFriend = async (friendId) => {
        const response = await userApi.addFriend(user.id, friendId);
        // Update friends lists stored in front end
        setFriendsList([...response.data]);
        setUser({
            ...user,
            friends: response.data
        });
        closeModal();
    }

    const removeFriend = async (friendId) => {
        try {
            const response = await userApi.removeFriend(user.id, friendId);
            // Update friends lists stored in front end
            setFriendsList([...response.data]);
            setUser({
                ...user,
                friends: response.data
            });
        }
        catch (error) {
            console.log(error);
        }
        setFriendClicked(null); 
        setFriendModalVisible(false);
    }

    useEffect(()=>{
        setFriendModalVisible(true);
    }, [friendClicked]);

    useEffect(()=>{
        if(invitesTab){
            Animated.timing(slideAnim, {
                toValue: -screenWidth, // Slide into view
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        else{
            Animated.timing(slideAnim, {
                toValue: 0, // Slide into view
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [invitesTab]);

    const closeModal = ()=>{
        setAddFriendModalVisible(false);
        setUserSearch("");
    };

    return( 
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{flex:1}}>
                <Header border={true} title={'Friends'} buttons={<TitleButtons navigation={navigation} user={user}/>}/>
                
                {/* friend clicked modal */}  
                <FriendModal 
                friendClicked={friendClicked} 
                setFriendClicked={setFriendClicked}
                friendModalVisible={friendModalVisible} 
                setFriendModalVisible={setFriendModalVisible}
                removeFriend={removeFriend}
                />

                {/* add friend modal */}
                <Modal
                visible={addFriendModalVisible}
                onRequestClose={()=> closeModal()}
                transparent={true}
                animationType="fade"
                >
                    <TouchableOpacity style={[styles.containerCenterAll, {backgroundColor:'rgba(0,0,0,.5)'}]}
                    activeOpacity={1} 
                    onPress={() => closeModal()}
                    >
                        <TouchableOpacity style={{height:400, width:'90%', backgroundColor:'white',}}
                        onPress={()=> Keyboard.dismiss()}
                        activeOpacity={1}
                        >
                            <View style={{width:'100%', height:30, backgroundColor:colors.secondary}}/>
                            <View style={{width:'100%', height:10, backgroundColor:colors.primary}}/>
                            <View style={{flex:1, alignItems:"center"}}>
                                <View style={{flexDirection:'row', padding:5, justifyContent:'center'}}>
                                    <TextInput 
                                        style={[styles.textIn, {width:'60%', marginRight:5}]}
                                        onChangeText={(text) => setUserSearch(text)}
                                        autoCapitalize ='none'
                                        autoCorrect ={false}
                                        placeholder="Enter username"
                                        value={userSearch}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={()=>{addFriendPressed(userSearch);}}>
                                        <Image style={styles.iconStyle} source={require('../../assets/icons/addFriend.png')}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height:'100%', width:'90%'}}>
                                    <FlatList
                                    data={searchResults}
                                    renderItem={({item}) => <FriendPreview friend={item} press={() => {addFriendPressed(item.username);}}/>}
                                    ItemSeparatorComponent={ () => <View style={styles.separator} /> }
                                    keyExtractor={(item) => item.username}
                                    />
                                </View>
                            </View>
                            <View style={{width:'100%', height:10, backgroundColor:colors.primary}}/>
                            <View style={{width:'100%', height:30, backgroundColor:colors.secondary}}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            
                {/* TAB BAR */}
                <View style={{height:50, flexDirection:"row", width:'100%', backgroundColor:colors.secondary, padding:8}}>
                    <TouchableOpacity style={{flex:1, alignItems:"center", justifyContent:"center"}}
                    onPress={()=>setInvitesTab(false)}    
                    >
                        <View style={[{width:'50%', height:'100%', borderRadius:10, alignItems:"center", justifyContent:"center"}, (invitesTab ? {} : {backgroundColor:'rgba(0,0,0,0.1)', borderRadius:5})]}>
                            <DefaultText style={[styles.bold, {color:'white'}]}>Friends</DefaultText>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:1, height:'90%', backgroundColor:'black'}}/>
                    <TouchableOpacity style={{flex:1, alignItems:"center", justifyContent:"center"}}
                    onPress={()=>{Keyboard.dismiss(); setInvitesTab(true);}}
                    >
                        <View style={[{width:'50%', height:'100%', borderRadius:5, alignItems:"center", justifyContent:"center"}, (invitesTab ? {backgroundColor:'rgba(0,0,0,0.1)', borderRadius:5} : {})]}>
                            <DefaultText style={[styles.bold, {color:'white'}]}>Invites</DefaultText>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor:colors.primary, width:'100%', height:10}}/>

                <Animated.View style={{flex:1, width:'200%', flexDirection:"row", transform: [{ translateX: slideAnim }]}}>
                    {/* FRIENDS TAB */}
                    <View style={{flex:1}}>
                        <FriendSearch onSelect={(friend)=>{setFriendClicked({...friend});}} 
                        searchData={friendsList}/>
                    </View>
                        

                    {/* INVITES TAB */}
                    <View style={{flex:1}}>
                        <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
                            <DefaultText>No pending invites</DefaultText>
                        </View>
                    </View>
                </Animated.View>

                <View style={{height:60, width:'100%', padding:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.primary}}>
                    <TouchableOpacity style={{height:'100%', width:'100%', borderRadius:10, borderWidth:2, alignItems:"center", justifyContent:"center",borderColor:colors.secondary, backgroundColor:colors.secondary}}
                    onPress={()=> setAddFriendModalVisible(true)}
                    >
                        <DefaultText style={[styles.bold, {color:'white'}]} >Add Friend</DefaultText>
                    </TouchableOpacity>
                </View>

                <NavBar navigation={navigation} user={user} screen='Friends'/>
                
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}