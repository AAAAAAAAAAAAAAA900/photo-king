import { Modal, Alert, Image, SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import DefaultText from "../components/DefaultText";
import { useRoute } from '@react-navigation/native';
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import FriendSearch from "../components/FriendSearch";
import styles, { colors } from '../styles/ComponentStyles.js';
import {API_URL} from "../api/utils";
import Pfp from "../components/Pfp.js";
import FriendModal from "../components/FriendModal.js";


export default function FriendsScreen({navigation}){
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [loading, setLoading] = useState(false);
    const [friendsList, setFriendsList] = useState(route.params?.user.friends);
    const [userSearch, setUserSearch] = useState("");
    const [friendModalVisible, setFriendModalVisible] = useState(false); 
    const [friendClicked, setFriendClicked] = useState(null);   

    if (!user){
        return(<DefaultText>ERROR CASE: user lost</DefaultText>)
    }

    useEffect(() => {
        navigation.setOptions({ user: user }); // pass user along to header
    }, [user]);

    const addFriend = async () => {
        // Check for user matching search
        let friend;
        try {
            const response = await axios.get(`${API_URL}/api/user/get-user/${userSearch}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            friend = response.data; // UserDTO
        }
        catch (error) {
            Alert.alert("No such user", 
                `No user found by username ${userSearch}. Check to see you entered it correctly.`,
                [
                    { text: "Okay", style: "cancel"}
                ]
            );
            console.log(error);
            return(-1);
        }
        // Add Friend
        try {
            const response = await axios.post(`${API_URL}/api/user/add-friend/${user.id}/${friend.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Update friends lists stored in front end
            setFriendsList([...response.data]);
            setUser({
                ...user,
                friends: response.data
            });
            setUserSearch("");
            Alert.alert("User added as friend.", 
                `The user ${friend.username} was added as friend.`,
                [
                    { text: "Okay", style: "cancel"}
                ]
            );
        }
        catch (error) {
            console.log(error);
        }
    };

    const removeFriend = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/api/user/remove-friend/${user.id}/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
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

    return( 
        <SafeAreaView style={{flex:1}}>

            {/* friend modal */}  
            <FriendModal 
            friendClicked={friendClicked} 
            setFriendClicked={setFriendClicked}
            friendModalVisible={friendModalVisible} 
            setFriendModalVisible={setFriendModalVisible}
            removeFriend={removeFriend}
            />
        
            <View style={{flex:1}}>
                <FriendSearch onSelect={(friend)=>{setFriendClicked({...friend});}} 
                searchData={friendsList}/>
            </View>
            <View style={{flexDirection:'row'}}>
                <TextInput 
                    style={styles.textIn}
                    onChangeText={(text) => setUserSearch(text)}
                    autoCapitalize ='none'
                    autoCorrect ={false}
                    placeholder="Enter username"
                    value={userSearch}
                />
                <TouchableOpacity style={styles.button} onPress={()=>{addFriend();}}>
                    <DefaultText>Add Friend</DefaultText>
                </TouchableOpacity>
            </View>
            <NavBar navigation={navigation} user={user} screen='Friends'/>
        </SafeAreaView>
    );
}