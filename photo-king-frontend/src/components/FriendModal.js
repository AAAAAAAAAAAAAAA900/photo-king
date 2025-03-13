import { Alert, Modal, TouchableOpacity, View } from "react-native";
import Pfp from "./Pfp";
import DefaultText from "./DefaultText";
import styles, {colors} from "../styles/ComponentStyles";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";


export default function FriendModal({ friendClicked, setFriendClicked, friendModalVisible, setFriendModalVisible, removeFriend, removeFriendFromGroup }){

    const [bio, setBio] = useState("");

    const getBio = async (id) => {
        try{
            const response = await userApi.getBio(id);
            setBio(response.data);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=> {
        if(friendClicked){
            getBio(friendClicked.id);
        }
    }, [friendClicked]);

    return(
        friendClicked && (    // prevents instant rendering and friendClicked null errors
            <Modal
                animationType="fade"
                transparent={true}
                visible={friendModalVisible}
                onRequestClose={() => {setFriendModalVisible(false); setFriendClicked(null);}}
                style={{justifyContent:'center'}}
            >
                <TouchableOpacity activeOpacity={1} onPress={()=>{setFriendModalVisible(false); setFriendClicked(null);}} style={[styles.containerCenterAll, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                    <View style={{width:'75%', height:30, backgroundColor:colors.secondary}}/>
                    <View style={{width:'75%', height:10, backgroundColor:colors.primary}}/>
                    <TouchableOpacity activeOpacity={1} style={[styles.popupView, {justifyContent:"baseline", padding:10, gap:5, alignItems:'baseline'}]}>
                        <Pfp url={friendClicked.pfp} size={100}/>
                        <DefaultText style={[styles.titleText, {marginLeft:15}]}>{friendClicked.username}</DefaultText>
                        <View style={{height:65, width:'100%', borderWidth:1, borderRadius:10, padding:5}}>
                            <DefaultText>{bio}</DefaultText>
                        </View>
                        <View style={{flexDirection:'row', gap:10}}>
                            { removeFriend &&
                                <TouchableOpacity 
                                style={[styles.button, {backgroundColor:'red'}]}
                                onPress={() => {Alert.alert(
                                    `Remove ${friendClicked.username} as friend?`,
                                    "You will be removed from their friends list aswell.",
                                    [
                                        { text: "Confirm", onPress: ()=> {removeFriend(friendClicked.id); setFriendClicked(null); setFriendModalVisible(false);}},
                                        { text: "Cancel", style: "cancel"}
                                    ]
                                );}}
                                >
                                    <DefaultText>Remove Friend</DefaultText>
                                </TouchableOpacity>
                            }
                            { removeFriendFromGroup &&
                                <TouchableOpacity 
                                style={[styles.button, {backgroundColor:'red'}]}
                                onPress={() => {Alert.alert(
                                    `Remove ${friendClicked.username} from group?`,
                                    "This group will no longer appear on their home screen.",
                                    [
                                        { text: "Confirm", onPress: ()=> {removeFriendFromGroup(friendClicked.id); setFriendClicked(null); setFriendModalVisible(false);}},
                                        { text: "Cancel", style: "cancel"}
                                    ]
                                );}}
                                >
                                    <DefaultText>Remove From Group</DefaultText>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity 
                            style={styles.button}
                            onPress={() => { setFriendClicked(null); setFriendModalVisible(false);}}
                            >
                                <DefaultText>Close</DefaultText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'75%', height:10, backgroundColor:colors.primary}}/>
                    <View style={{width:'75%', height:30, backgroundColor:colors.secondary}}/>
                </TouchableOpacity>
            </Modal>
        )
    );
}