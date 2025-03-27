import { Modal, Alert, Image, SafeAreaView, TextInput, TouchableOpacity, View, Animated, Dimensions, FlatList, TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";
import DefaultText from "../components/DefaultText";
import { useRoute } from '@react-navigation/native';
import NavBar from "../components/NavBar";
import { useEffect, useMemo, useRef, useState } from "react";
import FriendSearch, { FriendPreview } from "../components/FriendSearch";
import styles, { colors } from '../styles/ComponentStyles.js';
import userApi from "../api/userApi";
import FriendModal from "../components/FriendModal.js";
import Header from "../components/Header.js";
import TitleButtons from "../components/TitleButtons.js";
import { debounce, update } from "lodash";
import requestApi from "../api/requestApi.js";
import Pfp from "../components/Pfp.js";
import { getUser } from "./Login.js";



export default function FriendsScreen({ navigation }) {
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [userSearch, setUserSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friendModalVisible, setFriendModalVisible] = useState(false);
    const [friendClicked, setFriendClicked] = useState(null);
    const [invitesTab, setInvitesTab] = useState(false);
    const [invites, setInvites] = useState([]);
    const screenWidth = Dimensions.get("window").width;
    const slideAnim = useRef(new Animated.Value(0)).current; // for sliding invite tab off screen
    const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

    // Queries users where username like search
    const getSearchData = async (search) => {
        if (search) {
            try {
                const response = await userApi.searchUsers(search);
                setSearchResults(response.data);
            }
            catch (e) {
                console.log(e);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    }
    const debouncedSearch = useMemo(() => debounce(getSearchData, 500), []);
    useEffect(() => {
        debouncedSearch(userSearch);
        return () => debouncedSearch.cancel();
    }, [userSearch]);

    // Friend request methods
    const getFriendRequests = async () => {
        try {
            const response = await requestApi.getFriendRequests(user.id);
            setInvites(response.data);
        }
        catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getFriendRequests();
    }, []);

    const acceptFriendRequest = async (requestId)=>{
        try{
            await requestApi.acceptFriendRequest(requestId).then(()=>{
                getFriendRequests();
                getUser(setUser, navigation);
            });            
        } catch (e){
            console.log(e);
        }
    };
    const rejectFriendRequest = async (requestId)=>{
        try{
            await requestApi.rejectFriendRequest(requestId).then(()=>{
                getFriendRequests();
                getUser(setUser, navigation);
            });
        } catch (e){
            console.log(e);
        }
    };

    // Methods for sending friend requests
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
                    { text: "Okay", style: "cancel" }
                ]
            );
            console.log(error);
            return (-1);
        }
        // Add Friend
        try {
            Alert.alert(`Send ${friend.username} a friend request?`,
                'They will receive an invitation to become your friend',
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Send", onPress: () => addFriend(friend.id) }
                ]
            );
        }
        catch (error) {
            console.log(error);
        }
    };

    const addFriend = async (friendId) => {
        try {
            const response = await requestApi.sendFriendRequest(user.id, friendId);
        } catch (e) {
            console.log(e);
        }
        finally {
            closeModal();
        }
    }

    // Removes Friend
    const removeFriend = async (friendId) => {
        try {
            await userApi.removeFriend(user.id, friendId).then(()=> getUser(setUser, navigation));
            // Update friends lists stored in front end
        }
        catch (error) {
            console.log(error);
        }
        setFriendClicked(null);
        setFriendModalVisible(false);
    }

    useEffect(() => {
        setFriendModalVisible(true);
    }, [friendClicked]);

    // Animates screen tabs
    useEffect(() => {
        if (invitesTab) {
            Animated.timing(slideAnim, {
                toValue: -screenWidth, // Slide into view
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        else {
            Animated.timing(slideAnim, {
                toValue: 0, // Slide into view
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [invitesTab]);

    const closeModal = () => {
        setAddFriendModalVisible(false);
        setUserSearch("");
    };

    // Invite list item
    const InviteItem = ({ invite }) => {
        const [inviter, setInviter] = useState(null);

        const getInviter = async (inviterId) => {
            try {
                const response = await userApi.getFriendById(inviterId);
                setInviter(response.data);
            }
            catch (e) {
                console.log(e);
            }
        }

        useEffect(() => {
            if (!inviter) {
                getInviter(invite.sender);
            }
        }, []);

        return (
            <View style={inviteStyles.container}>
                {/* Invite sender info */}
                <View style={inviteStyles.interiorContainer}>
                    <Pfp url={inviter?.pfp} />
                    <DefaultText numberOfLines={1} style={inviteStyles.username}>{inviter?.username}</DefaultText>
                </View>

                {/* Accept/reject buttons */}
                <View style={inviteStyles.interiorContainer}>
                    <TouchableOpacity style={inviteStyles.reject}
                    onPress={()=>{rejectFriendRequest(invite.id);}}
                    >
                        <Image style={styles.iconStyle} source={require('../../assets/icons/x.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={inviteStyles.accept}
                    onPress={()=>{acceptFriendRequest(invite.id);}}
                    >
                        <Image style={styles.iconStyle} source={require('../../assets/icons/addFriend.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
                <Header border={true} title={'Friends'} buttons={<TitleButtons navigation={navigation} user={user} />} />

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
                    onRequestClose={() => closeModal()}
                    transparent={true}
                    animationType="fade"
                >
                    <TouchableOpacity style={[styles.containerCenterAll, { backgroundColor: 'rgba(0,0,0,.5)' }]}
                        activeOpacity={1}
                        onPress={() => closeModal()}
                    >
                        <TouchableOpacity style={{ height: 400, width: '90%', backgroundColor: 'white', }}
                            onPress={() => Keyboard.dismiss()}
                            activeOpacity={1}
                        >
                            <View style={{ width: '100%', height: 30, backgroundColor: colors.secondary }} />
                            <View style={{ width: '100%', height: 10, backgroundColor: colors.primary }} />
                            <View style={{ flex: 1, alignItems: "center", }}>
                                <View style={{ flexDirection: 'row', padding: 5, justifyContent: 'center' }}>
                                    <TextInput
                                        style={[styles.textIn, { width: '60%', marginRight: 5 }]}
                                        onChangeText={(text) => setUserSearch(text)}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        placeholder="Enter username"
                                        value={userSearch}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={() => { addFriendPressed(userSearch); }}>
                                        <Image style={styles.iconStyle} source={require('../../assets/icons/addFriend.png')} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, width: '95%' }}>
                                    <FlatList
                                        data={searchResults}
                                        renderItem={({ item }) => <FriendPreview friend={item} press={() => { addFriendPressed(item.username); }} />}
                                        keyExtractor={(item) => item.username}
                                    />
                                </View>
                                <View style={{ backgroundColor: colors.primary, height: 50, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={[styles.button, { width: '70%' }]}
                                        onPress={() => { closeModal(); }}
                                    >
                                        <DefaultText style={styles.buttonText}>Close</DefaultText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 30, backgroundColor: colors.secondary }} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                {/* TAB BAR */}
                <View style={{ height: 50, flexDirection: "row", width: '100%', backgroundColor: colors.secondary, padding: 8 }}>
                    <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                        onPress={() => setInvitesTab(false)}
                    >
                        <View style={[{ width: '50%', height: '100%', borderRadius: 10, alignItems: "center", justifyContent: "center" }, (invitesTab ? {} : { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 5 })]}>
                            <DefaultText style={styles.buttonText}>Friends</DefaultText>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: 1, height: '90%', backgroundColor: 'black' }} />
                    <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                        onPress={() => { Keyboard.dismiss(); setInvitesTab(true); }}
                    >
                        <View style={[{ width: '50%', height: '100%', borderRadius: 5, alignItems: "center", justifyContent: "center" }, (invitesTab ? { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 5 } : {})]}>
                            <DefaultText style={styles.buttonText}>Invites</DefaultText>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: colors.primary, width: '100%', height: 10 }} />


                <Animated.View style={{ flex: 1, width: '200%', flexDirection: "row", backgroundColor: 'white', transform: [{ translateX: slideAnim }] }}>
                    {/* FRIENDS TAB */}
                    <View style={{ flex: 1 }}>
                        <FriendSearch onSelect={(friend) => { setFriendClicked({ ...friend }); }}
                            searchData={user.friends} />
                    </View>


                    {/* INVITES TAB */}
                    <View style={{ flex: 1 }}>
                        {invites.length ?
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <FlatList
                                    data={invites}
                                    renderItem={({ item }) => <InviteItem invite={item} />}
                                    keyExtractor={(item) => item.id}
                                />
                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <DefaultText>No pending invites</DefaultText>
                            </View>
                        }
                    </View>
                </Animated.View>

                <View style={{ height: 60, width: '100%', padding: 8, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary }}>
                    <TouchableOpacity style={{ height: '100%', width: '100%', borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center", borderColor: colors.secondary, backgroundColor: colors.secondary }}
                        onPress={() => setAddFriendModalVisible(true)}
                    >
                        <DefaultText style={styles.buttonText} >Add Friend</DefaultText>
                    </TouchableOpacity>
                </View>

                <NavBar navigation={navigation} user={user} screen='Friends' />

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const inviteStyles = StyleSheet.create({
    container: [
        styles.listItem,
        {
            padding:10,
            justifyContent: "space-between"
        }],
    interiorContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: "center"
    },
    username:[
        styles.bold, 
        { maxWidth: 115
    }],
    accept: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: 'green',
        padding: 4,
        alignItems: "center",
        justifyContent: "center"
    },
    reject: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: colors.secondary,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    }
});