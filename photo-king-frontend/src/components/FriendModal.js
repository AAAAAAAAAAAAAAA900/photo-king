import { Alert, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Pfp from "./Pfp";
import DefaultText from "./DefaultText";
import styles, { colors } from "../styles/ComponentStyles";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";


export default function FriendModal({ friendClicked, setFriendClicked, friendModalVisible, setFriendModalVisible, removeFriend, removeFriendFromGroup }) {

    const [bio, setBio] = useState("");

    const getBio = async (id) => {
        try {
            const response = await userApi.getBio(id);
            setBio(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (friendClicked) {
            getBio(friendClicked.id);
        }
    }, [friendClicked]);

    return (
        friendClicked && (    // prevents instant rendering and friendClicked null errors
            <Modal
                animationType="fade"
                transparent={true}
                visible={friendModalVisible}
                onRequestClose={() => { setFriendModalVisible(false); setFriendClicked(null); }}
                style={{ justifyContent: 'center' }}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => { setFriendModalVisible(false); setFriendClicked(null); }} style={[styles.containerCenterAll, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                    <View style={{ width: '75%', height: 30, backgroundColor: colors.secondary }} />
                    <TouchableOpacity activeOpacity={1} style={[styles.popupView, { alignItems: "baseline", height: 320, justifyContent: "baseline" }]}>
                        <View style={{ width: '100%', height: 60, position: "absolute", top: 0, left: 0, backgroundColor: colors.secondary }} />

                        {/* Modal container */}
                        <View style={{ gap: 5, paddingHorizontal: 10, flex: 1, width: '100%' }}>

                            {/* PFP surrounded by white circle */}
                            <View style={{ alignSelf: 'baseline', padding: 10, backgroundColor: 'white', borderRadius: 200 }}>
                                <Pfp url={friendClicked.pfp} size={100} />
                            </View>

                            {/* Username */}
                            <DefaultText style={[styles.titleText, { marginLeft: 15 }]}>{friendClicked.username}</DefaultText>

                            {/* Bio */}
                            <View style={{ height: 65, width: '100%', borderRadius: 10, padding: 5 }}>
                                <DefaultText>{bio}</DefaultText>
                            </View>
                        </View>

                        {/* Buttons */}
                        <View style={{ flexDirection: 'row', width: '100%', padding: 10, backgroundColor: colors.primary, justifyContent: 'space-between' }}>
                            {removeFriend &&
                                <TouchableOpacity
                                    style={friendStyles.button}
                                    onPress={() => {
                                        Alert.alert(
                                            `Remove ${friendClicked.username} as friend?`,
                                            "You will be removed from their friends list aswell.",
                                            [
                                                { text: "Confirm", onPress: () => { removeFriend(friendClicked.id); setFriendClicked(null); setFriendModalVisible(false); } },
                                                { text: "Cancel", style: "cancel" }
                                            ]
                                        );
                                    }}
                                >
                                    <DefaultText style={friendStyles.buttonText}>Remove Friend</DefaultText>
                                </TouchableOpacity>
                            }

                            {removeFriendFromGroup &&
                                <TouchableOpacity
                                    style={friendStyles.button}
                                    onPress={() => {
                                        Alert.alert(
                                            `Remove ${friendClicked.username} from group?`,
                                            "This group will no longer appear on their home screen.",
                                            [
                                                { text: "Confirm", onPress: () => { removeFriendFromGroup(friendClicked.id); setFriendClicked(null); setFriendModalVisible(false); } },
                                                { text: "Cancel", style: "cancel" }
                                            ]
                                        );
                                    }}
                                >
                                    <DefaultText style={friendStyles.buttonText}>Kick From Group</DefaultText>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity
                                style={friendStyles.button}
                                onPress={() => { setFriendClicked(null); setFriendModalVisible(false); }}
                            >
                                <DefaultText style={friendStyles.buttonText}>Close</DefaultText>
                            </TouchableOpacity>
                        </View>

                    </TouchableOpacity>
                    <View style={{ width: '75%', height: 30, backgroundColor: colors.secondary }} />
                </TouchableOpacity>
            </Modal>
        )
    );
}

const friendStyles= StyleSheet.create({
    button:{
        height: 40, 
        width: '45%', 
        borderRadius: 10, 
        backgroundColor: colors.secondary, 
        alignItems: "center", 
        justifyContent: "center"
    },
    buttonText: [
        styles.bold, 
        { 
        color: 'white', 
        textAlign: 
        'center' 
    }],

});